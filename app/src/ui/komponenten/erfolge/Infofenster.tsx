/**
 * Das Infofenster zu Orden, Abzeichen und Kapitelaufgaben (Wunsch des Autors, 31.10.2026): Ein
 * Tipp auf ein Stück im Profil oder auf eine Nebenaufgabe des Lernpfads öffnet ein kleines Blatt
 * mit Bild, Bedingung, Stand (offen) oder Datum und „Teilen“ (verdient) und, wo es einen Ort gibt,
 * einem Knopf „Los geht's“, der direkt dorthin führt.
 *
 * Rolle im Gesamtbild: Ein gemeinsames Fenster für alle Stellen (Regale, Glanzstück, „Als
 * Nächstes“ und Ringe im Profil, Bündel neben den Stationen des Lernpfads). Mit mehreren Stücken
 * (ein Bündel) zeigt es erst die Liste, ein Tipp darauf das Stück, „Zurück“ wieder die Liste.
 * Barrierefreiheit über Blatt.tsx: Dialog mit Titel, Fokus hinein und zurück, Esc und Kreuz
 * schließen. Wenig Text: Bedingung als ein Satz, Stand als Balken mit „x von y“, Haken für
 * Geschafftes.
 * Abhängigkeiten: auswertung/Blatt.tsx, Stueckbild.tsx, stueckziele.ts,
 * teilen/Stueckteilen.tsx, bausteine/Fortschrittsbalken.tsx, Navigation, Speicher, i18n, lucide.
 * Stil in ui/stil/infofenster.css.
 */
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { datumText, t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import "../../stil/infofenster.css";
import { Blatt } from "../auswertung/Blatt";
import { Fortschrittsbalken } from "../bausteine/Fortschrittsbalken";
import { AbzeichenTeilen, OrdenTeilen } from "../teilen/Stueckteilen";
import { glanzname, verdientSchluessel, type Erfolgsstueck } from "./erfolgsstuecke";
import { Stueckbild } from "./Stueckbild";
import { fuehrtWoandershin, stueckziel } from "./stueckziele";

const SYMBOL = 18;

/** Stand eines Stücks: Haken mit Datum (verdient), Balken mit „x von y“ oder „noch offen“. */
function Stand({ stueck }: { stueck: Erfolgsstueck }) {
  const datum = useSpeicher((z) => z.daten.verdient[verdientSchluessel(stueck)] ?? null);
  if (stueck.verdient) {
    return (
      <p className="infofenster-geschafft" data-testid="infofenster-verdient">
        <Check size={SYMBOL} strokeWidth={3} aria-hidden="true" />
        {datum
          ? t("infofenster.verdientAm", { datum: datumText(new Date(datum)) })
          : t("infofenster.verdient")}
      </p>
    );
  }
  if (!stueck.anteil) return <p className="infofenster-offen">{t("infofenster.offen")}</p>;
  const wert = t("fortschritt.anteil", { ...stueck.anteil });
  return (
    <div className="infofenster-stand">
      <Fortschrittsbalken anteil={stueck.anteil} beschriftung={`${stueck.name}: ${wert}`} />
      <span data-testid="infofenster-stand">{wert}</span>
    </div>
  );
}

/** Teilen je Art; Kapitelaufgaben haben kein Bild zum Teilen. */
function Teilen({ stueck }: { stueck: Erfolgsstueck }) {
  if (!stueck.verdient || stueck.art === "aufgabe") return null;
  if (stueck.art === "orden" && stueck.ring) {
    return <OrdenTeilen ring={stueck.ring} name={glanzname(stueck)} klein={false} />;
  }
  return <AbzeichenTeilen kennung={stueck.kennung} klein={false} />;
}

/** Ein Stück: Bild, Bedingung, Stand, Teilen und der Knopf zum Ort. */
function Stueckansicht({
  stueck,
  kapitel,
  beiSchliessen,
}: {
  stueck: Erfolgsstueck;
  kapitel: number;
  beiSchliessen: () => void;
}) {
  const { ansicht, navigiere } = useNavigation();
  const ziel = stueckziel(stueck, kapitel);
  return (
    <div className="infofenster-stueck">
      <Stueckbild stueck={stueck} klasse="infofenster-bild" />
      <p className="infofenster-bedingung" data-testid="infofenster-bedingung">
        {stueck.bedingung}
      </p>
      <Stand stueck={stueck} />
      <Teilen stueck={stueck} />
      {!stueck.verdient && fuehrtWoandershin(ziel, ansicht) && (
        <button
          type="button"
          className="knopf-haupt infofenster-los"
          onClick={() => {
            beiSchliessen();
            navigiere(ziel);
          }}
        >
          {t("infofenster.los")}
          <ChevronRight size={SYMBOL} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/** Rechts in einer Zeile der Liste: Haken oder „x/y“. */
function Kurzstand({ stueck }: { stueck: Erfolgsstueck }) {
  if (stueck.verdient) {
    return (
      <span className="infofenster-haken">
        <Check size={SYMBOL} strokeWidth={3} aria-hidden="true" />
      </span>
    );
  }
  if (!stueck.anteil) return null;
  return (
    <span className="infofenster-kurzstand">
      {t("nebenaufgaben.kurzstand", { ...stueck.anteil })}
    </span>
  );
}

/** „Zurück zur Liste“; nimmt beim Erscheinen den Fokus, weil die Zeile der Liste verschwindet. */
function Zurueck({ beiTipp }: { beiTipp: () => void }) {
  const knopf = useRef<HTMLButtonElement>(null);
  useEffect(() => knopf.current?.focus(), []);
  return (
    <button ref={knopf} type="button" className="knopf-link infofenster-zurueck" onClick={beiTipp}>
      <ChevronLeft size={SYMBOL} aria-hidden="true" />
      {t("infofenster.zurueck")}
    </button>
  );
}

/**
 * Die Liste eines Bündels: offene zuerst, je Zeile Bild, Name und Stand. `fokus`: Schlüssel der
 * Zeile, die nach „Zurück“ den Fokus bekommt (die zuletzt geöffnete).
 */
function Liste({
  stuecke,
  waehle,
  fokus,
}: {
  stuecke: readonly Erfolgsstueck[];
  waehle: (stueck: Erfolgsstueck) => void;
  fokus: string | null;
}) {
  const liste = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!fokus) return;
    liste.current?.querySelector<HTMLButtonElement>(`[data-schluessel="${fokus}"]`)?.focus();
  }, [fokus]);
  const sortiert = [...stuecke].sort((a, b) => Number(a.verdient) - Number(b.verdient));
  return (
    <ul className="infofenster-liste" ref={liste}>
      {sortiert.map((s) => (
        <li key={verdientSchluessel(s)} data-testid={`nebenaufgabe-${s.art}-${s.kennung}`}>
          <button
            type="button"
            className="infofenster-zeile"
            data-schluessel={verdientSchluessel(s)}
            onClick={() => waehle(s)}
          >
            <Stueckbild stueck={s} klasse="infofenster-mini" />
            <span className="infofenster-zeilenname">{glanzname(s)}</span>
            <Kurzstand stueck={s} />
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * Das Fenster. Ein Stück: gleich das Stück. Mehrere: erst die Liste mit `titel`.
 * `kapitel`: Kapitel des Bündels (für Ziele wie „Kapitel öffnen“); im Profil 0.
 * Beispiel: <Infofenster stuecke={[erstesMatt]} beiSchliessen={zu} /> → „Erstes Matt“,
 * „Eine Partie durch Matt gewonnen.“, „noch offen“, „Los geht's“ (Spielen).
 */
export function Infofenster({
  stuecke,
  titel,
  kapitel = 0,
  beiSchliessen,
}: {
  stuecke: readonly Erfolgsstueck[];
  titel?: string;
  kapitel?: number;
  beiSchliessen: () => void;
}) {
  const [gewaehlt, setzeGewaehlt] = useState<Erfolgsstueck | null>(null);
  const [zuletzt, setzeZuletzt] = useState<string | null>(null);
  const einzeln = stuecke.length === 1 ? (stuecke[0] ?? null) : null;
  const stueck = einzeln ?? gewaehlt;
  return (
    <Blatt
      titel={stueck ? glanzname(stueck) : (titel ?? "")}
      beiSchliessen={beiSchliessen}
      testid="infofenster"
      kinder={
        <>
          {gewaehlt && !einzeln && <Zurueck beiTipp={() => setzeGewaehlt(null)} />}
          {stueck ? (
            <Stueckansicht stueck={stueck} kapitel={kapitel} beiSchliessen={beiSchliessen} />
          ) : (
            <Liste
              stuecke={stuecke}
              fokus={zuletzt}
              waehle={(s) => {
                setzeZuletzt(verdientSchluessel(s));
                setzeGewaehlt(s);
              }}
            />
          )}
        </>
      }
    />
  );
}
