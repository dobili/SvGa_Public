/**
 * Das Spielmenü des Abenteuers (ausgelagert aus AbenteuerAnsicht.tsx, 22.11.2026): der einzige
 * Rückweg in die App, dazu Speichern und Laden, der Weg ins Hauptmenü, Einstellungen und Paket
 * löschen (Schritt 8g). Name und Figur (Held oder Heldin) stehen hier nur zur Ansicht: Beides wählt
 * der Leser beim Start und behält es für das ganze Spiel (Wunsch des Autors, 24.11.2026, für den
 * Namen 28.11.2026); neu wählen geht über ein neues Spiel im Hauptmenü. Der Rivale (Victor oder
 * Victoria) wird beim Start ausgelost und hier nicht verraten (rivalzufall.ts, 28.11.2026).
 * „Speichern“ legt eine Sicherung an, „Laden“ öffnet die Ladeliste (Sicherungsknopf.tsx).
 * „Von vorn beginnen“ (löschte den einen Spielstand) ist seit den Speicherplätzen (27.11.2026) der
 * Punkt „Hauptmenü“: Dort beginnt ein neues Spiel auf einem neuen Platz, und Löschen geht in der
 * Ladeliste.
 * Abhängigkeiten: app/blattstapel.ts (Zurück-Taste schließt das Menü), i18n,
 * Menueeinstellungen.tsx, Sicherungsknopf.tsx.
 */
import { useZurueckSchliesst } from "../../app/blattstapel";
import { t } from "../../i18n/sprache";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { Menueeinstellungen } from "./Menueeinstellungen";
import { Sicherungsknopf } from "./Sicherungsknopf";
import type { Sicherungsergebnis } from "./useSpeicherplaetze";

/**
 * Name und Figur als Satz: „Du spielst als Kim (Heldin). …“. Ältere Stände ohne Wahl zeigen den
 * Held (heldfigurAus).
 */
function wahlsatz(stand: Abenteuerstand): string {
  const figur =
    stand.held.figur === "heldin-0" ? "abenteuer.figur.heldin-0" : "abenteuer.figur.held-0";
  return t("abenteuer.wahlAnzeige", { name: stand.held.name, figur: t(figur) });
}

/** Das Spielmenü: Rückweg in die App, Name und Figur (nur Ansicht), Speichern, Laden, Hauptmenü, Warten, Steuerkreuz, Ton, Paket löschen. */
export function Spielmenue({
  stand,
  beiSchliessen,
  beiZurueck,
  beiSpeichern,
  beiLaden,
  beiHauptmenue,
  beiLoeschen,
}: {
  /** Der gespielte Stand in der Welt; null außerhalb (dann ohne Name, Speichern und Hauptmenü). */
  stand: Abenteuerstand | null;
  beiSchliessen: () => void;
  beiZurueck: () => void;
  /** Sichert den Stand von jetzt (Sicherung des Lesers). */
  beiSpeichern: (stand: Abenteuerstand) => Promise<Sicherungsergebnis>;
  /** Öffnet die Ladeliste (verlässt die Welt; der Stand ist schon gespeichert). */
  beiLaden: () => void;
  /** Zurück ins Hauptmenü (nur in der Welt); der Stand ist schon gespeichert. */
  beiHauptmenue: () => void;
  beiLoeschen: () => void;
}) {
  useZurueckSchliesst(true, beiSchliessen);
  return (
    <section
      className="abenteuer-menue"
      role="dialog"
      aria-label={t("abenteuer.menue")}
      data-testid="abenteuer-menue"
    >
      <h2>{t("abenteuer.menue")}</h2>
      <p>{t("abenteuer.menueSpeichern")}</p>
      <button type="button" className="knopf-haupt" onClick={beiZurueck}>
        {t("abenteuer.zurueckZurApp")}
      </button>
      {stand !== null && (
        <>
          <p data-testid="abenteuer-wahlanzeige">{wahlsatz(stand)}</p>
          <Sicherungsknopf stand={stand} beiSpeichern={beiSpeichern} beiLaden={beiLaden} />
          <button
            type="button"
            className="knopf-zweit"
            data-testid="abenteuer-zum-hauptmenue"
            onClick={beiHauptmenue}
          >
            {t("abenteuer.hauptmenue")}
          </button>
        </>
      )}
      <Menueeinstellungen beiSchliessen={beiSchliessen} />
      <button type="button" className="knopf-zweit" onClick={beiLoeschen}>
        {t("abenteuer.paketLoeschen")}
      </button>
      <button type="button" className="knopf-zweit" onClick={beiSchliessen}>
        {t("abenteuer.menueSchliessen")}
      </button>
    </section>
  );
}
