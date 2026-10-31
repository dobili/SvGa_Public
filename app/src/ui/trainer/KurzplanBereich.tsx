/**
 * Trainer „Kurzpläne“: 5 Minuten nur Wiederholungen, 15 Minuten Kurzplan, Taktik auf Zeit und
 * Tagesaufgabe mit Serie.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (26.10.2026): kurze Pläne, die man in der App allein
 * erledigt. Der 5- und der 15-Minuten-Plan führen wie der 30-Minuten-Plan durch Schritte mit
 * Uhr (die Zeit ist ein Richtwert); „Taktik auf Zeit“ und „Tagesaufgabe“ stehen in
 * ZeitrundeBereich.tsx. Die Aufteilung der Pläne ist ein Vorschlag der App, nicht Inhalt des
 * Buches (training/kurzplaene.ts). Eine abgeschlossene Einheit zählt als Durchgang.
 * Abhängigkeiten: training/kurzplaene.ts, FaelligeWiederholungen, ZeitrundeBereich.tsx,
 * app/merker.ts, speicher/fortschritt.ts, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { liesMerker, schreibeMerker } from "../../app/merker";
import { t } from "../../i18n/sprache";
import { zeitAlsText } from "../../spiel/uhr";
import { notiereDurchgang } from "../../speicher/fortschritt";
import { aendere } from "../../speicher/speicher";
import {
  aktuellerKurzschritt,
  KURZPLAENE,
  kurzeinheitAus,
  kurzRestMs,
  naechsterKurzschritt,
  starteKurzplan,
  type Kurzeinheit,
  type Kurzplanart,
} from "../../training/kurzplaene";
import { FaelligeWiederholungen } from "../komponenten/training/FaelligeWiederholungen";
import type { Startmodus } from "./startkarte/einstellung";
import { Startkarte } from "./startkarte/Startkarte";
import { useJetzt } from "./usePlanstand";
import { Tagesaufgabe, TaktikAufZeit } from "./ZeitrundeBereich";

const MERKER_EINHEIT = "kurzplan";

type Ansicht = "start" | "zeit" | "tag";

/** Der gemerkte Stand der Einheit und eine Funktion, die ihn ändert und gleich merkt. */
function useKurzeinheit(): [Kurzeinheit | null, (neu: Kurzeinheit | null) => void] {
  const [einheit, setzeEinheit] = useState(() =>
    kurzeinheitAus(liesMerker(MERKER_EINHEIT), Date.now()),
  );
  const aendereEinheit = (neu: Kurzeinheit | null) => {
    schreibeMerker(MERKER_EINHEIT, neu ? JSON.stringify(neu) : "");
    setzeEinheit(neu);
  };
  return [einheit, aendereEinheit];
}

/** Ein weiterer Modus der Startkarte: Kennung, Zeichen, Texte und was er startet. */
function modus(
  kennung: "mini" | "zeit" | "tag",
  symbol: Startmodus["symbol"],
  starte: () => void,
): Startmodus {
  return {
    kennung,
    symbol,
    titel: t(`trainerstart.modus.${kennung}`),
    text: t(`trainerstart.modus.${kennung}Text`),
    starte,
    testkennung: `kurzplan-${kennung}`,
  };
}

/**
 * Ohne laufende Einheit: die Startkarte mit dem 15-Minuten-Plan als großem Knopf und den drei
 * anderen Angeboten als Modi (Entwurf G1, 31.10.2026).
 */
function Start({
  starteEinheit,
  zeige,
}: {
  starteEinheit: (plan: Kurzplanart) => void;
  zeige: (ansicht: Ansicht) => void;
}) {
  return (
    <Startkarte
      kennung="kurzplaene"
      testkennung="kurzplan-start"
      start={{
        text: t("trainerstart.kurzplan.start"),
        zusatz: t("trainerstart.kurzplan.zusatz"),
        starte: () => starteEinheit("kurz"),
        testkennung: "kurzplan-kurz",
      }}
      modi={[
        modus("mini", "plan", () => starteEinheit("mini")),
        modus("zeit", "zeit", () => zeige("zeit")),
        modus("tag", "tag", () => zeige("tag")),
      ]}
      hilfen={[t("kurzplan.vorschlag")]}
    />
  );
}

/** Kopf der laufenden Einheit: Plan, Schritt, Restzeit. */
function Uhrzeile({ einheit }: { einheit: Kurzeinheit }) {
  const jetzt = useJetzt(true);
  const rest = kurzRestMs(einheit, jetzt);
  const schritt = aktuellerKurzschritt(einheit);
  return (
    <div className="karte planuhr" data-testid="kurzplan-uhr">
      <p className="hinweis">
        {t("kurzplan.stand", {
          plan: t(`kurzplan.${einheit.plan}`),
          nummer: einheit.schritt + 1,
          anzahl: KURZPLAENE[einheit.plan].length,
        })}
      </p>
      <h2 className="karte-titel">
        {t(`kurzplan.schritt.${schritt.art}`)} (
        {t("dreissig.minuten", { minuten: schritt.minuten })})
      </h2>
      <p className={rest < 0 ? "planzeit planzeit-ueber" : "planzeit"} role="timer">
        {rest < 0
          ? t("dreissig.ueber", { zeit: zeitAlsText(-rest) })
          : t("dreissig.rest", { zeit: zeitAlsText(rest) })}
      </p>
    </div>
  );
}

/** Der Inhalt eines Schritts: die fälligen Wiederholungen oder der Weg zum Taktiktrainer. */
function Schrittinhalt({ art }: { art: "wiederholung" | "taktik" }) {
  const { navigiere } = useNavigation();
  if (art === "wiederholung") return <FaelligeWiederholungen />;
  return (
    <>
      <p className="hinweis">{t("kurzplan.taktikHinweis")}</p>
      <button
        type="button"
        className="knopf-zweit"
        onClick={() => navigiere({ bildschirm: "trainer", kennung: "taktik" })}
      >
        {t("trainer.taktik.name")}
      </button>
    </>
  );
}

/** Die laufende Einheit mit „Schritt erledigt“ und „Abbrechen“. */
function Einheit({
  einheit,
  aendere: aendereEinheit,
  beiFertig,
}: {
  einheit: Kurzeinheit;
  aendere: (neu: Kurzeinheit | null) => void;
  beiFertig: (plan: Kurzplanart) => void;
}) {
  const schritt = aktuellerKurzschritt(einheit);
  const letzter = einheit.schritt + 1 === KURZPLAENE[einheit.plan].length;
  const erledigt = () => {
    const weiter = naechsterKurzschritt(einheit, Date.now());
    aendereEinheit(weiter);
    if (!weiter) beiFertig(einheit.plan);
  };
  return (
    <div className="trainerrunde" data-testid="kurzplan-einheit">
      <Uhrzeile einheit={einheit} />
      <Schrittinhalt key={`${einheit.plan}-${einheit.schritt}`} art={schritt.art} />
      <button type="button" className="knopf-haupt" onClick={erledigt}>
        {t(letzter ? "dreissig.abschliessen" : "dreissig.erledigt")}
      </button>
      <button type="button" className="knopf-link" onClick={() => aendereEinheit(null)}>
        {t("dreissig.abbrechen")}
      </button>
    </div>
  );
}

/** Der Trainer „Kurzpläne“. */
export function KurzplanBereich() {
  const [einheit, aendereEinheit] = useKurzeinheit();
  const [ansicht, setzeAnsicht] = useState<Ansicht>("start");
  const [geschafft, setzeGeschafft] = useState<Kurzplanart | null>(null);
  const beiFertig = (plan: Kurzplanart) => {
    setzeGeschafft(plan);
    const schritte = KURZPLAENE[plan].length;
    void aendere((d) =>
      notiereDurchgang(d, "kurzplaene", { aufgaben: schritte, richtig: schritte }, new Date()),
    );
  };
  if (einheit) return <Einheit einheit={einheit} aendere={aendereEinheit} beiFertig={beiFertig} />;
  if (ansicht === "zeit") return <TaktikAufZeit zurueck={() => setzeAnsicht("start")} />;
  if (ansicht === "tag") return <Tagesaufgabe zurueck={() => setzeAnsicht("start")} />;
  return (
    <>
      {geschafft && (
        <p className="meldung" data-testid="kurzplan-geschafft">
          {t("kurzplan.geschafft", { plan: t(`kurzplan.${geschafft}`) })}
        </p>
      )}
      <Start
        starteEinheit={(plan) => {
          setzeGeschafft(null);
          aendereEinheit(starteKurzplan(plan, Date.now()));
        }}
        zeige={setzeAnsicht}
      />
    </>
  );
}
