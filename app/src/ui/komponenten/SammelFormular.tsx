/**
 * Formular „In die Lernsammlung“: Plan-Satz, Notiz und Eröffnung zu einer Stellung, speichern.
 *
 * Rolle im Gesamtbild: Lernsammlung (Kapitel 12, AP 15). Dasselbe Formular steht an der
 * Abbildung (Symbol am Brett), im Rückblick einer Partie (unter dem Zug), nach jeder
 * Trainer-Aufgabe und im Bildschirm der Lernsammlung (Stellung als FEN). Die Eröffnung schlägt
 * die App vor (training/lernsammlung.ts, eroeffnungsnameFuer); der Leser darf sie ändern.
 * Dazu der Knopf SammelKnopf, der das Formular aufklappt.
 * Abhängigkeiten: training/lernsammlung.ts, speicher/speicher.ts, useEroeffnungsindex, i18n.
 */
import { BookmarkPlus } from "lucide-react";
import { useId, useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { aendere } from "../../speicher/speicher";
import {
  EROEFFNUNG_HOECHSTENS,
  eroeffnungsnameFuer,
  mitSammeleintrag,
  NOTIZ_HOECHSTENS,
  PLAN_HOECHSTENS,
  type Herkunft,
  type Sammelverlauf,
} from "../../training/lernsammlung";
import { Aufklapper } from "./Aufklapper";
import { MitInfo } from "./InfoKnopf";
import { useEroeffnungsindex } from "./useEroeffnungsindex";
import { Knopfsymbol } from "./Knopfsymbol";

/** Größe des Lesezeichens am Brett, wie die anderen Brettschalter. */
const SYMBOLGROESSE = 20;

/** Kapitel, ab dem der Eröffnungsindex lädt; die Lernsammlung braucht ihn immer. */
const KAPITEL_MIT_INDEX = 12;

/** Woher die Stellung kommt, mit Fundstelle und Weg (für Eröffnung und PGN). */
export interface Sammelherkunft {
  readonly herkunft: Herkunft;
  /** Abbildungsnummer, Kennung des Trainers oder leer. */
  readonly quelle: string;
  readonly verlauf?: Sammelverlauf;
}

/** Neue Kennung für einen Eintrag (Zeit und Zufall genügen für ein Gerät). */
function neueKennung(): string {
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Ein beschriftetes Textfeld (eine Zeile oder mehrere). */
function Feld({
  name,
  wert,
  laenge,
  beispiel,
  zeilen,
  beiAenderung,
}: {
  name: string;
  wert: string;
  laenge: number;
  beispiel: string;
  zeilen?: number;
  beiAenderung: (wert: string) => void;
}) {
  const id = useId();
  const gemeinsam = {
    id,
    className: "textfeld",
    maxLength: laenge,
    value: wert,
    placeholder: beispiel,
  };
  return (
    <>
      <label className="einstellung-name" htmlFor={id}>
        {name}
      </label>
      {zeilen ? (
        <textarea {...gemeinsam} rows={zeilen} onChange={(e) => beiAenderung(e.target.value)} />
      ) : (
        <input {...gemeinsam} type="text" onChange={(e) => beiAenderung(e.target.value)} />
      )}
    </>
  );
}

/** Bestätigung nach dem Speichern, mit Weg zur Sammlung. */
function Gespeichert() {
  const { navigiere } = useNavigation();
  return (
    <p className="meldung gut" role="status">
      {t("sammlung.gespeichert")}{" "}
      <button
        type="button"
        className="knopf-link"
        onClick={() => navigiere({ bildschirm: "lernsammlung" })}
      >
        {t("sammlung.oeffnen")}
      </button>
    </p>
  );
}

/**
 * Das Formular. Beispiel: Abb. 2.2, Plan „Druck auf e5, dann d4“ → Eintrag mit Eröffnung
 * „Spanische Partie“ und dem Weg 1. e4 e5 2. Sf3 Sc6 3. Lb5.
 * Sonderfall: Ohne gültige Stellung (fen null) bleibt „Speichern“ gesperrt.
 */
export function SammelFormular({
  fen,
  herkunft,
  beiGespeichert,
  mitErklaerung = false,
}: {
  fen: string | null;
  herkunft: Sammelherkunft;
  beiGespeichert?: () => void;
  /** Kopfzeile mit Fragezeichen (unter dem Brett der Abbildung, Wunsch des Autors 19.10.2026). */
  mitErklaerung?: boolean;
}) {
  const index = useEroeffnungsindex(KAPITEL_MIT_INDEX);
  const [plan, setzePlan] = useState("");
  const [notiz, setzeNotiz] = useState("");
  // null: die Eröffnung der App gilt; sobald der Leser tippt, gilt seine.
  const [eigeneEroeffnung, setzeEroeffnung] = useState<string | null>(null);
  const [gespeichert, setzeGespeichert] = useState(false);
  const vorschlag = fen ? eroeffnungsnameFuer(index, fen, herkunft.verlauf) : "";
  const eroeffnung = eigeneEroeffnung ?? vorschlag;
  const speichern = () => {
    if (fen === null) return;
    const eintrag = {
      id: neueKennung(),
      datum: new Date().toISOString(),
      fen,
      ...herkunft,
      eroeffnung: eroeffnung.trim(),
      plan: plan.trim(),
      notiz: notiz.trim(),
    };
    void aendere((daten) => ({ ...daten, sammlung: mitSammeleintrag(daten.sammlung, eintrag) }));
    setzeGespeichert(true);
    beiGespeichert?.();
  };
  if (gespeichert) return <Gespeichert />;
  return (
    <div className="fehlerformular" data-testid="sammelformular">
      {mitErklaerung && (
        <MitInfo
          zeile={<strong>{t("sammlung.hinein")}</strong>}
          erklaerung={<p>{t("sammlung.erklaerung")}</p>}
          thema={t("sammlung.erklaerungThema")}
        />
      )}
      <Feld
        name={t("sammlung.plan")}
        wert={plan}
        laenge={PLAN_HOECHSTENS}
        beispiel={t("sammlung.planBeispiel")}
        beiAenderung={setzePlan}
      />
      <Feld
        name={t("sammlung.notiz")}
        wert={notiz}
        laenge={NOTIZ_HOECHSTENS}
        beispiel={t("sammlung.notizBeispiel")}
        zeilen={2}
        beiAenderung={setzeNotiz}
      />
      <Feld
        name={t("sammlung.eroeffnung")}
        wert={eroeffnung}
        laenge={EROEFFNUNG_HOECHSTENS}
        beispiel={t("sammlung.eroeffnungBeispiel")}
        beiAenderung={setzeEroeffnung}
      />
      <button type="button" className="knopf-haupt" disabled={fen === null} onClick={speichern}>
        <Knopfsymbol art="speichern" />
        {t("sammlung.speichern")}
      </button>
    </div>
  );
}

/**
 * Knopf „In die Lernsammlung“, der das Formular aufklappt. Der Aufrufer setzt über `key` die
 * Stellung, damit das Formular bei einer neuen Stellung von vorn beginnt.
 */
export function SammelKnopf({ fen, herkunft }: { fen: string; herkunft: Sammelherkunft }) {
  return (
    <Aufklapper
      text={t("sammlung.hinein")}
      erklaerung={<p>{t("sammlung.erklaerung")}</p>}
      thema={t("sammlung.erklaerungThema")}
    >
      <SammelFormular fen={fen} herkunft={herkunft} />
    </Aufklapper>
  );
}

/** Lesezeichen am Brett der Abbildung: klappt das Formular unter dem Brett auf und zu. */
export function SammelSchalter({ an, beiKlick }: { an: boolean; beiKlick: () => void }) {
  return (
    <button
      type="button"
      className="knopf-symbol brettschalter"
      data-tour="brett-sammeln"
      aria-pressed={an}
      aria-label={t("sammlung.hineinName")}
      title={t("sammlung.hineinName")}
      onClick={beiKlick}
    >
      <BookmarkPlus size={SYMBOLGROESSE} aria-hidden="true" />
      {/* Kurzes Wort unter dem Symbol wie bei den anderen Brettsymbolen (DS5). */}
      <span className="brettschalter-text" aria-hidden="true">
        {t("sammlung.hineinKurz")}
      </span>
    </button>
  );
}
