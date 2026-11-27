/**
 * Die Leiste unten mit den fünf Bereichen Buch, Training, Spielen, Nachschlagen, Profil und dem
 * Reiter „Abenteuer“ (seit 27.11.2026).
 *
 * Rolle im Gesamtbild: Hauptnavigation der App (Konzept 10.1, Bildschirmentwurf „Leiste“). Der
 * fünfte Bereich ist das „Profil“ mit Personensymbol und Wort (Wunsch des Autors, 25.10.2026):
 * Wertung, Fortschritt und Partien; die Einstellungen liegen eine Ebene tiefer. Intern heißt der
 * Bereich „ich“ (Navigation, Speicher). Drei Sekunden Druck auf „Profil“ öffnen die
 * Aufgabenseite des Autors.
 * Der goldene Strich springt sofort auf den getippten Bereich (V6, Nutzungsprüfung 25.10.2026);
 * den neuen Bildschirm zeichnet React erst nach diesem Bild. Sonst wartete die ganze Rückmeldung
 * auf den Bildschirm, bei „Spielen“ gedrosselt (CPU 4×) etwa 0,15 s. (Als Übergang mit
 * startTransition kam der Bildschirm gemessen 60 ms später, deshalb ohne.)
 * Seit dem Wunsch des Autors vom 30.10.2026 trägt „Profil“ einen goldenen Punkt, wenn die
 * Startanimation ein neues Orden oder Abzeichen dorthin geschickt hat; er verschwindet, sobald
 * das Profil offen ist (ordenkunst/startorden.ts).
 * Reiter „Abenteuer“ (Wunsch des Autors, 27.11.2026: das Spiel in der Oberfläche der Beta, nicht
 * nur über das Adminmenü): Er ist kein eigener Bereich, sondern öffnet das Schach-Abenteuer über
 * dem gerade offenen Bildschirm, wie die Karte auf „Spielen“ (Zusatzansicht „abenteuer“, Vollbild
 * ohne Leiste). So führen „Zurück zur App“ im Spielmenü und die Zurück-Taste genau dorthin, wo der
 * Leser war. Das Spiel selbst lädt erst beim Öffnen (AbenteuerAnsicht.tsx, dynamischer Import).
 * In der Fassung für die Leser (1.0) fehlt der Reiter, bis der Autor dort über das Spiel entscheidet.
 * Sechs Reiter mit Wort passen in gleich breiten Spalten nicht (Messung 27.11.2026: „Nachschlagen“
 * 70 px in Spalten von 53 px bei 320 und 60 px bei 360 Pixeln); deshalb ist jede Spalte mindestens
 * so breit wie ihr Wort (basis.css), und unter 300 Pixeln (Browser-Zoom 200 %) stehen nur Symbole.
 * Abhängigkeiten: Navigation, i18n, leistenreiter.ts (Reiter und Symbole), useLangerDruck,
 * nachDemNaechstenBild, ordenkunst/startorden.ts, abenteuer/schnittstelle/modul.ts (nur die
 * Kennung der Ansicht).
 */
import { useEffect, useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import type { Bereich } from "../../../app/stapel";
import { t } from "../../../i18n/sprache";
import { nachDemNaechstenBild } from "../bausteine/nachDemNaechstenBild";
import { useLangerDruck } from "../bausteine/useLangerDruck";
import { loescheUngesehen, useOrdenUngesehen } from "../ordenkunst/startorden";
import { ANSICHT_ABENTEUER } from "../../../abenteuer/schnittstelle/modul";
import { ABENTEUERREITER, reiterDerLeiste } from "./leistenreiter";

/**
 * Von 0.2.116 bis 0.2.129 zeigte die Leiste nur Symbole (Wunsch des Autors, 19.10.2026). Seit DS55
 * (0.2.131, vom Autor am 25.10.2026 freigegeben) steht unter Buch, Training, Spielen und
 * Nachschlagen wieder das Wort, weil Fadenkreuz und Schwerter nicht von selbst verständlich sind.
 * Seit 0.2.134 trägt auch „Profil“ sein Wort. Der Name bleibt zusätzlich als aria-label und Tooltip.
 */
const SYMBOLGROESSE = 26;
const STRICHSTAERKE = 1.8;
/** So lange hält der Autor „Profil“, bis die Aufgabenseite aufgeht (sein Wunsch: 3 s). */
const LANGER_DRUCK_MS = 3000;

/** Der Reiter „Abenteuer“: öffnet das Spiel über dem offenen Bildschirm (Dateikopf). */
function AbenteuerKnopf() {
  const { navigiere } = useNavigation();
  const { symbol: Symbol, text, tour } = ABENTEUERREITER;
  return (
    <button
      type="button"
      className="leiste-knopf"
      data-tour={tour}
      data-testid="leiste-abenteuer"
      aria-label={t(text)}
      title={t(text)}
      onClick={() => navigiere({ bildschirm: "zusatz", kennung: ANSICHT_ABENTEUER })}
    >
      <Symbol size={SYMBOLGROESSE} strokeWidth={STRICHSTAERKE} aria-hidden="true" />
      <span aria-hidden="true">{t(text)}</span>
    </button>
  );
}

/** Die Leiste; der aktive Bereich trägt oben einen goldenen Strich. */
export function Leiste() {
  const { stapel, wechsleBereich, navigiere } = useNavigation();
  // Der getippte Bereich, bis der Bildschirm gewechselt hat; so zeigt die Leiste ihn sofort (V6).
  const [angetippt, setzeAngetippt] = useState<Bereich | null>(null);
  const gezeigt = angetippt ?? stapel.bereich;
  const ordenNeu = useOrdenUngesehen();
  useEffect(() => {
    if (ordenNeu && stapel.bereich === "ich") loescheUngesehen();
  }, [ordenNeu, stapel.bereich]);
  const wechsle = (bereich: Bereich) => {
    setzeAngetippt(bereich);
    void nachDemNaechstenBild().then(() => {
      wechsleBereich(bereich);
      setzeAngetippt(null);
    });
  };
  const druck = useLangerDruck(LANGER_DRUCK_MS, () => {
    // In der Fassung für die Leser gibt es die Aufgabenseite nicht (AP 17).
    if (__VEROEFFENTLICHUNG__) return;
    wechsleBereich("ich");
    navigiere({ bildschirm: "autoraufgaben" });
  });
  return (
    <nav className="leiste" aria-label={t("leiste.titel")}>
      {reiterDerLeiste(!__VEROEFFENTLICHUNG__).map((reiter) => {
        if (reiter === "abenteuer") return <AbenteuerKnopf key={reiter} />;
        const { bereich, symbol: Symbol, text, tour } = reiter;
        const mitDruck = bereich === "ich";
        const neuImProfil = mitDruck && ordenNeu;
        return (
          <button
            key={bereich}
            type="button"
            className={mitDruck ? "leiste-knopf leiste-knopf-halten" : "leiste-knopf"}
            aria-current={gezeigt === bereich ? "page" : undefined}
            data-tour={tour}
            aria-label={t(neuImProfil ? "leiste.profilNeu" : text)}
            title={t(neuImProfil ? "leiste.profilNeu" : text)}
            {...(mitDruck
              ? {
                  onPointerDown: druck.onPointerDown,
                  onPointerUp: druck.onPointerUp,
                  onPointerLeave: druck.onPointerLeave,
                  onPointerCancel: druck.onPointerCancel,
                  onContextMenu: druck.onContextMenu,
                }
              : {})}
            onClick={() => {
              if (mitDruck && druck.warLang()) return;
              wechsle(bereich);
            }}
          >
            <Symbol size={SYMBOLGROESSE} strokeWidth={STRICHSTAERKE} aria-hidden="true" />
            <span aria-hidden="true">{t(text)}</span>
            {neuImProfil && (
              <i className="leiste-neu" aria-hidden="true" data-testid="leiste-orden-neu" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
