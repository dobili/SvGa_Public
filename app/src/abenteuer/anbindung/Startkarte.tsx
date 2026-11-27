/**
 * Startkarte des Abenteuers und Namensfeld (ausgelagert aus AbenteuerAnsicht.tsx, 22.11.2026).
 *
 * Die Startkarte lädt das Paket oder beginnt ein neues Spiel (aus dem Hauptmenü „Neues Spiel“,
 * Hauptmenue.tsx, oder beim allerersten Start ohne Spielstand); vor dem Start wählt der Leser
 * seinen Namen (Dokument 02: Name wählbar, Dialoge geschlechtsneutral), die Figur (Held oder
 * Heldin) und den Rivalen (Victor oder Victoria; Wunsch des Autors, 22.11.2026; Heldwahl.tsx). Figur und Rivale gelten für das ganze Spiel (Wunsch des Autors,
 * 24.11.2026: nicht mehr im Spielmenü änderbar). Das Namensfeld nutzt auch das Spielmenü.
 * Abhängigkeiten: i18n, groesse.ts, Heldwahl.tsx, schnittstelle/paket.ts.
 */
import { t } from "../../i18n/sprache";
import type { Paketzustand } from "../schnittstelle/paket";
import type { Heldfigur } from "../schnittstelle/spielstand";
import { groessentext, mbText } from "./groesse";
import { Heldwahl, Rivalwahl } from "./Heldwahl";

/** Längster Name des Helden (passt in die Dialogzeile). */
export const NAME_HOECHSTENS = 16;

/** Eingabe des Heldennamens; leer heißt „Du“ (Textschlüssel abenteuer.heldname). */
export function Namensfeld({
  name,
  beiAenderung,
}: {
  name: string;
  beiAenderung: (name: string) => void;
}) {
  return (
    <label className="abenteuer-namensfeld">
      {t("abenteuer.nameFrage")}
      <input
        type="text"
        value={name}
        maxLength={NAME_HOECHSTENS}
        autoComplete="off"
        placeholder={t("abenteuer.heldname")}
        data-testid="abenteuer-name"
        onChange={(e) => beiAenderung(e.target.value)}
      />
    </label>
  );
}

/** Startkarte: Paket laden oder Spiel beginnen; vor dem ersten Start Name und Figur wählen. */
export function Startkarte({
  zustand,
  geprueft,
  name,
  beiName,
  figur,
  beiFigur,
  rivalin,
  beiRivalin,
  beiLaden,
  beiStart,
  beiZurueck,
}: {
  zustand: Paketzustand;
  /**
   * Ob der Paketzustand schon abgefragt ist. Vorher kein Knopf: Bis die Antwort kam, stand dort
   * „Spiel herunterladen“, auch wenn das Paket längst da war, und ein schneller Tipp lud es neu
   * (Affentest 14.11.2026).
   */
  geprueft: boolean;
  /** Null, wenn es schon einen Spielstand gibt (dann keine Namenswahl). */
  name: string | null;
  beiName: (name: string) => void;
  /** Gewählte Figur (Held oder Heldin), nur vor dem ersten Start. */
  figur: Heldfigur;
  beiFigur: (figur: Heldfigur) => void;
  /** Rivalin Victoria statt Rivale Victor (nach der Heldenwahl). */
  rivalin: boolean;
  beiRivalin: (rivalin: boolean) => void;
  beiLaden: () => void;
  beiStart: () => void;
  /** Zurück ins Hauptmenü (Neues Spiel, wenn es schon Spielstände gibt); fehlt sonst. */
  beiZurueck?: () => void;
}) {
  const laedt = zustand.art === "laedt";
  return (
    <section className="karte abenteuer-start" data-testid="abenteuer-start">
      <h1 className="abenteuer-start-titel">{t("abenteuer.titel")}</h1>
      <p>{t("abenteuer.einleitung")}</p>
      {/* Kurze Sätze und die Größe vor dem Laden (Spieltest „einstieg“, R9). */}
      {zustand.art === "fehlt" && (
        <p>
          {groessentext(zustand)} {t("abenteuer.speichertSelbst")}
        </p>
      )}
      {zustand.art === "fehler" && (
        <p className="fehlertext">
          {zustand.grund === "ohneNetz" ? t("abenteuer.ohneNetz") : t("abenteuer.fehler")}
        </p>
      )}
      {laedt && (
        <div className="abenteuer-fortschritt" aria-hidden="true">
          <div style={{ width: `${(100 * zustand.geladen) / Math.max(1, zustand.gesamt)}%` }} />
        </div>
      )}
      {(zustand.art === "vorhanden" || zustand.art === "veraltet") && name !== null && (
        <>
          <Namensfeld name={name} beiAenderung={beiName} />
          <Heldwahl figur={figur} beiWahl={beiFigur} />
          <Rivalwahl rivalin={rivalin} beiWahl={beiRivalin} />
          <p data-testid="abenteuer-wahlfest">{t("abenteuer.wahlFest")}</p>
        </>
      )}
      {!geprueft ? (
        <p className="lade">{t("abenteuer.pruefe")}</p>
      ) : zustand.art === "vorhanden" || zustand.art === "veraltet" ? (
        <button
          type="button"
          className="knopf-haupt"
          data-testid="abenteuer-spielen"
          onClick={beiStart}
        >
          {t("abenteuer.spielen")}
        </button>
      ) : (
        <button
          type="button"
          className="knopf-haupt"
          data-testid="abenteuer-laden"
          onClick={beiLaden}
          disabled={laedt}
        >
          {laedt ? t("abenteuer.laedt", { mb: mbText(zustand.gesamt) }) : t("abenteuer.laden")}
        </button>
      )}
      {beiZurueck && (
        <button
          type="button"
          className="knopf-zweit"
          data-testid="abenteuer-neu-zurueck"
          onClick={beiZurueck}
        >
          {t("abenteuer.neu.zurueck")}
        </button>
      )}
    </section>
  );
}
