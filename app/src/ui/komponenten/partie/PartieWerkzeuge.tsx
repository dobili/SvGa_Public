/**
 * Werkzeuge in der Partie gegen die Engine: Zählen, Röntgen und Warnsignale W1–W7 als Symbole am
 * Brett, darunter die Bündel des Buches mit ihren Reitern, dazu die Ergebniskarten wie an den
 * Abbildungen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors P1 (Rückmeldung zu 0.2.31) und Vorschlag B2, vom Autor am
 * 16.10.2026 angenommen: zuerst die Vorstufe, die drei Werkzeuge, die man in jeder Phase braucht
 * („In jeder Phase zuerst Warnsignale und Röntgen“, Kapitel 12; „Zählen“ seit 0.2.31 immer am
 * Brett), dann die Bündel Eröffnung prüfen, Skelett-Röntgen, Planfindung, Taktik, Endspiel und
 * Denkroutine (partiewerkzeug.ts).
 * Verhalten: Alle Werkzeuge zeigen nur an, die Figuren lassen sich weiter ziehen. Nur mit
 * „Zählen“ zählt ein Tipp das Feld, statt zu ziehen; abwählen, und es wird wieder gezogen. Die
 * Engine-Teile (Gegner?, Erzwingende Züge bis zur Ruhe, Ruhe, Nachrechnung der Zielbilanz)
 * laufen wie an den Abbildungen (Werkzeugzusatz.tsx).
 * Abhängigkeiten: partiewerkzeug.ts, useWerkzeugwahl.ts, Werkzeugleiste.tsx (Reiter),
 * Werkzeugkarte.tsx, Werkzeugzusatz.tsx, RuheKarte.tsx, i18n, lucide-react.
 */
import { Calculator, Cpu, ScanEye, TriangleAlert, type LucideIcon } from "lucide-react";
import type { Werkzeugergebnis } from "../../../analyse/werkzeug";
import { t, type Textschluessel } from "../../../i18n/sprache";
import type { Farbe, Stellung } from "../../../schach/stellung";
import { PARTIEBUENDEL, PARTIEKAPITEL } from "./partiewerkzeug";
import { RuheKarte } from "../werkzeugkarten/RuheKarte";
import type { Enginemarkierungen } from "../werkzeugkarten/useEngineMarkierungen";
import type { Werkzeugwahlstand } from "../werkzeugwahl/useWerkzeugwahl";
import { Buendelknopf, Reiterleiste, type Werkzeugwahl } from "../werkzeugwahl/Werkzeugleiste";
import { Werkzeugkarte } from "../werkzeugkarten/Werkzeugkarte";
import { buendelname } from "../werkzeugwahl/werkzeugordnung";
import { Werkzeugzusatz } from "../werkzeugkarten/Werkzeugzusatz";

const SYMBOLGROESSE = 20;

/**
 * Die Symbole in der Reihenfolge am Brett, wie an den Abbildungen ab Kapitel 7. Die Engine
 * (seit 0.2.82 als Symbol statt Knopf unter dem Brett, Wunsch des Autors) gehört zu den
 * Werkzeugen, die übrigen zu den Symbolen der Spielhilfen.
 */
const SYMBOLE: readonly {
  wahl: Werkzeugwahl;
  name: Textschluessel;
  kurz: Textschluessel;
  Bild: LucideIcon;
  engine?: true;
}[] = [
  {
    wahl: "zaehlen",
    name: "werkzeug.k1-zaehlen.name",
    kurz: "werkzeug.k1-zaehlen.kurz",
    Bild: Calculator,
  },
  {
    wahl: "engine",
    name: "werkzeug.engine.name",
    kurz: "werkzeug.engine.kurz",
    Bild: Cpu,
    engine: true,
  },
  {
    wahl: "k1-roentgen",
    name: "werkzeug.k1-roentgen.name",
    kurz: "werkzeug.k1-roentgen.kurz",
    Bild: ScanEye,
  },
  {
    wahl: "k7-warnsignale",
    name: "werkzeug.k7-warnsignale.name",
    kurz: "werkzeug.k7-warnsignale.kurz",
    Bild: TriangleAlert,
  },
];

/**
 * Die Symbole als Knöpfe für die Brettzeile (aria-pressed, Name für Bildschirmleser).
 * `mitSymbolen`: Zählen, Röntgen, Warnsignale; `mitEngine`: das Engine-Symbol.
 */
export function PartieSymbole({
  werkzeug,
  mitSymbolen,
  mitEngine,
}: {
  werkzeug: Werkzeugwahlstand;
  mitSymbolen: boolean;
  mitEngine: boolean;
}) {
  const sichtbar = SYMBOLE.filter((s) => (s.engine ? mitEngine : mitSymbolen));
  if (sichtbar.length === 0) return null;
  return (
    <>
      {sichtbar.map(({ wahl, name, kurz, Bild }) => (
        <button
          key={wahl}
          type="button"
          className="knopf-symbol brettschalter brettwerkzeug"
          aria-pressed={werkzeug.buendel === null && werkzeug.wahl === wahl}
          aria-label={t(name)}
          title={t(name)}
          onClick={() => werkzeug.tippeSymbol(wahl)}
        >
          <Bild size={SYMBOLGROESSE} aria-hidden="true" />
          <span className="brettschalter-text" aria-hidden="true">
            {t(kurz)}
          </span>
        </button>
      ))}
    </>
  );
}

/**
 * Leiste mit den Bündeln unter dem Brett und, wenn eines gewählt ist, seinen Reitern.
 * Beispiel: Tipp auf „Taktik“ → Reiter Erzwingende Züge, Ruhe, Motiv; nochmals → abgewählt.
 */
export function PartieLeiste({ werkzeug }: { werkzeug: Werkzeugwahlstand }) {
  return (
    <>
      <div
        className="werkzeugleiste"
        role="toolbar"
        aria-label={t("abbildung.werkzeuge")}
        data-tour="partie-werkzeuge"
      >
        {PARTIEBUENDEL.map((kennung) => (
          <Buendelknopf
            key={kennung}
            kennung={kennung}
            name={t(buendelname(kennung))}
            gewaehlt={werkzeug.buendel === kennung}
            beiKlick={() => werkzeug.tippeBuendel(kennung)}
          />
        ))}
      </div>
      {werkzeug.buendel && (
        <Reiterleiste
          kennung={werkzeug.buendel}
          kapitel={PARTIEKAPITEL}
          werkzeug={werkzeug}
          skelett={null}
        />
      )}
    </>
  );
}

/**
 * Karten unter der Leiste: das Ergebnis des Werkzeugs, bei „Ruhe“ die Rechnung der Engine, bei
 * „Zählen“ ohne Feld der Hinweis zum Antippen.
 */
export function PartieWerkzeugkarten({
  wahl,
  ergebnis,
  stellung,
  sicht,
  engine,
}: {
  wahl: Werkzeugwahl | null;
  ergebnis: Werkzeugergebnis | null;
  stellung: Stellung;
  sicht: Farbe;
  engine: {
    readonly gegnerplan: Enginemarkierungen;
    readonly erzwingend: Enginemarkierungen;
    readonly ruhe: Enginemarkierungen;
  };
}) {
  return (
    <>
      {wahl === "zaehlen" && !ergebnis && <p className="hinweis">{t("abbildung.tippeFeld")}</p>}
      {ergebnis && (
        <Werkzeugkarte
          key={ergebnis.werkzeug}
          ergebnis={ergebnis}
          zusatz={
            <Werkzeugzusatz
              wahl={wahl}
              stellung={stellung}
              eigen={sicht}
              beiGegnerplan={engine.gegnerplan.setzeMarkierungen}
              beiErzwingend={engine.erzwingend.setzeMarkierungen}
            />
          }
        />
      )}
      {wahl === "k7-ruhe" && stellung.regeln && (
        <RuheKarte
          key={stellung.fen}
          stellung={stellung}
          beiMarkierungen={engine.ruhe.setzeMarkierungen}
        />
      )}
    </>
  );
}
