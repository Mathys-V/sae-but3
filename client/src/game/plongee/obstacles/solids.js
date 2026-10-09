// Tout objet avec k.area() + le tag "solid" bloque le joueur.
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

  player.onUpdate(() => {
    const solids = k.get("solid").map(sBox);
    const curX = player.pos.x;
    const curY = player.pos.y;
    grounded = false;

    let x = curX;
    let y = curY;

    // --- Axe X, testé à la hauteur de la frame précédente ---
    for (const s of solids) {
      if (!hit(pBox(x, prevY), s)) continue;
      if (x > prevX) x = s.l - HALF_W - OFFSET_X;
      else if (x < prevX) x = s.r + HALF_W - OFFSET_X;
      if (player.vel) player.vel.x = 0;
    }

    // --- Axe Y, avec le X corrigé ---
    for (const s of solids) {
      if (!hit(pBox(x, y), s)) continue;
      if (y > prevY) {
        y = s.t - HALF_H - OFFSET_Y; // on se pose dessus
        grounded = true;
        if (player.vel && player.vel.y > 0) player.vel.y = 0;
      } else if (y < prevY) {
        y = s.b + HALF_H - OFFSET_Y; // on se cogne dessous
        if (player.vel && player.vel.y < 0) player.vel.y = 0;
      } else {
        // aucun mouvement vertical mais chevauchement : on éjecte par le côté le plus court en X
        const left = x + HALF_W - s.l;
        const right = s.r - (x - HALF_W);
        x += left < right ? -left : right;
      }
    }

    player.pos.x = x;
    player.pos.y = y;
    prevX = x;
    prevY = y;
  });
}
