/**
 * Karte „Dein Stapel für heute“ oben im Bereich Training (Entwurf C2, 31.10.2026): ein
 * gezeichneter Kartenstapel mit der Zahl der fälligen Wiederholungen, darunter woher sie kommen,
 * und der Knopf „Durchgehen“.
 *
 * Rolle im Gesamtbild: Ersetzt im Training die Liste mit einem Knopf je Quelle (die bleibt in der
 * Karte „Dein nächster Schritt“ und in den Kurzplänen, FaelligeWiederholungen.tsx). Gezählt wird
 * mit useFaelligeUebersicht, also genau wie dort. „Durchgehen“ startet zuerst die Übungen aus dem
 * Buch, sonst den ersten Trainer mit fälligen Aufgaben; die übrigen Trainer tragen auf ihrer Karte
 * die Plakette „fällig“. Ohne Fälliges: der nächste Termin, der Stapel blass; ganz leer eine
 * kurze Zeile mit ⓘ und „Übungen lösen“ (Weniger Text P1, 31.10.2026).
 * Abhängigkeiten: vorhandeneAufgaben.ts, Speicher, Navigation, i18n.
 */
import { BookOpen } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { datumText, t, tZahl } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { MitInfoblase } from "../bausteine/Infoblase";
import { useFaelligeUebersicht, type FaelligeUebersicht } from "./vorhandeneAufgaben";

/** Größe des Buchzeichens im Knopf „Übungen lösen“ (Bildpunkte). */
const KNOPFZEICHEN = 18;

/** Der gezeichnete Stapel: drei Karten, die oberste mit Brettmuster, dazu die Zahl. */
function Stapelbild({ anzahl }: { anzahl: number }) {
  return (
    <div className={anzahl > 0 ? "stapelbild" : "stapelbild leer"} aria-hidden="true">
      <span className="stapelblatt hinten" />
      <span className="stapelblatt mitte" />
      <span className="stapelblatt vorn" />
      {anzahl > 0 && <span className="stapelzahl">{anzahl}</span>}
    </div>
  );
}

/** Woher die Karten kommen. Beispiel: „2 aus dem Buch · 3 Falle oder Köder · 1 Strukturerkenner“. */
function herkunft({ reihe, trainer }: FaelligeUebersicht): string {
  const teile = reihe.length > 0 ? [t("trainingslook.stapelBuch", { anzahl: reihe.length })] : [];
  return [
    ...teile,
    ...trainer.map(({ kennung, anzahl }) =>
      t("trainingslook.stapelTrainer", { anzahl, trainer: t(`trainer.${kennung}.name`) }),
    ),
  ].join(" · ");
}

/**
 * Wenn nichts fällig ist: der nächste Termin; ist der Stapel ganz leer, eine kurze Zeile mit
 * „Übungen lösen“ (Weniger Text P1, 31.10.2026), der frühere Satz steht im ⓘ.
 */
function NichtsFaellig() {
  const { wechsleBereich } = useNavigation();
  const karten = useSpeicher((z) => z.daten.karten);
  const termine = Object.values(karten).map((k) => Date.parse(k.faellig));
  const naechster = termine.length > 0 ? new Date(Math.min(...termine)) : null;
  if (naechster)
    return <p className="hinweis">{t("training.naechsteFaellig", { datum: datumText(naechster) })}</p>;
  return (
    <>
      <MitInfoblase
        zeile={<p className="leerzustand-zeile">{t("wenigertext.seiten.stapel.leer")}</p>}
        thema={t("trainingslook.stapelTitel")}
        erklaerung={<p>{t("trainingslook.stapelLeer")}</p>}
      />
      <button
        type="button"
        className="knopf-zweit leerzustand-knopf"
        data-testid="stapel-leer"
        onClick={() => wechsleBereich("buch")}
      >
        <BookOpen size={KNOPFZEICHEN} aria-hidden="true" />
        {t("wenigertext.seiten.knopf.uebungen")}
      </button>
    </>
  );
}

/** Die Karte oben im Training. Beispiel: 6 fällig → Stapel mit „6“ und „Durchgehen“. */
export function Stapelkarte() {
  const { navigiere } = useNavigation();
  const uebersicht = useFaelligeUebersicht();
  const { reihe, trainer, gesamt } = uebersicht;
  const erste = reihe[0];
  const ersterTrainer = trainer[0];
  const durchgehen = () => {
    if (erste) navigiere({ bildschirm: "uebung", ...erste, reihe });
    else if (ersterTrainer) navigiere({ bildschirm: "trainer", kennung: ersterTrainer.kennung });
  };
  return (
    <section className="karte stapelkarte" data-testid="faellig" data-tour="training-faellig">
      <Stapelbild anzahl={gesamt} />
      <div className="stapeltext">
        <h2>{t("trainingslook.stapelTitel")}</h2>
        {gesamt > 0 ? (
          <>
            <p className="hinweis" data-testid="stapel-zahl">
              {tZahl("trainingslook.stapelZahl", gesamt, { anzahl: gesamt })} · {herkunft(uebersicht)}
            </p>
            <button type="button" className="knopf-haupt" onClick={durchgehen}>
              {t("trainingslook.durchgehen")}
            </button>
          </>
        ) : (
          <NichtsFaellig />
        )}
      </div>
    </section>
  );
}
