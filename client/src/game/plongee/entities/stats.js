/**
 * @typedef {object} GameStats
 * @property {number} speed - Vitesse de nage et de déplacement du joueur.
 * @property {number} maxO2 - Capacité maximale des réserves d'oxygène (en secondes).
 * @property {number} o2 - Niveau actuel d'oxygène.
 * @property {number} maxHp - Points de vie maximaux du joueur.
 * @property {number} hp - Points de vie actuels du joueur.
 * @property {number} damage - Dégâts infligés par le coup d'estoc au harpon.
 * @property {number} coins - Nombre total de pièces d'or accumulées.
 * @property {Array<object>} inventory - Butin temporaire transporté dans le sac personnel.
 * @property {Array<object>} barrelInventory - Butin sécurisé déposé dans le tonneau commun.
 * @property {boolean} isPlayerOnBoat - Indique si le joueur se trouve actuellement sur la barque.
 * @property {string|null} currentInteraction - Type d'interaction à portée ("barrel" | "fisherman" | null).
 * @property {object|null} notification - État de la bannière temporaire de notification HUD.
 * @property {string} weapon - Arme équipée par le plongeur.
 * @property {object} upgrades - Niveaux actuels des 4 arbres d'amélioration d'équipement.
 * @property {number} gameTimer - Chronomètre de la partie en secondes.
 * @property {boolean} isTimerRunning - Indique si le chronomètre est actif.
 * @property {boolean} bossDefeated - Indique si le Boss Requin a été vaincu.
 * @property {number|null} finalTime - Temps final enregistré lors de la victoire.
 * @property {number} bossHp - Points de vie actuels du Boss Requin.
 * @property {number} bossMaxHp - Points de vie maximaux du Boss Requin (600).
 * @property {boolean} bossActive - Indique si la barre de vie du Boss doit être affichée à l'écran.
 */

/**
 * Magasin d'état réactif et global des statistiques de jeu.
 * Partagé entre le moteur Kaplay et les composants d'interface React.
 * @type {GameStats}
 */
export const stats = {
  speed: 250, // Vitesse de base du joueur
  maxO2: 60, // Secondes d'air maximales
  o2: 60,
  maxHp: 100, // Points de vie
  hp: 100,
  damage: 15, // Dégâts du coup d'estoc au harpon
  coins: 0, // Pièces d'or récoltées
  get gold() {
    return this.coins;
  },
  set gold(val) {
    this.coins = val;
  },
  inventory: [], // Butin personnel dans le sac à dos (perdu à la mort en mer)
  barrelInventory: [], // Butin commun stocké dans le tonneau de la barque
  isPlayerOnBoat: true, // Statut de position du joueur (sur la barque vs en mer)
  currentInteraction: null, // "barrel" | "fisherman" | null
  notification: null, // { text: "...", color: [r, g, b], timer: 2.8 }
  weapon: "harpon",
  upgrades: {
    damageLevel: 1,
    speedLevel: 1,
    o2Level: 1,
    hpLevel: 1,
  },

  // Speedrun et Boss
  gameTimer: 0,
  isTimerRunning: true,
  bossDefeated: false,
  finalTime: null,
  bossHp: 600,
  bossMaxHp: 600,
  bossActive: false,
};

/**
 * Déclenche une bannière de notification visuelle au centre de l'écran du joueur.
 * @param {string} text - Message textuel affiché dans la bannière.
 * @param {number[]} [color=[255, 255, 255]] - Couleur RGB du texte et de la bordure [R, G, B].
 * @param {number} [duration=2.8] - Durée d'affichage en secondes avant disparition.
 */
export function triggerNotification(text, color = [255, 255, 255], duration = 2.8) {
  stats.notification = { text, color, timer: duration };
}
