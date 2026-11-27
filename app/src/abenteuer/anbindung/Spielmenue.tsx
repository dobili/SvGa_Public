/**
 * Das Spielmenü des Abenteuers (ausgelagert aus AbenteuerAnsicht.tsx, 22.11.2026): der einzige
 * Rückweg in die App, dazu der Name des Helden, der Weg ins Hauptmenü, Einstellungen und Paket
 * löschen (Schritt 8g). Held oder Heldin und Rivale oder Rivalin stehen hier nur noch zur Ansicht:
 * Beides wählt der Leser beim Start und behält es für das ganze Spiel (Wunsch des Autors,
 * 24.11.2026); neu wählen geht über ein neues Spiel im Hauptmenü. „Von vorn beginnen“ (löschte den
 * einen Spielstand) ist seit den Speicherplätzen (27.11.2026) der Punkt „Hauptmenü“: Dort beginnt
 * ein neues Spiel auf einem neuen Platz, und Löschen geht in der Ladeliste.
 * Abhängigkeiten: app/blattstapel.ts (Zurück-Taste schließt das Menü), i18n, Startkarte.tsx
 * (Namensfeld), Menueeinstellungen.tsx.
 */
import { useState } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import { t } from "../../i18n/sprache";
import type { Heldfigur } from "../schnittstelle/spielstand";
import { Menueeinstellungen } from "./Menueeinstellungen";
import { Namensfeld } from "./Startkarte";

/**
 * Die Wahl beim Start als Satz: „Beim Start gewählt: Heldin und Rivalin Victoria. …“. Ältere
 * Stände ohne Wahl zeigen Held und Rivale Victor (heldfigurAus, rivalinGewaehlt).
 */
function wahlsatz(figur: Heldfigur, rivalin: boolean): string {
  return t("abenteuer.wahlAnzeige", {
    figur: t(figur === "heldin-0" ? "abenteuer.figur.heldin-0" : "abenteuer.figur.held-0"),
    rivale: t(rivalin ? "abenteuer.rivale.victoria" : "abenteuer.rivale.victor"),
  });
}

/** Das Spielmenü: Rückweg in die App, Name, Wahl beim Start (nur Ansicht), Hauptmenü, Warten, Steuerkreuz, Ton, Paket löschen. */
export function Spielmenue({
  heldname,
  figur,
  rivalin,
  beiSchliessen,
  beiZurueck,
  beiName,
  beiHauptmenue,
  beiLoeschen,
}: {
  /** Aktueller Name des Helden; null ohne Spielstand. */
  heldname: string | null;
  /** Figur des Helden (Held oder Heldin), beim Start gewählt; hier nur angezeigt. */
  figur: Heldfigur;
  /** Rivalin Victoria statt Rivale Victor, beim Start gewählt; hier nur angezeigt. */
  rivalin: boolean;
  beiSchliessen: () => void;
  beiZurueck: () => void;
  beiName: (name: string) => void;
  /** Zurück ins Hauptmenü (nur in der Welt); der Stand ist schon gespeichert. */
  beiHauptmenue?: () => void;
  beiLoeschen: () => void;
}) {
  useZurueckSchliesst(true, beiSchliessen);
  const [name, setzeName] = useState(heldname ?? "");
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
      {heldname !== null && (
        <>
          <Namensfeld name={name} beiAenderung={setzeName} />
          {name.trim() !== heldname && (
            <button
              type="button"
              className="knopf-zweit"
              data-testid="abenteuer-name-speichern"
              onClick={() => beiName(name)}
            >
              {t("abenteuer.nameSpeichern")}
            </button>
          )}
          <p data-testid="abenteuer-wahlanzeige">{wahlsatz(figur, rivalin)}</p>
          {beiHauptmenue && (
            <button
              type="button"
              className="knopf-zweit"
              data-testid="abenteuer-zum-hauptmenue"
              onClick={beiHauptmenue}
            >
              {t("abenteuer.hauptmenue")}
            </button>
          )}
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
