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
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { zaehleAktivitaet } from "../../../speicher/aktivitaet";
import { aendere } from "../../../speicher/speicher";
import {
  eroeffnungsnameFuer,
  mitSammeleintrag,
  NOTIZ_HOECHSTENS,
  type Herkunft,
  type Sammelverlauf,
} from "../../../training/lernsammlung";
import { Aufklapper } from "../bausteine/Aufklapper";
import { MitInfo } from "../bausteine/InfoKnopf";
import { useEroeffnungsindex } from "../bausteine/useEroeffnungsindex";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { Sammelfelder, type Sammelwerte } from "./Sammelfelder";

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

/**
 * Bestätigung nach dem Speichern, mit Sprung zur Sammlung (Wunsch des Autors, 1.11.2026: nach
 * „Merken“ gleich sehen, wo der Eintrag liegt). In der Sammlung selbst entfällt der Sprung.
 */
function Gespeichert({ mitSprung }: { mitSprung: boolean }) {
  const { navigiere } = useNavigation();
  return (
    <p className="meldung gut" role="status" data-testid="sammlung-gespeichert">
      {t("sammlung.gespeichert")}{" "}
      {mitSprung && (
        <button
          type="button"
          className="knopf-link"
          onClick={() => navigiere({ bildschirm: "lernsammlung" })}
        >
          {t("sammlung.oeffnen")}
        </button>
      )}
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
  vorschlagNotiz = "",
  mitSprung = true,
}: {
  fen: string | null;
  herkunft: Sammelherkunft;
  beiGespeichert?: () => void;
  /** Vorschlag für die Notiz (Rückblick: woher die Stellung stammt); der Leser ändert. */
  vorschlagNotiz?: string;
  /** Kopfzeile mit Fragezeichen (unter dem Brett der Abbildung, Wunsch des Autors 19.10.2026). */
  mitErklaerung?: boolean;
  /** Nach dem Speichern „Zur Lernsammlung“ zeigen (nicht in der Sammlung selbst). */
  mitSprung?: boolean;
}) {
  const index = useEroeffnungsindex(KAPITEL_MIT_INDEX);
  const [werte, setzeWerte] = useState({
    plan: "",
    notiz: vorschlagNotiz.slice(0, NOTIZ_HOECHSTENS),
  });
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
      plan: werte.plan.trim(),
      notiz: werte.notiz.trim(),
    };
    void aendere((daten) =>
      zaehleAktivitaet(
        { ...daten, sammlung: mitSammeleintrag(daten.sammlung, eintrag) },
        "sammlung",
        1,
        new Date(),
      ),
    );
    setzeGespeichert(true);
    beiGespeichert?.();
  };
  const aendern = (teil: Partial<Sammelwerte>) => {
    const { eroeffnung: neueEroeffnung, ...rest } = teil;
    if (neueEroeffnung !== undefined) setzeEroeffnung(neueEroeffnung);
    setzeWerte((alt) => ({ ...alt, ...rest }));
  };
  if (gespeichert) return <Gespeichert mitSprung={mitSprung} />;
  return (
    <div className="fehlerformular" data-testid="sammelformular">
      {mitErklaerung && (
        <MitInfo
          zeile={<strong>{t("sammlung.hinein")}</strong>}
          erklaerung={<p>{t("sammlung.erklaerung")}</p>}
          thema={t("sammlung.erklaerungThema")}
        />
      )}
      <Sammelfelder werte={{ ...werte, eroeffnung }} beiAenderung={aendern} />
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
