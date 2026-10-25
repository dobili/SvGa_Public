/**
 * Trainer „Studien lösen“ (Kapitel 10) und „Zug erraten“ (Kapitel 11).
 *
 * Rolle im Gesamtbild: Beide laden ihr Kapitel (daten/laden.ts) und spielen die Zugfolgen des
 * Buches im gemeinsamen Rundenablauf. Studien: alle Studien des Kapitels nacheinander, gelöst
 * wie im Repertoire-Trainer. Zug erraten: Partie und Seite wählen, eine Partie je Runde.
 * Abhängigkeiten: training/studientrainer.ts, Repertoireaufgabe, Zugerratenaufgabe, i18n.
 */
import type { Color } from "chessops/types";
import { useState } from "react";
import { ladeKapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import type { Repertoireaufgabe as Aufgabe } from "../../training/repertoiretrainer";
import { partienAus, studienAus } from "../../training/studientrainer";
import { useDaten } from "../komponenten/useDaten";
import { Repertoireaufgabe } from "./Repertoireaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { Zugerratenaufgabe } from "./Zugerratenaufgabe";
import { Knopfsymbol } from "../komponenten/Knopfsymbol";
import { Auswahlliste } from "./Auswahlliste";

const KAPITEL_STUDIEN = 10;
const KAPITEL_PARTIEN = 11;
const SEITEN: readonly Color[] = ["white", "black"];

/** Lädt ein Kapitel und zeigt Laden und Fehler wie die anderen Trainer. */
function MitKapitel({
  nummer,
  inhalt,
}: {
  nummer: number;
  inhalt: (kapitel: Parameters<typeof studienAus>[0]) => React.ReactNode;
}) {
  const daten = useDaten(() => ladeKapitel(nummer), `kapitel-${nummer}`);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  return <>{inhalt(daten.wert)}</>;
}

const PRUEFUNGEN = [
  "studien.pruefung1",
  "studien.pruefung2",
  "studien.pruefung3",
  "studien.pruefung4",
] as const;

/** Die vier Prüfungen aus Kapitel 10 als Erinnerung (Rückfrage W11, nach Nachlesen im Buch). */
function Pruefungen() {
  return (
    <details className="karte" data-testid="studien-pruefungen">
      <summary>{t("studien.pruefungenTitel")}</summary>
      <ol>
        {PRUEFUNGEN.map((k) => (
          <li key={k}>{t(k)}</li>
        ))}
      </ol>
    </details>
  );
}

function Studienrunde({ studien }: { studien: readonly Aufgabe[] }) {
  const [durchlauf, setzeDurchlauf] = useState(0);
  return (
    <>
      <Pruefungen />
      <Rundenablauf
        key={durchlauf}
        kennung="studien"
        erzeuge={() =>
          studien.map((a) => (r) => (
            <Repertoireaufgabe
              aufgabe={a}
              runde={r}
              vergleichen
              auftrag={t("studien.auftrag", {
                titel: a.titel,
                farbe: t(a.seite === "white" ? "farbe.w" : "farbe.b"),
              })}
            />
          ))
        }
        nochmal={() => setzeDurchlauf(durchlauf + 1)}
        zurAuswahl={null}
      />
    </>
  );
}

export function StudienBereich() {
  return (
    <MitKapitel nummer={KAPITEL_STUDIEN} inhalt={(k) => <Studienrunde studien={studienAus(k)} />} />
  );
}

/** Auswahl von Partie und Seite für „Zug erraten“. */
function Partiewahl({
  partien,
  starte,
}: {
  partien: (seite: Color) => readonly Aufgabe[];
  starte: (aufgabe: Aufgabe) => void;
}) {
  const [seite, setzeSeite] = useState<Color>("white");
  const liste = partien(seite);
  const [index, setzeIndex] = useState(0);
  const gewaehlt = liste[index] ?? null;
  return (
    <div
      className="trainerrunde trainerwahl"
      data-testid="zugerraten-wahl"
      data-tour="trainer-wahl"
    >
      <Auswahlliste
        titel={t("zugerraten.partie")}
        eintraege={liste.map((p, i) => ({ wert: String(i), text: p.titel }))}
        wert={String(index)}
        setze={(i) => setzeIndex(Number(i))}
      />
      <fieldset className="zahlwahl">
        <legend>{t("repertoiretrainer.seite")}</legend>
        {SEITEN.map((s) => (
          <button
            key={s}
            type="button"
            className="chip"
            aria-pressed={seite === s}
            onClick={() => setzeSeite(s)}
          >
            {t(s === "white" ? "farbe.w" : "farbe.b")}
          </button>
        ))}
      </fieldset>
      <button
        type="button"
        className="knopf-haupt"
        disabled={gewaehlt === null}
        onClick={() => gewaehlt && starte(gewaehlt)}
      >
        <Knopfsymbol art="starten" />
        {t("taktiktrainer.starten")}
      </button>
    </div>
  );
}

function Zugerraten({ kapitel }: { kapitel: Parameters<typeof partienAus>[0] }) {
  const [partie, setzePartie] = useState<Aufgabe | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (!partie) return <Partiewahl partien={(s) => partienAus(kapitel, s)} starte={setzePartie} />;
  return (
    <Rundenablauf
      key={`${partie.titel}-${partie.seite}-${durchlauf}`}
      kennung="zugErraten"
      erzeuge={() => [(r) => <Zugerratenaufgabe aufgabe={partie} runde={r} />]}
      nochmal={() => setzeDurchlauf(durchlauf + 1)}
      zurAuswahl={() => setzePartie(null)}
    />
  );
}

export function ZugErratenBereich() {
  return <MitKapitel nummer={KAPITEL_PARTIEN} inhalt={(k) => <Zugerraten kapitel={k} />} />;
}
