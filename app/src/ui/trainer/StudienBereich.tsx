/**
 * Trainer „Studien lösen“ (Kapitel 10) und „Zug erraten“ (Kapitel 11).
 *
 * Rolle im Gesamtbild: Beide laden ihr Kapitel (daten/laden.ts) und spielen die Zugfolgen des
 * Buches im gemeinsamen Rundenablauf. Studien: alle Studien des Kapitels nacheinander, gelöst
 * wie im Repertoire-Trainer. Zug erraten: Quelle (Buch, berühmte Partien, aktuelle Turniere; seit
 * 30.10.2026), Partie und Seite wählen (Zugerratenwahl.tsx), eine Partie je Runde.
 * Abhängigkeiten: training/studientrainer.ts, Repertoireaufgabe, Zugerratenaufgabe, i18n.
 */
import { useState } from "react";
import { ladeKapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import type { Repertoireaufgabe as Aufgabe } from "../../training/repertoiretrainer";
import { partienAus, studienAus, type Ratepartie } from "../../training/studientrainer";
import { PARTIEQUELLEN, type Partiequelle } from "../../training/zusatzpartien";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Repertoireaufgabe } from "./Repertoireaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { Zugerratenaufgabe } from "./Zugerratenaufgabe";
import { Partiewahl } from "./Zugerratenwahl";
import { Startkarte } from "./startkarte/Startkarte";
import { useGemerkt } from "./startkarte/useGemerkt";

const KAPITEL_STUDIEN = 10;
const KAPITEL_PARTIEN = 11;

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

/** Startkarte, dann alle Studien des Kapitels nacheinander; die vier Prüfungen stehen darüber. */
function Studienrunde({ studien }: { studien: readonly Aufgabe[] }) {
  const [laeuft, setzeLaeuft] = useState(false);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (!laeuft)
    return (
      <Startkarte
        kennung="studien"
        testkennung="studien-wahl"
        start={{
          zusatz: t("trainerstart.stellungen", { anzahl: studien.length }),
          starte: () => setzeLaeuft(true),
        }}
      />
    );
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
        zurAuswahl={() => setzeLaeuft(false)}
      />
    </>
  );
}

/**
 * Der Trainer „Studien lösen“ (Kapitel 10): alle Studien des Kapitels nacheinander Zug für Zug
 * lösen.
 */
export function StudienBereich() {
  return (
    <MitKapitel nummer={KAPITEL_STUDIEN} inhalt={(k) => <Studienrunde studien={studienAus(k)} />} />
  );
}

function Zugerraten({ kapitel }: { kapitel: Parameters<typeof partienAus>[0] }) {
  const [quelle, setzeQuelle] = useGemerkt<Partiequelle>(
    "zugErraten",
    "quelle",
    PARTIEQUELLEN,
    "buch",
  );
  const [partie, setzePartie] = useState<Ratepartie | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (!partie)
    return (
      <Partiewahl
        quelle={quelle}
        setzeQuelle={setzeQuelle}
        buchpartien={(s) => partienAus(kapitel, s)}
        starte={setzePartie}
      />
    );
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

/**
 * Der Trainer „Zug erraten“ (Kapitel 11): Quelle, Partie und Seite wählen, dann die Züge des
 * Meisters raten. Vorgabe sind die Partien des Buches; Zusatzpartien sind gekennzeichnet.
 */
export function ZugErratenBereich() {
  return <MitKapitel nummer={KAPITEL_PARTIEN} inhalt={(k) => <Zugerraten kapitel={k} />} />;
}
