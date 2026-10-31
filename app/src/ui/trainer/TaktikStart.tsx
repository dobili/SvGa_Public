/**
 * Startkarte des Taktiktrainers (Entwurf G1, Wahl des Autors vom 31.10.2026).
 *
 * Rolle im Gesamtbild: „Deine Runde“ mit drei Zeilen (Aufgaben aus dem Buch oder zusätzlich von
 * Lichess, Motiv, Stufe), der große Knopf startet die Runde mit den zuletzt gewählten Werten,
 * darunter die weiteren Modi aus der Liste TAKTIKMODI (Serie ohne Fehler; ein späterer Modus
 * ergänzt eine Zeile) und „Wiederholen“. Früher standen hier Quellenwahl, Aufklappliste, Chips
 * und drei Erklärungen untereinander (ZusatzWahl.tsx, BuchWahl). Zusatzaufgaben tragen ihre
 * Kennzeichnung (Herkunft, Lizenz) sichtbar unter der Runde.
 * Abhängigkeiten: training/taktiktrainer.ts, training/zusatzaufgaben.ts, startkarte/*, i18n.
 */
import { t } from "../../i18n/sprache";
import { REKORD_TAKTIKSERIE } from "../../training/taktikserie";
import {
  anzahlJeThema,
  TAKTIKTHEMEN,
  vorgewaehltesThema,
  type Taktikthema,
} from "../../training/taktiktrainer";
import {
  ZUSATZTHEMENLISTE,
  zusatzJeThema,
  type Zusatzaufgabe,
  type Zusatzthema,
  type Zusatzwahl,
} from "../../training/zusatzaufgaben";
import type { Taktikaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { useSpeicher } from "../../speicher/speicher";
import type { Ladezustand } from "../komponenten/bausteine/useDaten";
import {
  aufgabenzahl,
  einstellung,
  stufenzeile,
  wiederholung,
  type Einstellung,
  type Startmodus,
} from "./startkarte/einstellung";
import { Startkarte } from "./startkarte/Startkarte";
import { useGemerkt, useGemerkteStufe } from "./startkarte/useGemerkt";
import { useTrainerthema } from "./trainerthema";

const AUFGABEN_JE_RUNDE = 8;
type Quelle = "buch" | "zusatz";
const QUELLEN: readonly Quelle[] = ["buch", "zusatz"];
type Zusatzthemawahl = Zusatzthema | "gemischt";

/** Was die Startkarte starten kann (TaktikBereich.tsx führt es aus). */
export type Taktikstart =
  | { readonly thema: Taktikthema; readonly stufe: number | null }
  | { readonly zusatz: Zusatzwahl }
  | { readonly serie: Taktikthema }
  | { readonly wiederholung: true };

/** Ein weiterer Modus der Buchaufgaben: Name, Satz (mit Rekord) und was er startet. */
interface Taktikmodus {
  readonly kennung: string;
  readonly symbol: Startmodus["symbol"];
  readonly titel: () => string;
  readonly text: (rekord: number) => string;
  readonly start: (thema: Taktikthema) => Taktikstart;
}

/** Die weiteren Modi neben der Runde; ein neuer Modus trägt eine Zeile ein (Wunsch des Autors). */
const TAKTIKMODI: readonly Taktikmodus[] = [
  {
    kennung: "serie",
    symbol: "serie",
    titel: () => t("serie.starten"),
    text: (rekord) =>
      rekord > 0
        ? t("trainerstart.modus.serieRekord", { anzahl: rekord })
        : t("trainerstart.modus.serie"),
    start: (thema) => ({ serie: thema }),
  },
];

/** Name eines Themas der Buchaufgaben. */
function themenname(thema: Taktikthema): string {
  if (thema === "gemischt") return t("taktiktrainer.gemischt");
  if (thema === "mattbilder") return t("taktiktrainer.mattbilder");
  return t(`taktiktrainer.motiv.${thema}`);
}

/** Name eines Themas der Zusatzaufgaben. */
function zusatzname(thema: Zusatzthemawahl): string {
  return thema === "gemischt" ? t("zusatzaufgaben.gemischt") : t(`zusatzaufgaben.thema.${thema}`);
}

/** Die Zeile „Motiv“ mit Anzahl je Thema (nur Themen mit Aufgaben). */
function motivzeile<T extends string>(
  themen: readonly T[],
  anzahl: ReadonlyMap<T, number>,
  name: (thema: T) => string,
  wert: T,
  setze: (thema: T) => void,
): Einstellung {
  return einstellung({
    kennung: "motiv",
    titel: t("trainerstart.zeile.motiv"),
    symbol: "thema",
    optionen: themen.map((th) => ({
      wert: th,
      text: t("trainerstart.eintrag", { name: name(th), anzahl: anzahl.get(th) ?? 0 }),
    })),
    wert,
    setze,
    testkennung: "zeile-motiv",
  });
}

/** Die Zeile „Aufgaben: Aus dem Buch | Zusätzlich Lichess“. */
function quellenzeile(quelle: Quelle, setze: (q: Quelle) => void): Einstellung {
  return einstellung({
    kennung: "quelle",
    titel: t("trainerstart.zeile.quelle"),
    symbol: "quelle",
    optionen: QUELLEN.map((q) => ({ wert: q, text: t(`trainerstart.quelle.${q}`) })),
    wert: quelle,
    setze,
    testkennung: "taktik-quelle",
  });
}

/** Die gemerkten Werte der Karte: Quelle, Buchthema, Zusatzthema, Stufe. */
function useTaktikwahl(aufgaben: readonly Aufgabe[], zusaetze: readonly Zusatzaufgabe[]) {
  const anzahl = anzahlJeThema(aufgaben);
  const zusatzanzahl = zusatzJeThema(zusaetze);
  const themen = TAKTIKTHEMEN.filter((th) => (anzahl.get(th) ?? 0) > 0);
  const zthemen = (["gemischt", ...ZUSATZTHEMENLISTE] as const).filter(
    (th) => (zusatzanzahl.get(th) ?? 0) > 0,
  );
  // Mit Thema geöffnet (etwa aus „Dein nächster Schritt“): Buch und dieses Motiv vorwählen.
  const geoeffnet = useTrainerthema("taktik");
  const vorwahl = geoeffnet === null ? null : vorgewaehltesThema(geoeffnet, anzahl);
  const quelle = useGemerkt<Quelle>(
    "taktik",
    "quelle",
    QUELLEN,
    "buch",
    vorwahl === null ? null : "buch",
  );
  const thema = useGemerkt<Taktikthema>("taktik", "thema", themen, "gemischt", vorwahl);
  const zthema = useGemerkt<Zusatzthemawahl>("taktik", "zusatzthema", zthemen, "gemischt");
  const [stufe, setzeStufe] = useGemerkteStufe("taktik");
  return { anzahl, zusatzanzahl, themen, zthemen, quelle, thema, zthema, stufe, setzeStufe };
}

/** Die weiteren Modi: die der Liste (nur Buchaufgaben) und „Wiederholen“. */
function useModi(
  quelle: Quelle,
  thema: Taktikthema,
  faellig: number,
  starte: (start: Taktikstart) => void,
): Startmodus[] {
  const rekord = useSpeicher((z) => z.daten.rekorde[REKORD_TAKTIKSERIE]?.wert ?? 0);
  const eigene = quelle === "buch" ? TAKTIKMODI : [];
  return [
    ...eigene.map((m) => ({
      kennung: m.kennung,
      titel: m.titel(),
      text: m.text(rekord),
      symbol: m.symbol,
      starte: () => starte(m.start(thema)),
      testkennung: `taktik-start-${m.kennung}`,
    })),
    ...wiederholung(faellig, () => starte({ wiederholung: true })),
  ];
}

/**
 * Die Startkarte des Taktiktrainers.
 *
 * Eingaben: Buchaufgaben, Ladezustand der Zusatzaufgaben, Zahl der fälligen Wiederholungen,
 * Start. Beispiel: „Aufgaben: Aus dem Buch · Motiv: Gemischt · 674 · Stufe: alle Stufen“.
 */
export function TaktikStart({
  aufgaben,
  zusatz,
  faellig,
  starte,
}: {
  aufgaben: readonly Aufgabe[];
  zusatz: Ladezustand<Zusatzaufgabe[]>;
  faellig: number;
  starte: (start: Taktikstart) => void;
}) {
  const w = useTaktikwahl(aufgaben, zusatz.art === "fertig" ? zusatz.wert : []);
  const [quelle, setzeQuelle] = w.quelle;
  const [thema, setzeThema] = w.thema;
  const [zthema, setzeZthema] = w.zthema;
  const modi = useModi(quelle, thema, faellig, starte);
  const buch = quelle === "buch";
  const motiv = buch
    ? motivzeile(w.themen, w.anzahl, themenname, thema, setzeThema)
    : motivzeile(w.zthemen, w.zusatzanzahl, zusatzname, zthema, setzeZthema);
  const stufentext = t(buch ? "stufen.text.geeicht" : "zusatzaufgaben.stufenText");
  const bereit = buch || zusatz.art === "fertig";
  return (
    <Startkarte
      kennung="taktik"
      testkennung="taktik-wahl"
      zeilen={[
        quellenzeile(quelle, setzeQuelle),
        motiv,
        stufenzeile(w.stufe, w.setzeStufe, stufentext),
      ]}
      hinweis={buch ? null : <Zusatzhinweis zusatz={zusatz} />}
      start={{
        zusatz: aufgabenzahl(AUFGABEN_JE_RUNDE),
        gesperrt: !bereit,
        testkennung: "taktik-start-runde",
        starte: () =>
          starte(buch ? { thema, stufe: w.stufe } : { zusatz: { thema: zthema, stufe: w.stufe } }),
      }}
      modi={modi}
      hilfen={[t("zusatzaufgaben.buchHinweis"), t("serie.erklaerung")]}
    />
  );
}

/** Unter der Runde bei Zusatzaufgaben: Kennzeichnung, Laden oder Ladefehler. */
function Zusatzhinweis({ zusatz }: { zusatz: Ladezustand<Zusatzaufgabe[]> }) {
  if (zusatz.art === "laedt") return <p className="lade">…</p>;
  if (zusatz.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: zusatz.meldung })}</p>;
  return (
    <p className="hinweis" data-testid="taktik-quellenhinweis">
      {t("zusatzaufgaben.kennzeichnung")}
    </p>
  );
}
