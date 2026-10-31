/**
 * Die Arten von Wochenaufträgen (Gamifizierung P6) als Liste, je Art eine Zeile.
 *
 * Rolle im Gesamtbild: training/wochenauftraege.ts mischt die Liste mit dem Zufall der Woche und
 * nimmt die ersten drei passenden. Jede Zeile sagt: Kennung, was zählt (eine Art des
 * Tagesprotokolls oder eine eigene Prüfung), wann sie passt und mit welcher Zielzahl, Text, Knopf
 * und wohin der Knopf führt. Ein späterer Trainer oder ein Werkzeug trägt hier eine Zeile ein
 * (Wunsch des Autors, 31.10.2026: eintragen statt umbauen). Der Auftrag „eine Runde im Trainer“
 * wählt aus TRAINER (training/trainer.ts) einen, der lange nicht dran war; ein neuer Trainer mit
 * Durchgang ist damit von selbst dabei.
 * Texte: „auftrag.text.<kennung>“, Knöpfe „auftrag.knopf.<kennung>“ (i18n).
 * Abhängigkeiten: training/trainer.ts, training/wiederholung.ts, daten/uebungsliste-daten.ts,
 * engine/gegner.ts, speicher/besiegt.ts, Typen aus wochenauftraege.ts.
 */
import { UEBUNGEN_JE_KAPITEL } from "../daten/uebungsliste-daten";
import { gegnerDerStufe, gegnerVon, klasseVon } from "../engine/gegner";
import type { Stufennummer } from "../engine/stufen";
import { STUFEN_ZAHL } from "../engine/stufen";
import type { Textschluessel } from "../i18n/sprache";
import { besiegterBot } from "../speicher/besiegt";
import type { Nutzerdaten } from "../speicher/format";
import { tagesschluessel } from "./kurzplaene";
import { NAECHSTER_ANSICHT } from "./vorschlagsarten";
import { TRAINER, type TrainerKennung } from "./trainer";
import type { Auftragsart, Auftragspruefung, Wahllage, Zeitraum } from "./wochenauftraege";
import { waehle } from "./zufall";
import { faellige } from "./wiederholung";

/** Zielzahlen der Aufträge (Vorrecherche P6). */
export const ZIELZAHL = {
  abbildungen: 10,
  uebungen: 3,
  warum: 3,
  partien: 2,
  tagesaufgabe: 3,
  karten: 10,
} as const;
/** Erst ab so vielen fälligen Karten lohnt der Auftrag „Wiederholen“. */
export const KARTEN_AB = 3;
/** Unter so vielen am längsten nicht gespielten Trainern wählt die Woche einen. */
export const TRAINER_ZUR_WAHL = 3;
/**
 * Trainer ohne Runde (sie melden keinen Durchgang): Eine Runde dort kann nicht zählen. Die
 * Fehlerdatenbank hat ihren eigenen Auftrag („fehler“). Kein Verzeichnis der Trainer, nur die
 * Ausnahme; jeder neue Trainer mit Durchgang ist von selbst dabei.
 */
export const TRAINER_OHNE_RUNDE: ReadonlySet<TrainerKennung> = new Set(["fehlerdatenbank"]);

/** Ist der Zeitpunkt (ISO) in der Woche? */
function inWoche(iso: string, woche: Zeitraum): boolean {
  const zeit = new Date(iso);
  if (Number.isNaN(zeit.getTime())) return false;
  const tag = tagesschluessel(zeit);
  return tag >= woche.von && tag <= woche.bis;
}

/** Alle noch nicht gesehenen Abbildungen in Buchreihenfolge. */
function ungesehene(lage: Wahllage): string[] {
  const gesehen = lage.daten.fortschritt.gesehen;
  return lage.kapitel.flatMap((k) => k.abbildungen.filter((n) => gesehen[n] === undefined));
}

/** Die offenen Übungen je Kapitel in Buchreihenfolge (nur Kapitel mit offenen). */
function offeneUebungen(daten: Nutzerdaten): { kapitel: number; ids: string[] }[] {
  return Object.entries(UEBUNGEN_JE_KAPITEL)
    .map(([kapitel, ids]) => ({
      kapitel: Number(kapitel),
      ids: ids.filter((id) => daten.fortschritt.uebungen[id]?.geloest !== true),
    }))
    .filter((k) => k.ids.length > 0)
    .sort((a, b) => a.kapitel - b.kapitel);
}

/** Die zuletzt angesehene Abbildung (Datum des ersten Ansehens), oder null. */
function zuletztGesehen(daten: Nutzerdaten): string | null {
  const eintraege = Object.entries(daten.fortschritt.gesehen).sort(([, a], [, b]) =>
    a.localeCompare(b),
  );
  return eintraege.at(-1)?.[0] ?? null;
}

/** Trainer mit Runde, die am längsten nicht dran waren (nie gespielt zuerst). */
export function langeNichtGespielt(daten: Nutzerdaten): TrainerKennung[] {
  return TRAINER.filter((t) => t.fertig && !TRAINER_OHNE_RUNDE.has(t.kennung))
    .map((t) => ({ kennung: t.kennung, zuletzt: daten.fortschritt.trainer[t.kennung]?.zuletzt ?? "" }))
    .sort((a, b) => a.zuletzt.localeCompare(b.zuletzt))
    .map((t) => t.kennung);
}

/** Ist die Kennung ein Trainer? */
function alsTrainer(wert: string | null): TrainerKennung | null {
  return TRAINER.find((t) => t.kennung === wert)?.kennung ?? null;
}

/** Prüfung „Runde im Trainer“: eine Runde (Durchgang) in dieser Woche zählt. */
const trainerrunde: Auftragspruefung = (daten, auftrag, woche) => {
  const kennung = alsTrainer(auftrag.wert);
  const zuletzt = kennung ? daten.fortschritt.trainer[kennung]?.zuletzt : undefined;
  return zuletzt && inWoche(zuletzt, woche) ? 1 : 0;
};

/** Die höchste Stufe unter den besiegten Bots (alle Zeitarten), 0 ohne Sieg. */
export function hoechsteBesiegteStufe(daten: Nutzerdaten): number {
  const besiegt = Object.values(daten.spiel.besiegt).flat();
  return Math.max(
    0,
    ...besiegt.flatMap((k) => {
      const gegner = gegnerVon(k);
      return gegner ? [klasseVon(gegner).nummer] : [];
    }),
  );
}

/** Prüfung „Bot der Stufe N besiegen“: gewertete Siege dieser Woche gegen Bots ab Stufe N. */
const botsieg: Auftragspruefung = (daten, auftrag, woche) => {
  const stufe = Number(auftrag.wert);
  return daten.spiel.partien.filter(({ partie }) => {
    const bot = inWoche(partie.begonnen, woche) ? besiegterBot(partie) : null;
    const gegner = gegnerVon(bot);
    return gegner !== null && klasseVon(gegner).nummer >= stufe;
  }).length;
};

/** Der Bot, den der Knopf vorbelegt: der erste der Stufe, der noch nicht besiegt ist. */
export function botDerStufe(daten: Nutzerdaten, stufe: number): string | null {
  if (!Number.isInteger(stufe) || stufe < 1 || stufe > STUFEN_ZAHL) return null;
  const bots = gegnerDerStufe(stufe as Stufennummer);
  const besiegt = new Set(Object.values(daten.spiel.besiegt).flat());
  return (bots.find((g) => !besiegt.has(g.kennung)) ?? bots[0])?.kennung ?? null;
}

/** Prüfung „Tagesaufgabe“: Tage der Woche, an denen sie gelöst wurde (einmal je Tag). */
const tagesaufgabentage: Auftragspruefung = (daten, _auftrag, woche) =>
  Object.entries(daten.aktivitaet).filter(
    ([tag, z]) => tag >= woche.von && tag <= woche.bis && (z.tagesaufgabe ?? 0) > 0,
  ).length;

/** Ansicht „Weiter im Buch“, wenn die gemerkte Abbildung fehlt. */
const BUCH = { art: "ansicht", ansicht: { bildschirm: "buch" } } as const;

/** Alle Arten; ein neuer Trainer oder ein Werkzeug ergänzt eine Zeile. */
export const AUFTRAGSARTEN: readonly Auftragsart[] = [
  {
    kennung: "abbildungen",
    text: "auftrag.text.abbildungen",
    textEins: "auftrag.text.abbildungenEins",
    knopf: "auftrag.knopf.abbildungen",
    zaehlt: "abbildung",
    waehle: (lage) => {
      const offen = ungesehene(lage);
      const erste = offen[0];
      return erste ? { anzahl: Math.min(ZIELZAHL.abbildungen, offen.length), wert: erste } : null;
    },
    ziel: (a) => (a.wert ? { art: "ansicht", ansicht: { bildschirm: "abbildung", nummer: a.wert } } : BUCH),
  },
  {
    kennung: "uebungen",
    text: "auftrag.text.uebungen",
    textEins: "auftrag.text.uebungenEins",
    knopf: "auftrag.knopf.uebungen",
    zaehlt: "uebungGeloest",
    waehle: ({ daten }) => {
      const offen = offeneUebungen(daten);
      const zahl = offen.reduce((summe, k) => summe + k.ids.length, 0);
      return offen[0] ? { anzahl: Math.min(ZIELZAHL.uebungen, zahl), wert: String(offen[0].kapitel) } : null;
    },
    ziel: (_a, daten) => {
      const erstes = offeneUebungen(daten)[0];
      const id = erstes?.ids[0];
      if (!erstes || !id) return { art: "ansicht", ansicht: { bildschirm: "training" } };
      const reihe = erstes.ids.map((u) => ({ kapitel: erstes.kapitel, id: u }));
      return { art: "ansicht", ansicht: { bildschirm: "uebung", kapitel: erstes.kapitel, id, reihe } };
    },
  },
  {
    kennung: "trainer",
    text: "auftrag.text.trainer",
    knopf: "auftrag.knopf.trainer",
    zaehlt: trainerrunde,
    waehle: ({ daten, zufall }) => {
      const kennung = waehle(langeNichtGespielt(daten).slice(0, TRAINER_ZUR_WAHL), zufall);
      return kennung ? { anzahl: 1, wert: kennung } : null;
    },
    ziel: (a) => {
      const kennung = alsTrainer(a.wert);
      return kennung
        ? { art: "ansicht", ansicht: { bildschirm: "trainer", kennung } }
        : { art: "ansicht", ansicht: { bildschirm: "training" } };
    },
    name: (wert) => `trainer.${wert}.name` as Textschluessel,
  },
  {
    kennung: "bot",
    text: "auftrag.text.bot",
    knopf: "auftrag.knopf.bot",
    zaehlt: botsieg,
    waehle: ({ daten }) => {
      const stufe = hoechsteBesiegteStufe(daten) + 1;
      return botDerStufe(daten, stufe) ? { anzahl: 1, wert: String(stufe) } : null;
    },
    ziel: (a, daten) => {
      const bot = botDerStufe(daten, Number(a.wert));
      return bot ? { art: "bot", bot } : { art: "ansicht", ansicht: { bildschirm: "spielen" } };
    },
  },
  {
    kennung: "warum",
    text: "auftrag.text.warum",
    knopf: "auftrag.knopf.warum",
    zaehlt: "warum",
    waehle: ({ daten }) => {
      const zuletzt = zuletztGesehen(daten);
      return zuletzt ? { anzahl: ZIELZAHL.warum, wert: zuletzt } : null;
    },
    ziel: (a) => (a.wert ? { art: "ansicht", ansicht: { bildschirm: "abbildung", nummer: a.wert } } : BUCH),
  },
  {
    kennung: "lernziel",
    text: "auftrag.text.lernziel",
    knopf: "auftrag.knopf.lernziel",
    zaehlt: "lernziel",
    waehle: ({ daten }) => (zuletztGesehen(daten) ? { anzahl: 1, wert: null } : null),
    ziel: () => ({ art: "ansicht", ansicht: { bildschirm: "checkliste" } }),
  },
  {
    kennung: "karten",
    text: "auftrag.text.karten",
    knopf: "auftrag.knopf.karten",
    zaehlt: "karte",
    waehle: ({ daten, jetzt }) => {
      const zahl = faellige(daten.karten, jetzt).length;
      return zahl >= KARTEN_AB ? { anzahl: Math.min(ZIELZAHL.karten, zahl), wert: null } : null;
    },
    ziel: () => ({
      art: "ansicht",
      ansicht: { bildschirm: "zusatz", kennung: NAECHSTER_ANSICHT, wert: "wiederholung" },
    }),
  },
  {
    kennung: "fehler",
    text: "auftrag.text.fehler",
    knopf: "auftrag.knopf.fehler",
    zaehlt: "fehler",
    waehle: ({ daten }) => (daten.spiel.partien.length > 0 ? { anzahl: 1, wert: null } : null),
    ziel: () => ({ art: "ansicht", ansicht: { bildschirm: "trainer", kennung: "fehlerdatenbank" } }),
  },
  {
    kennung: "partien",
    text: "auftrag.text.partien",
    knopf: "auftrag.knopf.partien",
    zaehlt: "partie",
    waehle: () => ({ anzahl: ZIELZAHL.partien, wert: null }),
    ziel: () => ({ art: "ansicht", ansicht: { bildschirm: "spielen" } }),
  },
  {
    kennung: "tagesaufgabe",
    text: "auftrag.text.tagesaufgabe",
    knopf: "auftrag.knopf.tagesaufgabe",
    zaehlt: tagesaufgabentage,
    waehle: () => ({ anzahl: ZIELZAHL.tagesaufgabe, wert: null }),
    ziel: () => ({
      art: "ansicht",
      ansicht: { bildschirm: "zusatz", kennung: NAECHSTER_ANSICHT, wert: "tagesaufgabe" },
    }),
  },
];
