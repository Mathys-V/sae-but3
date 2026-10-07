export function setupOceanBoundaries(k) {
  const OCEAN_WIDTH = 4000;
  const OCEAN_DEPTH = 5000;

  // Surface de l'eau (Plafond bloquant)
  k.add([
    k.rect(OCEAN_WIDTH, 50),
    k.pos(-OCEAN_WIDTH / 2, 0),
    k.color(0, 150, 255),
    k.area(),
    k.body({ isStatic: true }), // Le joueur ne peut pas passer au-dessus
  ]);

  // Mur Gauche
  k.add([
    k.rect(50, OCEAN_DEPTH),
    k.pos(-OCEAN_WIDTH / 2, 0),
    k.area(),
    k.body({ isStatic: true }),
  ]);

  // Mur Droit
  k.add([
    k.rect(50, OCEAN_DEPTH),
    k.pos(OCEAN_WIDTH / 2, 0),
    k.area(),
    k.body({ isStatic: true }),
  ]);

  // Le fond marin (Plancher)
  k.add([
    k.rect(OCEAN_WIDTH, 50),
    k.pos(-OCEAN_WIDTH / 2, OCEAN_DEPTH),
    k.color(139, 69, 19), // Marron (Terre/Sable)
    k.area(),
    k.body({ isStatic: true }),
  ]);

  // Ici, tu pourras ajouter la plateforme du bateau à la surface (Y: 50)
}
