/**
 * Die Schritte des 30-Minuten-Plans: zwei leichte Taktikaufgaben, die Partie gegen die Engine,
 * die Analyse der letzten Partie und am Studientag ein Thema aus einem der vier Bereiche.
 *
 * Rolle im Gesamtbild: Teil von ui/trainer/DreissigMinutenBereich.tsx (Trainer
 * „dreissigMinuten“, AP 13 Stufe 3). Die Schritte nutzen, was es schon gibt: Taktikaufgaben aus
 * dem Taktiktrainer, das Spiel gegen die Engine, den Rückblick einer Partie mit „In die
 * Fehlerdatenbank“ und die Trainer der vier Bereiche.
 * Abhängigkeiten: training/dreissigminuten.ts, training/taktiktrainer.ts, Rundenablauf,
 * Taktikaufgabe, Speicher, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { ladeTaktik } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { mitVorlieben } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { UHR_PARTIETAG } from "../../spiel/uhr";
import {
  BEREICHE,
  TRAINER_JE_BEREICH,
  type Schrittart,
  type Studienbereich,
} from "../../training/dreissigminuten";
import { taktikrunde } from "../../training/taktiktrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/useDaten";
import { Rundenablauf } from "./Rundenablauf";
import { Taktikaufgabe } from "./Taktikaufgabe";

/** Zwei Aufgaben der leichtesten Stufe (Kapitel 12: „in je etwa zwei Minuten“). */
const TAKTIK_AUFGABEN = 2;
const LEICHTESTE_STUFE = 1;

/** Zwei leichte Taktikaufgaben, gemischt; nach der Runde auf Wunsch zwei neue. */
function PlanTaktik() {
  const daten = useDaten(ladeTaktik, "trainer-taktik");
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const wahl = { thema: "gemischt", stufe: LEICHTESTE_STUFE } as const;
  return (
    <>
      <p className="hinweis">{t("dreissig.taktikHinweis")}</p>
      <Rundenablauf
        key={durchlauf}
        kennung="taktik"
        erzeuge={() =>
          taktikrunde(daten.wert.aufgaben, wahl, TAKTIK_AUFGABEN, ZUFALL).map((a) => (r) => (
            <Taktikaufgabe aufgabe={a} runde={r} />
          ))
        }
        nochmal={() => setzeDurchlauf(durchlauf + 1)}
        zurAuswahl={null}
      />
    </>
  );
}

/**
 * Zum Spiel gegen die Engine. Seit 0.2.91 stellt der Knopf vorher die Bedenkzeit 10 + 0 ein
 * (Kapitel 12, Partietag); der Leser kann sie beim Spielen noch ändern.
 */
function PlanPartie() {
  const { navigiere } = useNavigation();
  const zumSpielen = async () => {
    await aendere((d) => ({
      ...d,
      spiel: mitVorlieben(d.spiel, { ...d.spiel.vorlieben, uhr: UHR_PARTIETAG }),
    }));
    navigiere({ bildschirm: "spielen" });
  };
  return (
    <>
      <p className="hinweis">{t("dreissig.partieHinweis")}</p>
      <button type="button" className="knopf-zweit" onClick={() => void zumSpielen()}>
        {t("dreissig.partieStarten")}
      </button>
    </>
  );
}

/** Die letzte beendete Partie mit Rückblick; am Studientag dazu die Fehlerdatenbank. */
function PlanAnalyse({ gruendlich }: { gruendlich: boolean }) {
  const { navigiere } = useNavigation();
  const letzte = useSpeicher((z) => z.daten.spiel.partien[0]?.partie.id ?? null);
  return (
    <>
      <p className="hinweis">
        {t(gruendlich ? "dreissig.analyseHinweis" : "dreissig.kurzanalyseHinweis")}
      </p>
      {letzte ? (
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => navigiere({ bildschirm: "partie", id: letzte })}
        >
          {t("dreissig.letztePartie")}
        </button>
      ) : (
        <p className="hinweis" data-testid="plan-keine-partie">
          {t("dreissig.keinePartie")}
        </p>
      )}
      {gruendlich && (
        <button
          type="button"
          className="knopf-link"
          onClick={() => navigiere({ bildschirm: "trainer", kennung: "fehlerdatenbank" })}
        >
          {t("dreissig.fehlerdatenbank")}
        </button>
      )}
    </>
  );
}

/** Bereich wählen (vorgewählt der, der im Wechsel dran ist), dann einer seiner Trainer. */
function PlanThema({
  bereich,
  waehle,
}: {
  bereich: Studienbereich;
  waehle: (bereich: Studienbereich) => void;
}) {
  const { navigiere } = useNavigation();
  return (
    <>
      <fieldset className="zahlwahl">
        <legend>{t("dreissig.bereich")}</legend>
        {BEREICHE.map((b) => (
          <button
            key={b}
            type="button"
            className="chip"
            aria-pressed={bereich === b}
            onClick={() => waehle(b)}
          >
            {t(`dreissig.bereich.${b}`)}
          </button>
        ))}
      </fieldset>
      <p className="hinweis">{t("dreissig.bereichHinweis")}</p>
      <ul className="planliste">
        {TRAINER_JE_BEREICH[bereich].map((kennung) => (
          <li key={kennung}>
            <button
              type="button"
              className="knopf-zweit"
              onClick={() => navigiere({ bildschirm: "trainer", kennung })}
            >
              {t(`trainer.${kennung}.name`)}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Der Inhalt eines Schritts. */
export function Planschritt({
  art,
  bereich,
  waehleBereich,
}: {
  art: Schrittart;
  bereich: Studienbereich | null;
  waehleBereich: (bereich: Studienbereich) => void;
}) {
  switch (art) {
    case "taktik":
      return <PlanTaktik />;
    case "partie":
      return <PlanPartie />;
    case "kurzanalyse":
      return <PlanAnalyse gruendlich={false} />;
    case "analyse":
      return <PlanAnalyse gruendlich />;
    case "thema":
      return <PlanThema bereich={bereich ?? "taktik"} waehle={waehleBereich} />;
  }
}
