/**
 * Palette de couleurs distinctives attribuées aux joueurs distants
 * pour les différencier visuellement du joueur local sur l'écran.
 */
export const REMOTE_PLAYER_PALETTES = [
  { name: "Cyan", color: [100, 230, 255], hex: "#64e6ff" },
  { name: "Ambre", color: [255, 200, 80], hex: "#ffc850" },
  { name: "Emeraude", color: [130, 255, 140], hex: "#82ff8c" },
  { name: "Violet", color: [215, 140, 255], hex: "#d78cff" },
];

/**
 * Crée et configure l'entité visuelle d'un joueur distant (coéquipier) dans Kaplay.
 * Cette entité n'écoute aucune commande clavier : ses déplacements et animations
 * sont pilotés par les paquets réseau reçus via WebSockets.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {string|number} id - Identifiant unique du joueur distant.
 * @param {string} pseudo - Nom d'utilisateur affiché au-dessus du plongeur.
 * @param {number} startX - Position X initiale.
 * @param {number} startY - Position Y initiale.
 * @param {number} [paletteIndex=0] - Index de la couleur d'identification du joueur.
 * @returns {import("kaplay").GameObj} Entité du joueur distant initialisée.
 */
export function spawnRemotePlayer(k, id, pseudo, startX, startY, paletteIndex = 0) {
  const WATER_LEVEL = 0;
  const palette = REMOTE_PLAYER_PALETTES[paletteIndex % REMOTE_PLAYER_PALETTES.length];
  const initialUnderwater = startY > WATER_LEVEL;
  const initialSprite = initialUnderwater ? "diver-idle" : "diver-idle-boat";

  const remotePlayer = k.add([
    k.sprite(initialSprite),
    k.pos(startX, startY),
    k.scale(2),
    k.anchor("center"),
    k.color(palette.color[0], palette.color[1], palette.color[2]),
    k.z(45), // Rendu au même plan que le plongeur local
    "remote-player",
    `remote-${id}`,
    {
      playerId: id,
      pseudo: pseudo || `Plongeur-${id}`,
      targetPos: k.vec2(startX, startY),
      currentAnim: initialUnderwater ? "idle" : "idle-boat",
      isUnderwater: initialUnderwater,
      hp: 100,
      maxHp: 100,
      o2: 60,
      maxO2: 60,
    },
  ]);

  if (initialUnderwater) {
    remotePlayer.play("idle");
  }

  // --- ÉTIQUETTE DU PSEUDO (BADGE ACCESSIBLE RETRO) ---
  const badgeWidth = Math.max(50, remotePlayer.pseudo.length * 8 + 12);
  const nameBg = k.add([
    k.rect(badgeWidth, 16),
    k.pos(startX, startY - 26),
    k.anchor("center"),
    k.color(10, 18, 30),
    k.outline(1, k.rgb(palette.color[0], palette.color[1], palette.color[2])),
    k.opacity(0.85),
    k.z(46),
  ]);

  const nameText = k.add([
    k.text(remotePlayer.pseudo, { size: 9, font: "Silkscreen" }),
    k.pos(startX, startY - 26),
    k.anchor("center"),
    k.color(palette.color[0], palette.color[1], palette.color[2]),
    k.z(47),
  ]);

  // Synchronisation continue de la position de l'étiquette et interpolation fluide (Dead Reckoning doux)
  remotePlayer.onUpdate(() => {
    if (!remotePlayer.exists()) return;

    // Lissage du déplacement entre les paquets réseau (60 FPS lerp)
    remotePlayer.pos = remotePlayer.pos.lerp(remotePlayer.targetPos, 0.35);

    if (nameBg.exists()) {
      nameBg.pos.x = remotePlayer.pos.x;
      nameBg.pos.y = remotePlayer.pos.y - 26;
    }
    if (nameText.exists()) {
      nameText.pos.x = remotePlayer.pos.x;
      nameText.pos.y = remotePlayer.pos.y - 26;
    }
  });

  /**
   * Met à jour l'état, la position cible et l'animation du joueur distant depuis le réseau.
   *
   * @param {object} payload - Données reçues du serveur.
   * @param {number} payload.x - Nouvelle position X.
   * @param {number} payload.y - Nouvelle position Y.
   * @param {boolean} payload.flipX - Orientation horizontale.
   * @param {string} payload.anim - Animation à jouer ("idle" | "swim" | "walk" | "attack").
   * @param {number} [payload.hp] - Points de vie actuels.
   * @param {number} [payload.o2] - Niveau d'oxygène actuel.
   */
  remotePlayer.syncState = (payload) => {
    if (!remotePlayer.exists() || !payload) return;

    if (Number.isFinite(payload.x) && Number.isFinite(payload.y)) {
      remotePlayer.targetPos = k.vec2(payload.x, payload.y);
    }

    remotePlayer.flipX = Boolean(payload.flipX);

    const isUnderwater = remotePlayer.targetPos.y > WATER_LEVEL;
    const targetAnim = payload.anim || (isUnderwater ? "idle" : "idle-boat");

    if (remotePlayer.currentAnim !== targetAnim) {
      remotePlayer.currentAnim = targetAnim;
      const spriteName = determineSpriteName(targetAnim, isUnderwater);
      remotePlayer.use(k.sprite(spriteName));
      if (targetAnim !== "idle-boat") {
        remotePlayer.play(targetAnim);
      }
    }

    if (payload.hp !== undefined) remotePlayer.hp = payload.hp;
    if (payload.o2 !== undefined) remotePlayer.o2 = payload.o2;
  };

  /**
   * Déclenche l'animation d'attaque au harpon du joueur distant.
   *
   * @param {number} dir - Direction du coup (-1 pour gauche, 1 pour droite).
   */
  remotePlayer.playAttack = (dir) => {
    if (!remotePlayer.exists()) return;
    const isUnderwater = remotePlayer.pos.y > WATER_LEVEL;
    const attackSprite = isUnderwater ? "diver-attack-underwater" : "diver-attack";
    remotePlayer.use(k.sprite(attackSprite));
    remotePlayer.play("attack");
    remotePlayer.flipX = dir < 0;

    // Visualisation brève de la portée du harpon
    const hitCenter = k.vec2(remotePlayer.pos.x + dir * 35, remotePlayer.pos.y);
    const harpoonFx = k.add([
      k.rect(32, 10),
      k.pos(hitCenter),
      k.anchor("center"),
      k.color(palette.color[0], palette.color[1], palette.color[2]),
      k.opacity(0.65),
      k.z(44),
    ]);
    k.wait(0.12, () => {
      if (harpoonFx.exists()) k.destroy(harpoonFx);
    });

    k.wait(0.35, () => {
      if (remotePlayer.exists()) {
        const resetSprite = isUnderwater ? "diver-idle" : "diver-idle-boat";
        remotePlayer.use(k.sprite(resetSprite));
        if (isUnderwater) remotePlayer.play("idle");
        remotePlayer.currentAnim = isUnderwater ? "idle" : "idle-boat";
      }
    });
  };

  /**
   * Déclenche l'animation visuelle de dégâts reçus (flash rouge).
   */
  remotePlayer.playHurt = () => {
    if (!remotePlayer.exists()) return;
    remotePlayer.color = k.rgb(255, 60, 60);
    k.wait(0.18, () => {
      if (remotePlayer.exists()) {
        remotePlayer.color = k.rgb(
          palette.color[0],
          palette.color[1],
          palette.color[2],
        );
      }
    });
  };

  /**
   * Supprime proprement le joueur distant et ses éléments d'interface associés.
   */
  remotePlayer.cleanup = () => {
    if (nameBg.exists()) k.destroy(nameBg);
    if (nameText.exists()) k.destroy(nameText);
    if (remotePlayer.exists()) k.destroy(remotePlayer);
  };

  return remotePlayer;
}

/**
 * Associe une animation logique au nom de sprite Kaplay correspondant selon l'environnement.
 *
 * @param {string} anim - Identifiant de l'animation.
 * @param {boolean} isUnderwater - Indique si l'entité est sous la surface de l'eau.
 * @returns {string} Nom du sprite Kaplay chargé en mémoire.
 */
function determineSpriteName(anim, isUnderwater) {
  if (anim === "swim" || (anim === "walk" && isUnderwater)) {
    return "diver-swim";
  }
  if (anim === "walk") {
    return "diver-walk";
  }
  if (anim === "attack") {
    return isUnderwater ? "diver-attack-underwater" : "diver-attack";
  }
  return isUnderwater ? "diver-idle" : "diver-idle-boat";
}
