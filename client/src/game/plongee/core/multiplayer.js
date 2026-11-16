import { spawnRemotePlayer } from "../entities/remotePlayer.js";
import { stats, triggerNotification } from "../entities/stats.js";

/**
 * Registre actif des joueurs distants indexés par leur identifiant unique.
 * @type {Map<string|number, import("kaplay").GameObj>}
 */
const remotePlayers = new Map();

/**
 * Référence à la connexion active (ex: Socket.io ou bus d'événements).
 */
let activeSocket = null;

/**
 * Identifiant du joueur local dans la session multijoueur.
 */
let localPlayerId = null;

/**
 * Horodatage de la dernière émission de position pour le contrôle de débit (20 Hz / 50ms).
 */
let lastBroadcastTime = 0;

/**
 * Configure et initialise le module multijoueur du mini-jeu de plongée.
 * Établit les canaux de réception et de transmission des données entre le moteur
 * de jeu Kaplay et la couche réseau Socket.IO / WebSockets.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {import("kaplay").GameObj} localPlayer - Entité du joueur local.
 * @param {object} [options={}] - Options de configuration multijoueur.
 * @param {object|null} [options.socket=null] - Instance Socket.IO fournie par le pôle réseau.
 * @param {string|number} [options.myId="local"] - Identifiant du joueur courant.
 * @param {Array<object>} [options.initialPlayers=[]] - Liste des autres joueurs déjà présents dans le salon.
 * @param {boolean} [options.mock=false] - Active un coéquipier simulé pour tester localement sans serveur.
 * @returns {object} Contrôleur d'API multijoueur pour synchroniser les actions.
 */
export function setupMultiplayer(k, localPlayer, options = {}) {
  activeSocket = options.socket || null;
  localPlayerId = options.myId || "local_player";

  // Réinitialisation préalable de la liste des joueurs distants
  cleanupMultiplayer();

  // Création des coéquipiers déjà connectés au salon
  if (Array.isArray(options.initialPlayers)) {
    let colorIdx = 0;
    for (const p of options.initialPlayers) {
      if (p.id !== localPlayerId) {
        addRemotePlayer(k, p.id, p.pseudo || `Plongeur-${p.id}`, p.x || 0, p.y || -58, colorIdx++);
      }
    }
  }

  // --- 1. BRANCHEMENT DES ÉCOUTEURS RÉSEAU (Socket.io) ---
  if (activeSocket) {
    bindSocketEvents(k, activeSocket);
  }

  // --- 2. ÉCOUTEURS D'ÉVÉNEMENTS INTERNES (Découplage React / Composants) ---
  const handleExtPlayerJoin = (e) => {
    const detail = e.detail;
    if (detail && detail.id !== localPlayerId) {
      addRemotePlayer(k, detail.id, detail.pseudo, detail.x || 0, detail.y || -58);
      triggerNotification(`( + ) ${detail.pseudo || "Un joueur"} a rejoint la plongee !`, [56, 189, 248], 2.5);
    }
  };

  const handleExtPlayerLeave = (e) => {
    const id = e?.detail?.id;
    if (id) {
      removeRemotePlayer(id);
      triggerNotification("( - ) Un coequipier s est deconnecte", [248, 113, 113], 2.5);
    }
  };

  window.addEventListener("plongee-multi-player-joined", handleExtPlayerJoin);
  window.addEventListener("plongee-multi-player-left", handleExtPlayerLeave);

  // --- 3. MODE SIMULATION / TEST LOCAL (Permet de tester sans attendre le backend réseau) ---
  if (options.mock) {
    setupMockTeammate(k);
  }

  // Boucle de mise à jour Kaplay : émission périodique de l'état du joueur local à 20 Hz
  const unregisterLoop = k.onUpdate(() => {
    const now = k.time();
    if (now - lastBroadcastTime >= 0.05) {
      lastBroadcastTime = now;
      broadcastLocalState(localPlayer);
    }
  });

  return {
    broadcastAction: (actionType, payload) => broadcastLocalAction(actionType, payload),
    syncBarrel: (barrelInventory) => broadcastBarrelSync(barrelInventory),
    cleanup: () => {
      unregisterLoop();
      window.removeEventListener("plongee-multi-player-joined", handleExtPlayerJoin);
      window.removeEventListener("plongee-multi-player-left", handleExtPlayerLeave);
      cleanupMultiplayer();
    },
  };
}

/**
 * Associe tous les événements entrants de la socket aux actions du moteur de jeu.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {object} socket - Instance Socket.IO.
 */
function bindSocketEvents(k, socket) {
  // Arrivée d'un nouveau joueur dans le salon
  socket.on("player_joined", (data) => {
    if (data?.id && data.id !== localPlayerId) {
      addRemotePlayer(k, data.id, data.pseudo, data.x, data.y);
    }
  });

  // Mise à jour de déplacement et animation d'un coéquipier
  socket.on("player_moved", (data) => {
    if (!data?.id || data.id === localPlayerId) return;
    const remote = remotePlayers.get(data.id);
    if (remote?.syncState) {
      remote.syncState(data);
    }
  });

  // Action spéciale effectuée par un coéquipier (coup de harpon, dégâts)
  socket.on("player_action", (data) => {
    if (!data?.id || data.id === localPlayerId) return;
    const remote = remotePlayers.get(data.id);
    if (!remote) return;

    if (data.type === "attack" && remote.playAttack) {
      remote.playAttack(data.dir || 1);
    } else if (data.type === "hurt" && remote.playHurt) {
      remote.playHurt();
    }
  });

  // Départ ou déconnexion d'un joueur
  socket.on("player_left", (data) => {
    if (data?.id) {
      removeRemotePlayer(data.id);
    }
  });

  // Synchronisation du tonneau commun de la barque
  socket.on("sync_barrel", (data) => {
    if (Array.isArray(data?.barrelInventory)) {
      stats.barrelInventory = data.barrelInventory;
      window.dispatchEvent(new CustomEvent("plongee-inventory-updated"));
    }
  });

  // Synchronisation des points de vie du Boss Requin
  socket.on("sync_boss", (data) => {
    if (data && typeof data.hp === "number" && !stats.bossDefeated) {
      stats.bossHp = data.hp;
      const bosses = k.get("requin-boss");
      for (const b of bosses) {
        if (b.setHP) b.setHP(data.hp);
      }
    }
  });
}

/**
 * Instancie et enregistre un nouveau joueur distant dans la scène Kaplay.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {string|number} id - Identifiant du joueur.
 * @param {string} pseudo - Nom affiché.
 * @param {number} x - Coordonnée X.
 * @param {number} y - Coordonnée Y.
 * @param {number} [paletteIndex] - Index de teinte visuelle.
 * @returns {import("kaplay").GameObj} L'entité créée.
 */
export function addRemotePlayer(k, id, pseudo, x = 0, y = -58, paletteIndex = undefined) {
  if (remotePlayers.has(id)) {
    removeRemotePlayer(id);
  }
  const colorIdx = paletteIndex !== undefined ? paletteIndex : remotePlayers.size;
  const remote = spawnRemotePlayer(k, id, pseudo, x, y, colorIdx);
  remotePlayers.set(id, remote);
  return remote;
}

/**
 * Supprime un joueur distant de la scène et du registre.
 *
 * @param {string|number} id - Identifiant du joueur à retirer.
 */
export function removeRemotePlayer(id) {
  const player = remotePlayers.get(id);
  if (player?.cleanup) {
    player.cleanup();
  }
  remotePlayers.delete(id);
}

/**
 * Émet l'état courant (position, orientation, animation, survie) du joueur local sur le réseau.
 *
 * @param {import("kaplay").GameObj} player - Entité locale du joueur.
 */
function broadcastLocalState(player) {
  if (!player?.pos) return;

  const payload = {
    id: localPlayerId,
    x: Math.round(player.pos.x),
    y: Math.round(player.pos.y),
    flipX: Boolean(player.flipX),
    anim: player.curAnim?.() || "idle",
    hp: stats.hp,
    o2: Math.round(stats.o2),
  };

  if (activeSocket?.emit) {
    activeSocket.emit("player_move", payload);
  }

  // Transmission locale via événement custom pour découplage éventuel
  window.dispatchEvent(
    new CustomEvent("plongee-local-player-moved", { detail: payload }),
  );
}

/**
 * Transmet une action ponctuelle du joueur local (attaque au harpon, coup reçu).
 *
 * @param {string} type - Type de l'action ("attack" | "hurt" | "death").
 * @param {object} [data={}] - Métadonnées complémentaires.
 */
export function broadcastLocalAction(type, data = {}) {
  const payload = {
    id: localPlayerId,
    type,
    ...data,
  };

  if (activeSocket?.emit) {
    activeSocket.emit("player_action", payload);
  }
}

/**
 * Synchronise le contenu du tonneau de butin commun avec les autres joueurs.
 *
 * @param {Array<object>} barrelInventory - Liste des butins stockés dans le tonneau.
 */
export function broadcastBarrelSync(barrelInventory) {
  if (activeSocket?.emit) {
    activeSocket.emit("sync_barrel", { barrelInventory });
  }
}

/**
 * Initialise un coéquipier simulé (bot) pour valider l'affichage multijoueur
 * en autonomie sans connexion réseau active.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 */
function setupMockTeammate(k) {
  const mockId = "mock_coop_player";
  const bot = addRemotePlayer(k, mockId, "Coéquipier (Démo)", 45, -58, 0);

  // Simulation d'une petite routine de nage autonome
  let botTimer = 0;
  k.onUpdate(() => {
    if (!bot.exists()) return;
    botTimer += k.dt();
    const mockX = 45 + Math.sin(botTimer * 1.5) * 60;
    const mockY = -58 + Math.max(0, Math.sin(botTimer * 0.8) * 220);
    bot.syncState({
      x: mockX,
      y: mockY,
      flipX: Math.cos(botTimer * 1.5) < 0,
      anim: mockY > 0 ? "swim" : "walk",
      hp: 100,
      o2: 55,
    });
  });
}

/**
 * Nettoie et détruit tous les joueurs distants actifs en mémoire.
 */
export function cleanupMultiplayer() {
  for (const [, player] of remotePlayers) {
    if (player?.cleanup) {
      player.cleanup();
    }
  }
  remotePlayers.clear();
}
