const STORAGE_KEY_META = "plongee_meta_progression";
const STORAGE_KEY_RUN = "plongee_active_run";

/**
 * Sauvegarde la méta-progression permanente (Or, améliorations d'équipement, tonneau commun).
 * @param {object} stats - Objet global des statistiques de plongée.
 */
export function saveProgression(stats) {
  try {
    const data = {
      coins: stats.coins || 0,
      barrelInventory: stats.barrelInventory || [],
      upgrades: stats.upgrades || {
        damageLevel: 1,
        speedLevel: 1,
        o2Level: 1,
        hpLevel: 1,
      },
      damage: stats.damage || 15,
      speed: stats.speed || 250,
      maxO2: stats.maxO2 || 60,
      maxHp: stats.maxHp || 100,
    };
    localStorage.setItem(STORAGE_KEY_META, JSON.stringify(data));
  } catch (err) {
    console.warn("Erreur sauvegarde progression plongee :", err);
  }
}

/**
 * Charge et applique la méta-progression sauvegardée dans l'objet stats.
 * @param {object} stats - Objet global des statistiques de plongée à hydrater.
 */
export function loadProgression(stats) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_META);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.coins === "number") stats.coins = data.coins;
    if (Array.isArray(data.barrelInventory)) stats.barrelInventory = data.barrelInventory;
    if (data.upgrades) {
      stats.upgrades = { ...stats.upgrades, ...data.upgrades };
    }
    if (typeof data.damage === "number") stats.damage = data.damage;
    if (typeof data.speed === "number") stats.speed = data.speed;
    if (typeof data.maxO2 === "number") {
      stats.maxO2 = data.maxO2;
      stats.o2 = data.maxO2;
    }
    if (typeof data.maxHp === "number") {
      stats.maxHp = data.maxHp;
      stats.hp = data.maxHp;
    }
  } catch (err) {
    console.warn("Erreur chargement progression plongee :", err);
  }
}

/**
 * Sauvegarde l'état d'un run actif (joueur en pleine plongée allant dans les paramètres).
 * @param {object} stats - Statistiques actuelles du joueur.
 * @param {{x: number, y: number}} playerPos - Coordonnées du joueur dans le monde.
 */
export function saveActiveRun(stats, playerPos) {
  try {
    if (!playerPos || stats.hp <= 0) {
      clearActiveRun();
      return;
    }
    const data = {
      pos: { x: playerPos.x, y: playerPos.y },
      hp: stats.hp,
      o2: stats.o2,
      inventory: stats.inventory || [],
      gameTimer: stats.gameTimer || 0,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY_RUN, JSON.stringify(data));
  } catch (err) {
    console.warn("Erreur sauvegarde run actif :", err);
  }
}

/**
 * Charge l'état du run actif sauvegardé, ou renvoie null si aucun run n'est en cours.
 * @returns {object|null} Données du run ou null.
 */
export function loadActiveRun() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RUN);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && data.pos && typeof data.hp === "number" && data.hp > 0) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Supprime le run actif en cours (ex: après une mort ou à la fin d'une partie).
 */
export function clearActiveRun() {
  try {
    localStorage.removeItem(STORAGE_KEY_RUN);
  } catch {
    /* ignore */
  }
}

/**
 * Passerelle prête pour synchroniser avec l'API PostgreSQL dès que le backend de Justine est branché.
 * @param {string|number} userId - Identifiant de l'utilisateur connecté.
 * @param {string} token - Token JWT d'authentification.
 * @param {object} stats - Données actuelles à synchroniser.
 */
export async function syncWithServer(userId, token, stats) {
  if (!token || !userId) return null;
  // TODO : appel API vers /api/users/{userId}/progress
  return stats;
}
