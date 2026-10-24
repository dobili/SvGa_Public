/**
 * Liest die Aufgabendatei des Autors (`docs/AUFGABEN_AUTOR.md`) in Abschnitte und Punkte.
 *
 * Rolle im Gesamtbild: Grundlage der Aufgabenseite (ui/bildschirme/AutorAufgaben.tsx, Wunsch des
 * Autors vom 18.10.2026: Nachtests in der App abhaken, mit Links zu Abbildungen, Spielen und
 * Trainern). Die Datei kommt beim Bauen in die App; diese Funktion versteht nur das, was die
 * Datei nach Regel 8 (CLAUDE.md) enthält: Überschriften mit „##“ und „###“, Punkte
 * „- [ ] N304. Text“ mit eingerückten Folgezeilen, dazwischen Absätze.
 * Abhängigkeiten: keine.
 */

/** Ein Punkt zum Abhaken: Nachtest (N304) oder Rückfrage (F5, X5). */
export interface Aufgabenpunkt {
  readonly id: string;
  readonly text: string;
}

export interface Aufgabenabschnitt {
  readonly titel: string;
  /** 2 für „## Teil 1“, 3 für „### Neu in 0.2.73“. */
  readonly ebene: 2 | 3;
  /** Absätze zwischen Überschrift und Punkten, je als eine Zeile. */
  readonly absaetze: readonly string[];
  readonly punkte: readonly Aufgabenpunkt[];
}

export interface Aufgabendatei {
  /** Die Version aus der Zeile „Stand: …, Version 0.2.73.“, oder null. */
  readonly version: string | null;
  readonly abschnitte: readonly Aufgabenabschnitt[];
}

const UEBERSCHRIFT = /^(#{2,3}) (.+)$/;
// Kennung aus ein oder zwei Großbuchstaben und Nummer: N307, F5, aber auch NA1, LS2, ZF1 (die
// Rückfragen der parallelen Chats seit dem 18.10.2026) und mit Paketzusatz P8-1, P2-A (die
// Rückfragen der Pakete seit dem 23.10.2026).
const PUNKT = /^- \[[ xX]\] ([A-Z]{1,2}\d+(?:-(?:\d+|[A-Z]))?)\. (.*)$/;
const FOLGEZEILE = /^\s{2,}\S/;
const VERSION = /Version (\d+\.\d+\.\d+)/;
const TRENNLINIE = "---";

interface Entwurf {
  titel: string;
  ebene: 2 | 3;
  absaetze: string[];
  punkte: { id: string; zeilen: string[] }[];
  /** Woran die nächste eingerückte Zeile hängt. */
  offen: "absatz" | "punkt" | null;
}

/** Hängt eine Zeile an den Absatz oder Punkt, der gerade offen ist. */
function haengeAn(entwurf: Entwurf, zeile: string): void {
  const text = zeile.trim();
  const punkt = entwurf.punkte.at(-1);
  if (entwurf.offen === "punkt" && punkt && FOLGEZEILE.test(zeile)) {
    punkt.zeilen.push(text);
    return;
  }
  if (entwurf.offen === "absatz" && entwurf.absaetze.length > 0) {
    const letzter = entwurf.absaetze.length - 1;
    entwurf.absaetze[letzter] = `${entwurf.absaetze[letzter]} ${text}`;
    return;
  }
  entwurf.absaetze.push(text);
  entwurf.offen = "absatz";
}

/** Eine Zeile innerhalb eines Abschnitts: Punkt, Folgezeile, Absatz oder Leerzeile. */
function liesZeile(entwurf: Entwurf, zeile: string): void {
  if (zeile.trim() === "" || zeile.trim() === TRENNLINIE) {
    entwurf.offen = null;
    return;
  }
  const punkt = PUNKT.exec(zeile);
  if (punkt) {
    entwurf.punkte.push({ id: punkt[1] ?? "", zeilen: [punkt[2] ?? ""] });
    entwurf.offen = "punkt";
    return;
  }
  haengeAn(entwurf, zeile);
}

const fertig = (e: Entwurf): Aufgabenabschnitt => ({
  titel: e.titel,
  ebene: e.ebene,
  absaetze: e.absaetze,
  punkte: e.punkte.map((p) => ({ id: p.id, text: p.zeilen.join(" ") })),
});

/**
 * Zerlegt die Aufgabendatei. Der Kopf vor der ersten „##“-Überschrift liefert nur die Version.
 * Beispiel: „### Neu in 0.2.73 …“ mit „- [ ] N306. **Lizenzen:** …“ → Abschnitt der Ebene 3 mit
 * dem Punkt N306. Sonderfall: Ein Punkt mit gleicher Kennung wie ein früherer bleibt erhalten;
 * die Seite hakt beide gemeinsam ab.
 */
export function liesAufgabendatei(text: string): Aufgabendatei {
  const abschnitte: Aufgabenabschnitt[] = [];
  let version: string | null = null;
  let aktuell: Entwurf | null = null;
  for (const zeile of text.split(/\r?\n/)) {
    const ueberschrift = UEBERSCHRIFT.exec(zeile);
    if (ueberschrift) {
      if (aktuell) abschnitte.push(fertig(aktuell));
      const ebene = ueberschrift[1] === "##" ? 2 : 3;
      aktuell = { titel: ueberschrift[2] ?? "", ebene, absaetze: [], punkte: [], offen: null };
    } else if (aktuell) {
      liesZeile(aktuell, zeile);
    } else {
      version ??= VERSION.exec(zeile)?.[1] ?? null;
    }
  }
  if (aktuell) abschnitte.push(fertig(aktuell));
  return { version, abschnitte };
}
