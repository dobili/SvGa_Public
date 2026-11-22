/**
 * Das Spielmenü des Abenteuers (ausgelagert aus AbenteuerAnsicht.tsx, 22.11.2026): der einzige
 * Rückweg in die App, dazu Name und Figur des Helden (Held oder Heldin) und die Wahl Rivale oder
 * Rivalin (Wunsch des Autors, 22.11.2026), neu beginnen, Einstellungen und Paket löschen (Schritt 8g).
 * Abhängigkeiten: app/blattstapel.ts (Zurück-Taste schließt das Menü), i18n, Startkarte.tsx
 * (Namensfeld), Heldwahl.tsx, Menueeinstellungen.tsx.
 */
import { useState } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import { t } from "../../i18n/sprache";
import type { Heldfigur } from "../schnittstelle/spielstand";
import { Heldwahl, Rivalwahl } from "./Heldwahl";
import { Menueeinstellungen } from "./Menueeinstellungen";
import { Namensfeld } from "./Startkarte";

/** Das Spielmenü: Rückweg in die App, Name und Figur, neu beginnen, Warten, Steuerkreuz, Ton, Paket löschen. */
export function Spielmenue({
  heldname,
  figur,
  beiFigur,
  rivalin,
  beiRivalin,
  beiSchliessen,
  beiZurueck,
  beiName,
  beiNeuBeginnen,
  beiLoeschen,
}: {
  /** Aktueller Name des Helden; null ohne Spielstand. */
  heldname: string | null;
  /** Figur des Helden (Held oder Heldin); ändert sich sofort beim Tippen. */
  figur: Heldfigur;
  beiFigur: (figur: Heldfigur) => void;
  /** Rivalin Victoria statt Rivale Victor; gilt ab dem nächsten Gespräch. */
  rivalin: boolean;
  beiRivalin: (rivalin: boolean) => void;
  beiSchliessen: () => void;
  beiZurueck: () => void;
  beiName: (name: string) => void;
  beiNeuBeginnen: () => void;
  beiLoeschen: () => void;
}) {
  useZurueckSchliesst(true, beiSchliessen);
  const [name, setzeName] = useState(heldname ?? "");
  const [neuFrage, setzeNeuFrage] = useState(false);
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
          <Heldwahl figur={figur} beiWahl={beiFigur} />
          <Rivalwahl rivalin={rivalin} beiWahl={beiRivalin} />
          {neuFrage ? (
            <p className="abenteuer-neu-frage">
              {t("abenteuer.neuBeginnenFrage")}
              <button type="button" className="knopf-zweit" onClick={beiNeuBeginnen}>
                {t("abenteuer.neuBeginnenJa")}
              </button>
              <button type="button" className="knopf-zweit" onClick={() => setzeNeuFrage(false)}>
                {t("abenteuer.neuBeginnenNein")}
              </button>
            </p>
          ) : (
            <button type="button" className="knopf-zweit" onClick={() => setzeNeuFrage(true)}>
              {t("abenteuer.neuBeginnen")}
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
