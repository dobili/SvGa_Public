/**
 * Sammelkarte der Finch-Jagd (docs/spiel/15, Abschnitt 1.1 und Tabelle in 3; Runde 6, Teil 5):
 * 16 weiße Figuren aus Buchsbaum, über die Wege verstreut, unter jeder ein Feld eingebrannt.
 *
 * Rolle im Gesamtbild: Reine Logik für oberwelt/FinchKarte.tsx (getestet in finchjagd.test.ts).
 * Die Figuren sind Funde mit den Kennungen `finch<Figur><Buchstabe>`; das Feld steht in
 * funde.json (`feld`), sobald der Haupt-Chat das Meisterproblem gebaut hat. Die Reihenfolge der
 * Kästchen folgt einem Figurensatz: König, Dame, Türme, Läufer, Springer, Bauern A bis H.
 * Beispiel: gefunden finchLaeuferA mit Feld c4 → Kästchen „Läufer“ zeigt „c4“, 1 von 16.
 */

/** Ein Kästchen der Sammelkarte. */
export interface Finchkaestchen {
  readonly fund: string;
  /** Figur als Buchstabe wie in der FEN (weiß): K, Q, R, B, N, P. */
  readonly figur: string;
  readonly gefunden: boolean;
  /** Das eingebrannte Feld, sobald gefunden und bekannt; sonst null. */
  readonly feld: string | null;
}

const BAUERN = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

/** Die 16 Funde der Jagd in der Reihenfolge der Sammelkarte, mit Figur. */
export const FINCH_FIGUREN: readonly { readonly fund: string; readonly figur: string }[] = [
  { fund: "finchKoenig", figur: "K" },
  { fund: "finchDame", figur: "Q" },
  { fund: "finchTurmA", figur: "R" },
  { fund: "finchTurmB", figur: "R" },
  { fund: "finchLaeuferA", figur: "B" },
  { fund: "finchLaeuferB", figur: "B" },
  { fund: "finchSpringerA", figur: "N" },
  { fund: "finchSpringerB", figur: "N" },
  ...BAUERN.map((b) => ({ fund: `finchBauer${b}`, figur: "P" })),
];

/**
 * Die Sammelkarte nach den Funden des Spielstands und den Feldern aus funde.json.
 * Sonderfall: Ein Feld zeigt die Karte erst nach dem Fund (unter der Figur eingebrannt).
 */
export function finchKarte(
  gefunden: readonly { readonly kennung: string }[],
  fundeDaten: readonly { readonly kennung: string; readonly feld?: string }[],
): Finchkaestchen[] {
  const hat = new Set(gefunden.map((f) => f.kennung));
  return FINCH_FIGUREN.map(({ fund, figur }) => {
    const da = hat.has(fund);
    const feld = da ? (fundeDaten.find((f) => f.kennung === fund)?.feld ?? null) : null;
    return { fund, figur, gefunden: da, feld };
  });
}

/** Zeigt das Tagebuch die Sammelkarte? Ab Odettes Karte (Flohmarkt) oder dem ersten Fund. */
export function finchKarteSichtbar(
  gefunden: readonly { readonly kennung: string }[],
  variablen: Readonly<Record<string, unknown>>,
): boolean {
  return Boolean(variablen.finchKarte) || gefunden.some((f) => f.kennung.startsWith("finch"));
}
