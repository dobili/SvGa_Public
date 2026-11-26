/**
 * Reine Umformungen eines Rahmens für die Figurenbögen: verschieben, drehen, spiegeln.
 *
 * Warum eigene Datei: figurenbogen.mjs lag über der Größengrenze (400 Zeilen), als die
 * diagonalen Reihen dazukamen (figurdiagonalen.mjs, 26.11.2026). figurenbogen.mjs gibt alles
 * hier weiter aus, damit bisherige Aufrufer nichts ändern müssen.
 * Ein Rahmen ist ein Puffer RGBA mit 32 Pixeln Breite; seine Höhe ergibt sich aus der Länge.
 * Abhängigkeiten: keine.
 */

export const RAHMEN = 32;
export const KANAELE = 4;

/** Zeilen eines Rahmens (Breite immer RAHMEN). Beispiel: 32 × 48 → 48. */
export function zeilenVon(rahmen) {
  return rahmen.length / (RAHMEN * KANAELE);
}

/** Verschiebt einen Rahmen um dy Zeilen (positiv nach unten); was hinausfällt, entfällt. */
export function verschoben(rahmen, dy) {
  if (dy === 0) return rahmen;
  const aus = Buffer.alloc(rahmen.length);
  const zeile = RAHMEN * KANAELE;
  const zeilen = zeilenVon(rahmen);
  for (let y = 0; y < zeilen; y++) {
    const ziel = y + dy;
    if (ziel >= 0 && ziel < zeilen) rahmen.copy(aus, ziel * zeile, y * zeile, (y + 1) * zeile);
  }
  return aus;
}

/**
 * Dreht einen Rahmen um eine Vierteldrehung, im Uhrzeigersinn (Kopf nach rechts) oder dagegen
 * (Kopf nach links): Ersatz für ein fehlendes Liegebild vor einer Rennreihe. Bei hohen Rahmen
 * (32 × 48) wird das gedrehte Bild (48 breit) in die Mitte des Rahmens gesetzt und seitlich auf 32
 * Pixel beschnitten; die Figur liegt dann etwas gekürzt, nur als Ersatz.
 */
export function gedreht(rahmen, imUhrzeigersinn) {
  const zeilen = zeilenVon(rahmen);
  const aus = Buffer.alloc(rahmen.length);
  const dx = Math.floor((zeilen - RAHMEN) / 2);
  const dy = Math.floor((zeilen - RAHMEN) / 2);
  for (let y = 0; y < zeilen; y++) {
    for (let x = 0; x < RAHMEN; x++) {
      const zx = (imUhrzeigersinn ? zeilen - 1 - y : y) - dx;
      const zy = (imUhrzeigersinn ? x : RAHMEN - 1 - x) + dy;
      if (zx < 0 || zx >= RAHMEN) continue;
      rahmen.copy(
        aus,
        (zy * RAHMEN + zx) * KANAELE,
        (y * RAHMEN + x) * KANAELE,
        (y * RAHMEN + x + 1) * KANAELE,
      );
    }
  }
  return aus;
}

/** Spiegelt einen Rahmen waagerecht. */
export function gespiegelt(rahmen) {
  const aus = Buffer.alloc(rahmen.length);
  for (let y = 0; y < zeilenVon(rahmen); y++) {
    for (let x = 0; x < RAHMEN; x++) {
      const q = (y * RAHMEN + x) * KANAELE;
      const z = (y * RAHMEN + (RAHMEN - 1 - x)) * KANAELE;
      rahmen.copy(aus, z, q, q + KANAELE);
    }
  }
  return aus;
}
