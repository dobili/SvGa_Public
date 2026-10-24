/**
 * Knopf „Aufgabe für Claude“ (R57, Stufe 2, Punkt 14): fertiger Auftrag aus Ampel und Meldungen.
 *
 * Rolle im Gesamtbild: Der Autor soll aus dem Dashboard mit einem Tipp einen Auftrag für eine
 * neue Claude-Sitzung bekommen, ohne selbst zusammenzufassen. Der Text nennt die roten und gelben
 * Prüfpunkte und die offenen Meldungen mit allen mitgeschickten Angaben und verweist auf die
 * Arbeitsregeln (CLAUDE.md, Buchbefunde nur als Rückfrage).
 * Abhängigkeiten: src/admin/schnittstelle.ts, src/admin/texte.ts.
 */
import type { GespeicherteMeldung, PunktMitVerlauf } from "./schnittstelle";
import { ARTEN, TEXTE } from "./texte";

const ANGABEN = [
  "version",
  "geraet",
  "bildschirm",
  "sprache",
  "abbildung",
  "seite",
  "stellung",
] as const;

function punktzeile(p: PunktMitVerlauf): string {
  const ampel = p.ampel === "rot" ? "ROT" : "gelb";
  return `- ${ampel} – ${p.gruppe}: ${p.titel} (seit ${p.seit.slice(0, "JJJJ-MM-TT".length)}): ${p.text}`;
}

function meldungsblock(m: GespeicherteMeldung): string {
  const angaben = ANGABEN.filter((f) => m[f]).map((f) => `  ${TEXTE.felder[f]}: ${m[f]}`);
  const kopf = `- Nr. ${m.id}, ${ARTEN[m.art]}, ${m.zeit.slice(0, "JJJJ-MM-TT".length)}:`;
  const text = m.text
    .split("\n")
    .map((zeile) => `  > ${zeile}`)
    .join("\n");
  return [kopf, text, ...angaben].join("\n");
}

/**
 * Der Auftrag als Text; null, wenn es nichts zu tun gibt.
 * Beispiel: ein roter Link und eine Meldung „Pfeil falsch“ an Abbildung 3.12 → Auftrag mit
 * beiden Abschnitten und den Regeln für Buchbefunde.
 */
export function aufgabeFuerClaude(
  punkte: readonly PunktMitVerlauf[],
  meldungen: readonly GespeicherteMeldung[],
): string | null {
  const auffaellig = punkte.filter((p) => p.ampel === "rot" || p.ampel === "gelb");
  if (auffaellig.length === 0 && meldungen.length === 0) return null;
  const teile = [
    "Aus dem Admin-Dashboard von schach-von-grund-auf.com. Bitte zuerst CLAUDE.md und docs/FORTSCHRITT.md lesen.",
  ];
  if (auffaellig.length > 0) {
    teile.push(`Prüfungen, die nicht grün sind:\n${auffaellig.map(punktzeile).join("\n")}`);
  }
  if (meldungen.length > 0) {
    teile.push(`Offene Meldungen der Leser:\n${meldungen.map(meldungsblock).join("\n")}`);
  }
  teile.push(
    [
      "Vorgehen: Jeden Punkt prüfen und beheben. Buchbefunde (Fehler im Buch) nicht selbst ändern,",
      "sondern als Rückfrage in docs/AUFGABEN_AUTOR.md festhalten. Meldungen, die kein Fehler sind,",
      "kurz begründen, damit ich sie im Dashboard als „Kein Fehler“ markieren kann.",
    ].join(" "),
  );
  return teile.join("\n\n");
}
