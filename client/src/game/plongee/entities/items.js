import { stats, triggerNotification } from "./stats.js";

/**
 * Dictionnaire descriptif de l'ensemble des butins et loots pouvant être obtenus
 * sur les créatures marines et monstres des trois zones océaniques.
 * @type {Record<string, { id: string, name: string, value: number, icon: string, color: number[] }>}
 */
export const ITEMS_INFO = {
  anguille_meat: {
    id: "anguille_meat",
    name: "Chair d'anguille",
    value: 15,
    icon: "🐟",
    color: [80, 180, 240],
  },
  jelly_filament: {
    id: "jelly_filament",
    name: "Filament de meduse",
    value: 10,
    icon: "🪼",
    color: [220, 100, 240],
  },
  turtle_shell: {
    id: "turtle_shell",
    name: "Ecaille de tortue",
    value: 35,
    icon: "🐢",
    color: [80, 200, 100],
  },
  pieuvre_tentacle: {
    id: "pieuvre_tentacle",
    name: "Tentacule de pieuvre",
    value: 25,
    icon: "🐙",
    color: [180, 60, 180],
  },
  lantern: {
    id: "lantern",
    name: "Lanterne abyssale",
    value: 50,
    icon: "💡",
    color: [255, 240, 80],
  },
  siren_scale: {
    id: "siren_scale",
    name: "Ecaille de sirene",
    value: 45,
    icon: "🧜‍♀️",
    color: [100, 220, 200],
  },
  magic_pearl: {
    id: "magic_pearl",
    name: "Perle des abysses",
    value: 60,
    icon: "🔮",
    color: [220, 180, 255],
  },
  explosive_dust: {
    id: "explosive_dust",
    name: "Poudre explosive",
    value: 30,
    icon: "💥",
    color: [255, 120, 50],
  },
  trident_tip: {
    id: "trident_tip",
    name: "Pointe de trident",
    value: 50,
    icon: "🔱",
    color: [240, 200, 80],
  },
  shark_tooth: {
    id: "shark_tooth",
    name: "Dent de requin",
    value: 75,
    icon: "🦈",
    color: [240, 240, 200],
  },
  shark_king_tooth: {
    id: "shark_king_tooth",
    name: "Trophee du Boss Requin",
    value: 300,
    icon: "👑",
    color: [255, 215, 0],
  },
};

/**
 * Fait apparaître un butin pixel art flottant dans l'océan à la mort d'une créature.
 * Gère le mouvement de flottement, la collision avec le joueur, l'ajout au sac personnel
 * et l'affichage des notifications textuelles et visuelles.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {import("kaplay").Vec2} pos - Position d'apparition dans l'espace monde.
 * @param {string} lootType - Identifiant de l'objet (clé dans ITEMS_INFO).
 * @returns {import("kaplay").GameObj} L'entité de loot instanciée.
 */
export function spawnLootItem(k, pos, lootType) {
  const itemInfo = ITEMS_INFO[lootType] || {
    id: lootType,
    name: lootType,
    value: 10,
    icon: "📦",
    color: [255, 255, 255],
  };

  const spriteKey = `loot-${lootType.replaceAll("_", "-")}`;

  // Sprite Pixel Art 16x16 du butin
  const loot = k.add([
    k.sprite(spriteKey),
    k.scale(2.2),
    k.pos(pos),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(0, 0), 16, 16) }),
    k.z(40),
    "loot",
    {
      itemData: itemInfo,
      time: 0,
      collected: false,
      collect() {
        if (this.collected) return;
        this.collected = true;

        try {
          k.play("sfx-loot", { volume: 0.7 });
        } catch {
          /* ignore audio error */
        }

        const existing = stats.inventory.find((i) => i.id === itemInfo.id);
        if (existing) {
          existing.qty = (existing.qty || 1) + 1;
        } else {
          stats.inventory.push({ ...itemInfo, qty: 1 });
        }

        // Notification flottante haute visibilité (Plaque pixel art sombre & bordure dorée)
        const badgeW = Math.max(160, itemInfo.name.length * 10 + 60);
        const badgeBg = k.add([
          k.rect(badgeW, 26),
          k.pos(this.pos.x, this.pos.y - 20),
          k.anchor("center"),
          k.color(10, 18, 30),
          k.outline(2, k.rgb(250, 204, 21)),
          k.z(150),
          k.opacity(1),
        ]);

        const notif = k.add([
          k.text(`+1 ${itemInfo.name} (+${itemInfo.value}🪙)`, {
            size: 13,
            font: "Silkscreen",
          }),
          k.pos(this.pos.x, this.pos.y - 20),
          k.color(254, 240, 138),
          k.anchor("center"),
          k.z(151),
          k.opacity(1),
        ]);

        const floatAnim = () => {
          badgeBg.pos.y -= 26 * k.dt();
          notif.pos.y = badgeBg.pos.y;
          badgeBg.opacity -= 0.65 * k.dt();
          notif.opacity = badgeBg.opacity;
          if (badgeBg.opacity <= 0) {
            k.destroy(badgeBg);
            k.destroy(notif);
          }
        };
        badgeBg.onUpdate(floatAnim);

        // Notification supplémentaire dans la bannière d'état HUD centrale
        triggerNotification(`+1 ${itemInfo.name} (+${itemInfo.value} or)`, [250, 204, 21], 2.2);

        window.dispatchEvent(new CustomEvent("plongee-inventory-updated"));
        k.destroy(this);
      },
    },
  ]);

  loot.onUpdate(() => {
    loot.time += k.dt();
    loot.pos.y += Math.sin(loot.time * 3) * 0.35;
  });

  return loot;
}
