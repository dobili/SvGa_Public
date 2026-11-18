/**
 * Bots und Paarungen für die Vorratspartien je Stärkeband (vorratspartien.messung.ts).
 *
 * Warum: Je Band sollen Bots ähnlicher Stärke mit verschiedenen Stilen gegeneinander spielen, damit
 * die Stellungen des Vorrats abwechslungsreich und menschlich sind (Wunsch des Autors,
 * 18.11.2026). Gewählt sind vorgefertigte Bots der App (engine/gegnerliste.ts), deren gemessene
 * Stärke mit Maia (engine/botstaerke-maia-daten.ts) im Band liegt oder knapp daneben; Bots mit
 * Zufallszügen (Spaß-Bots) spielen nicht mit, weil ihre Partien keine echten Fehler zeigen.
 * Bänder wie inhalte/abenteuer/stellungsvorrat.json (pipeline/abenteuer/stellungsvorrat.py).
 * Abhängigkeiten: keine (reine Daten und Rechnung; der Test prüft die Bots gegen die App).
 */

export type Vorratsband = "band1" | "band2" | "band3" | "band4" | "band5";

/**
 * Je Band die Bots (Kennung, Stil). Maia-Elo in Klammern zur Nachvollziehbarkeit; die Bänder
 * gehen bis 900, 1200, 1500, 1800 und darüber. Band 3 hat nur vier Bots im Band, dazu je einer
 * knapp darunter und darüber, damit jeder Stil vorkommt.
 */
export const VORRATSBOTS: Readonly<Record<Vorratsband, readonly string[]>> = {
  // ella (605), svenja (658), opa-heinz (691), dennis (704), erik (715), nele (715), yusuf (752)
  band1: ["ella", "svenja", "opa-heinz", "dennis", "erik", "nele", "yusuf"],
  // luca (928), simon (928), lars (950), jana (1108), frau-demir (1151), marco (1162), frau-romero (1187)
  band2: ["luca", "simon", "lars", "jana", "frau-demir", "marco", "frau-romero"],
  // frau-romero (1187), katrin (1232), johanna (1298), herr-hartmann (1388), david (1480), igor (1510)
  band3: ["frau-romero", "katrin", "johanna", "herr-hartmann", "david", "igor"],
  // igor (1510), samira (1517), miriam (1536), herr-vogel (1538), guenter (1600), herr-kuehn (1723), frau-wagner (1742)
  band4: ["igor", "samira", "miriam", "herr-vogel", "guenter", "herr-kuehn", "frau-wagner"],
  // herr-lorenz (1838), elias (1840), frau-sommer (1928), fiona (1968), trainer-maier (1973), amaya (1976), frau-prof-reich (2210)
  band5: [
    "herr-lorenz",
    "elias",
    "frau-sommer",
    "fiona",
    "trainer-maier",
    "amaya",
    "frau-prof-reich",
  ],
};

/** Stil eines Bots für die Herkunft im Vorrat (Kennung → Stilname der App). */
export type Stilnachschlag = (bot: string) => string;

/** Eine Paarung: wer Weiß, wer Schwarz spielt, mit Stil. */
export interface Vorratspaarung {
  readonly weiss: { readonly bot: string; readonly stil: string };
  readonly schwarz: { readonly bot: string; readonly stil: string };
}

/**
 * Die Paarungen eines Bandes: alle Paare verschiedener Bots der Reihe nach, im Wechsel der Farben;
 * reichen sie nicht, beginnt die Liste von vorn mit getauschten Farben.
 * Eingaben: Band, Zahl der Partien, Versatz (zweite Stichprobe beginnt bei einem anderen Paar),
 * Stil je Bot. Beispiel: band3 mit 6 Bots hat 15 Paare; 24 Partien spielen alle 15 und 9 davon
 * mit getauschten Farben.
 */
export function vorratspaarungen(
  band: Vorratsband,
  partien: number,
  versatz: number,
  stilVon: Stilnachschlag,
): readonly Vorratspaarung[] {
  const bots = VORRATSBOTS[band];
  const paare: [string, string][] = [];
  for (let i = 0; i < bots.length; i += 1) {
    for (let j = i + 1; j < bots.length; j += 1) paare.push([bots[i] ?? "", bots[j] ?? ""]);
  }
  const seite = (bot: string) => ({ bot, stil: stilVon(bot) });
  return Array.from({ length: partien }, (_, n) => {
    const nummer = n + versatz;
    const index = nummer % paare.length;
    const [a, b] = paare[index] ?? ["", ""];
    // Innerhalb einer Runde wechseln die Farben; in der nächsten Runde andersherum.
    const getauscht = (index % 2 === 1) !== (Math.floor(nummer / paare.length) % 2 === 1);
    const [w, s] = getauscht ? [b, a] : [a, b];
    return { weiss: seite(w), schwarz: seite(s) };
  });
}
