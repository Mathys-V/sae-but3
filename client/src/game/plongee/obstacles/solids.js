/**
 * Configure la gestion des collisions continues AABB (Axis-Aligned Bounding Box) entre le joueur
 * et les solides statiques du décor (plancher de la barque, parois de bouées, rochers).
 * Résout les pénétrations d'axe X puis d'axe Y pour garantir un contact fluide sans traversée.
 *
 * @param {import("kaplay").KaplayCtx} k - Instance du contexte Kaplay.
 * @param {import("kaplay").GameObj} player - Entité du joueur à contraindre.
 */
export function setupSolids(k, player) {
  // Boîte du joueur calculée à la main (centrée sur pos, comme sur ton debug)
  // hitbox 12x12 * scale 2 = 24x24 -> demi-taille 12
  const HALF_W = 6 * player.scale.x;
  const HALF_H = 6 * player.scale.y;
  const OFFSET_X = 0; // si la hitbox est décalée, ajuste ici
  const OFFSET_Y = 0;

  const pBox = (x, y) => ({
    l: x + OFFSET_X - HALF_W,
    r: x + OFFSET_X + HALF_W,
    t: y + OFFSET_Y - HALF_H,
    b: y + OFFSET_Y + HALF_H,
  });

  // Boîte d'un solide (statique, donc worldArea est fiable)
  const sBox = (o) => {
    const a = o.worldArea();
    const bb = a.bbox ? a.bbox() : a;
    return {
      l: bb.pos.x,
      r: bb.pos.x + bb.width,
      t: bb.pos.y,
      b: bb.pos.y + bb.height,
    };
  };

  const hit = (a, c) => a.l < c.r && a.r > c.l && a.t < c.b && a.b > c.t;

  let prevX = player.pos.x;
  let prevY = player.pos.y;
  let grounded = false;
  player.isGrounded = () => grounded;

  // Permet de réinitialiser la position de référence lors d'une téléportation (ex: respawn)
  // pour éviter que le moteur ne croie à un déplacement ascendant violent et écrase le joueur sous le plancher
  player.resetSolidsHistory = (x, y) => {
    prevX = x !== undefined ? x : player.pos.x;
    prevY = y !== undefined ? y : player.pos.y;
  };

  // Mise en cache des solides statiques pour éviter des itérations lourdes à 60 FPS
  let cachedSolids = null;

  const resolveHorizontalCollisions = (startX, historyY, historyX, solids) => {
    let x = startX;
    for (const s of solids) {
      if (!hit(pBox(x, historyY), s)) continue;
      if (x > historyX) {
        x = s.l - HALF_W - OFFSET_X;
      } else if (x < historyX) {
        x = s.r + HALF_W - OFFSET_X;
      }
      if (player.vel) player.vel.x = 0;
    }
    return x;
  };

  const resolveVerticalCollisions = (x, startY, historyY, solids) => {
    let y = startY;
    let isGrounded = false;
    let correctedX = x;

    for (const s of solids) {
      if (!hit(pBox(correctedX, y), s)) continue;
      if (y > historyY) {
        y = s.t - HALF_H - OFFSET_Y;
        isGrounded = true;
        if (player.vel && player.vel.y > 0) player.vel.y = 0;
      } else if (y < historyY) {
        y = s.b + HALF_H - OFFSET_Y;
        if (player.vel && player.vel.y < 0) player.vel.y = 0;
      } else {
        const left = correctedX + HALF_W - s.l;
        const right = s.r - (correctedX - HALF_W);
        correctedX += left < right ? -left : right;
      }
    }

    return { x: correctedX, y, isGrounded };
  };

  player.onUpdate(() => {
    if (!cachedSolids) {
      cachedSolids = k.get("solid").map(sBox);
    }
    const solids = cachedSolids;

    const xAfterH = resolveHorizontalCollisions(player.pos.x, prevY, prevX, solids);
    const vResult = resolveVerticalCollisions(xAfterH, player.pos.y, prevY, solids);

    grounded = vResult.isGrounded;
    player.pos.x = vResult.x;
    player.pos.y = vResult.y;
    prevX = vResult.x;
    prevY = vResult.y;
  });
}
