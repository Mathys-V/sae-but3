import { stats } from "../entities/stats.js";

/**
 * Formate un nombre de secondes sous la forme textuelle "MM:SS".
 * @param {number} seconds - Durée en secondes.
 * @returns {string} Durée formatée.
 */
function formatTime(seconds) {
  if (typeof seconds !== "number" || Number.isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Initialise l'ensemble des éléments de l'affichage tête haute (HUD) en jeu :
 * jauge de profondeur, barres d'O2 et de PV, chronomètre speedrun, inventaire,
 * bannières d'interaction contextuelles et barre de vie du Boss final.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {import("kaplay").GameObj} player - Référence de l'entité joueur.
 */
export function setupUI(k, player) {
  const MAX_DEPTH = 12000;

  // --- 1. JAUGE DE PROFONDEUR ---
  k.add([
    k.rect(15, 300),
    k.pos(20, 50),
    k.color(0, 0, 0),
    k.opacity(0.5),
    k.fixed(),
    k.z(100),
  ]);

  const cursor = k.add([
    k.sprite("depth-cursor"),
    k.pos(15, 50),
    k.anchor("right"),
    k.scale(1.5),
    k.fixed(),
    k.z(101),
  ]);

  const depthText = k.add([
    k.text("0m", { size: 16, font: "Silkscreen" }),
    k.pos(45, 48),
    k.color(255, 255, 255),
    k.fixed(),
    k.z(100),
  ]);

  // --- 2. BARRES DE SURVIE (Sprites) ---
  k.add([
    k.text("O2", { size: 14, font: "Silkscreen" }),
    k.pos(72, 17),
    k.color(100, 210, 255),
    k.fixed(),
    k.z(100),
  ]);

  const o2Bar = k.add([
    k.sprite("o2-bar", { frame: 16 }),
    k.pos(112, 14),
    k.scale(2.6),
    k.fixed(),
    k.z(100),
  ]);

  k.add([
    k.text("HP", { size: 14, font: "Silkscreen" }),
    k.pos(72, 47),
    k.color(255, 110, 110),
    k.fixed(),
    k.z(100),
  ]);

  const hpBar = k.add([
    k.sprite("hp-bar", { frame: 16 }),
    k.pos(112, 44),
    k.scale(2.6),
    k.fixed(),
    k.z(100),
  ]);

  // --- 3. CHRONOMÈTRE SPEEDRUN ---
  const timerText = k.add([
    k.text("CHRONO: 00:00", { size: 16, font: "Silkscreen" }),
    k.pos(k.width() / 2, 28),
    k.anchor("center"),
    k.color(255, 230, 100),
    k.fixed(),
    k.z(100),
  ]);

  // --- 4. AFFICHAGE OR ET INVENTAIRE (Sac vs Tonneau) ---
  const goldText = k.add([
    k.text("OR: 0", { size: 16, font: "Silkscreen" }),
    k.pos(k.width() - 250, 18),
    k.color(255, 215, 0),
    k.fixed(),
    k.z(100),
  ]);

  const inventoryText = k.add([
    k.text("SAC: 0 | TONNEAU: 0", { size: 13, font: "Silkscreen" }),
    k.pos(k.width() - 250, 48),
    k.color(220, 235, 255),
    k.fixed(),
    k.z(100),
  ]);

  // --- 5. BANNIÈRE D'INTERACTION DANS LE HUD (En plein milieu de l'écran, Pixel Art WCAG AA) ---
  const actionPromptBg = k.add([
    k.rect(600, 52, { radius: 0 }),
    k.pos(k.width() / 2, k.height() / 2 - 45),
    k.anchor("center"),
    k.color(10, 18, 30),
    k.outline(3, k.rgb(250, 204, 21)),
    k.fixed(),
    k.z(150),
    k.opacity(0),
  ]);

  const actionPromptText = k.add([
    k.text("", { size: 18, font: "Silkscreen" }),
    k.pos(k.width() / 2, k.height() / 2 - 45),
    k.anchor("center"),
    k.color(255, 255, 255),
    k.fixed(),
    k.z(151),
    k.opacity(0),
  ]);

  // Bannière de notification HUD (positionnée plus haut que le centre de l'écran pour dégager la vue du joueur)
  const notifBannerBg = k.add([
    k.rect(660, 50, { radius: 0 }),
    k.pos(k.width() / 2, k.height() / 2 - 115),
    k.anchor("center"),
    k.color(10, 18, 30),
    k.outline(3, k.rgb(251, 191, 36)),
    k.fixed(),
    k.z(150),
    k.opacity(0),
  ]);

  const notifBannerText = k.add([
    k.text("", { size: 17, font: "Silkscreen" }),
    k.pos(k.width() / 2, k.height() / 2 - 115),
    k.anchor("center"),
    k.color(255, 255, 255),
    k.fixed(),
    k.z(151),
    k.opacity(0),
  ]);

  // --- 6. BARRE DE VIE DU BOSS FINAL ---
  const BOSS_BAR_W = 420;
  const BOSS_BAR_H = 18;

  const bossTitle = k.add([
    k.text("BOSS REQUIN - BOSS FINAL", { size: 16, font: "Silkscreen" }),
    k.pos(k.width() / 2, k.height() - 70),
    k.anchor("center"),
    k.color(255, 80, 80),
    k.fixed(),
    k.z(120),
    k.opacity(0),
  ]);

  const bossBarBg = k.add([
    k.rect(BOSS_BAR_W + 6, BOSS_BAR_H + 6, { radius: 0 }),
    k.pos(k.width() / 2, k.height() - 38),
    k.anchor("center"),
    k.color(10, 15, 25),
    k.outline(2, k.rgb(220, 38, 38)),
    k.fixed(),
    k.z(120),
    k.opacity(0),
  ]);

  const bossBarFill = k.add([
    k.rect(BOSS_BAR_W, BOSS_BAR_H, { radius: 0 }),
    k.pos(k.width() / 2 - BOSS_BAR_W / 2, k.height() - 38),
    k.anchor("left"),
    k.color(220, 38, 38),
    k.fixed(),
    k.z(121),
    k.opacity(0),
  ]);

  const bossHpText = k.add([
    k.text("600 / 600 PV", { size: 14, font: "Silkscreen" }),
    k.pos(k.width() / 2, k.height() - 38),
    k.anchor("center"),
    k.color(255, 255, 255),
    k.fixed(),
    k.z(122),
    k.opacity(0),
  ]);

  // Variables de cache pour ne pas forcer le recalcul de texture à chaque frame
  let cachedTimerSec = -1;
  let cachedDepth = -1;
  let cachedCoins = -1;
  let cachedItems = "";
  let cachedBossHp = -1;

  // --- 7. SOUS-FONCTIONS DE MISE À JOUR POUR RÉDUIRE LA COMPLEXITÉ COGNITIVE ---
  const updateChrono = () => {
    if (!stats.isTimerRunning || stats.bossDefeated) return;
    stats.gameTimer += k.dt();
    const currentSec = Math.floor(stats.gameTimer);
    if (currentSec !== cachedTimerSec) {
      cachedTimerSec = currentSec;
      timerText.text = `CHRONO: ${formatTime(stats.gameTimer)}`;
    }
  };

  const updateDepthGauge = () => {
    if (!player?.pos) return;
    const depthRatio = Math.max(0, Math.min(player.pos.y / MAX_DEPTH, 1));
    const currentY = 50 + depthRatio * 292;
    cursor.pos.y = currentY;
    depthText.pos.y = currentY - 4;

    const DIVISEUR_PROFONDEUR = 35;
    const displayDepth = Math.max(0, Math.floor(player.pos.y / DIVISEUR_PROFONDEUR));
    if (displayDepth !== cachedDepth) {
      cachedDepth = displayDepth;
      depthText.text = `${displayDepth}m`;
    }
  };

  const updateVitalsBars = () => {
    const o2Frame = Math.round((stats.o2 / stats.maxO2) * 16);
    const hpFrame = Math.round((stats.hp / stats.maxHp) * 16);
    o2Bar.frame = Math.max(0, Math.min(16, o2Frame));
    hpBar.frame = Math.max(0, Math.min(16, hpFrame));
  };

  const updateInventoryHUD = () => {
    const curCoins = stats.coins || 0;
    if (curCoins !== cachedCoins) {
      cachedCoins = curCoins;
      goldText.text = `OR: ${curCoins}`;
    }

    const curBag = (stats.inventory || []).reduce((acc, i) => acc + (i.qty || 1), 0);
    const curBarrel = (stats.barrelInventory || []).reduce((acc, i) => acc + (i.qty || 1), 0);
    const invKey = `${curBag}-${curBarrel}`;
    if (invKey !== cachedItems) {
      cachedItems = invKey;
      inventoryText.text = `SAC: ${curBag} | TONNEAU: ${curBarrel}`;
    }
  };

  const updateInteractionPrompt = () => {
    if (stats.currentInteraction === "barrel") {
      actionPromptBg.opacity = 0.95;
      actionPromptBg.outline.color = k.rgb(56, 189, 248);
      actionPromptText.opacity = 1;
      actionPromptText.text = "(E) Deposer le butin dans le Tonneau";
    } else if (stats.currentInteraction === "fisherman") {
      actionPromptBg.opacity = 0.95;
      actionPromptBg.outline.color = k.rgb(250, 204, 21);
      actionPromptText.opacity = 1;
      actionPromptText.text = "(E) Parler au Pecheur (Vente & Boutique)";
    } else if (actionPromptBg.opacity !== 0) {
      actionPromptBg.opacity = 0;
      actionPromptText.opacity = 0;
    }
  };

  const updateNotificationBanner = () => {
    if (stats.notification?.timer > 0) {
      stats.notification.timer -= k.dt();
      const alpha = Math.min(1, stats.notification.timer * 1.5);
      notifBannerBg.opacity = 0.95 * alpha;
      notifBannerText.opacity = alpha;
      notifBannerText.text = stats.notification.text || "";
      const col = stats.notification.color || [255, 255, 255];
      notifBannerBg.outline.color = k.rgb(col[0], col[1], col[2]);
      notifBannerText.color = k.rgb(col[0], col[1], col[2]);
    } else if (notifBannerBg.opacity !== 0) {
      notifBannerBg.opacity = 0;
      notifBannerText.opacity = 0;
    }
  };

  const updateBossBar = () => {
    if (stats.bossActive && !stats.bossDefeated) {
      bossTitle.opacity = 1;
      bossBarBg.opacity = 0.9;
      bossBarFill.opacity = 1;
      bossHpText.opacity = 1;

      const curBossHp = Math.max(0, Math.round(stats.bossHp));
      if (curBossHp !== cachedBossHp) {
        cachedBossHp = curBossHp;
        const hpRatio = Math.max(0, Math.min(curBossHp / (stats.bossMaxHp || 600), 1));
        bossBarFill.width = Math.max(1, BOSS_BAR_W * hpRatio);
        bossHpText.text = `${curBossHp} / ${stats.bossMaxHp} PV`;
      }
    } else if (bossTitle.opacity !== 0) {
      bossTitle.opacity = 0;
      bossBarBg.opacity = 0;
      bossBarFill.opacity = 0;
      bossHpText.opacity = 0;
    }
  };

  // --- MISE À JOUR DYNAMIQUE OPTIMISÉE ---
  k.onUpdate(() => {
    updateChrono();
    updateDepthGauge();
    updateVitalsBars();
    updateInventoryHUD();
    updateInteractionPrompt();
    updateNotificationBanner();
    updateBossBar();
  });
}
