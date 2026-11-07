/**
 * Die Hülle des Abenteuers in der App: Zusatzansicht „abenteuer“ (app/zusatzansichten.ts).
 *
 * Rolle im Gesamtbild: Dieser kleine Teil gehört zum Kern der App. Er zeigt die Startkarte
 * (Paket laden, Spielstand anlegen), lädt das eigentliche Spiel erst dann als eigenen Baustein
 * (dynamischer Import von modul/abenteuer.tsx → assets/abenteuer-*.js, nicht vorab geladen) und
 * übergibt ihm die Dienste der App (anbindung/dienste.ts). Im Prototyp (Schritt 5) gibt es noch
 * keine Einstellungsseite; Laden und Löschen des Pakets stehen hier.
 * Abhängigkeiten: anbindung/dienste.ts, regeln/spielstand.ts, schnittstelle/modul.ts, i18n,
 * Kopfzeile der App.
 */
import { useEffect, useState, type ComponentType } from "react";
import { t } from "../../i18n/sprache";
import { speicherzustand } from "../../speicher/speicher";
import { ANFANGSPARTIEN } from "../../spiel/wertung";
import { Kopfzeile } from "../../ui/komponenten/rahmen/Kopfzeile";
import "../abenteuer.css";
import { leererAbenteuerstand } from "../regeln/spielstand";
import type { Abenteuermodul } from "../schnittstelle/modul";
import type { Paketzustand } from "../schnittstelle/paket";
import { aktualisierePaketzustand, useAbenteuerstand, useAppdienste } from "./dienste";

/** Der geladene Baustein, einmal je Seite. */
let modulVorrat: Promise<Abenteuermodul> | null = null;

function ladeModul(): Promise<Abenteuermodul> {
  modulVorrat ??= import("../modul/abenteuer").then((m) => m.modul);
  return modulVorrat;
}

const BYTES_JE_MB = 1024 * 1024;

/** Größe für die Anzeige: ganze Megabyte, unter einem Megabyte „unter 1“. */
function mbText(bytes: number): string {
  const mb = bytes / BYTES_JE_MB;
  return mb < 1 ? t("abenteuer.unterEinemMb") : mb.toFixed(0);
}

/** Startkarte: Paket laden oder Spiel beginnen. */
function Startkarte({
  zustand,
  beiLaden,
  beiStart,
}: {
  zustand: Paketzustand;
  beiLaden: () => void;
  beiStart: () => void;
}) {
  const laedt = zustand.art === "laedt";
  return (
    <section className="karte abenteuer-start" data-testid="abenteuer-start">
      <p>{t("abenteuer.einleitung")}</p>
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
      {zustand.art === "vorhanden" || zustand.art === "veraltet" ? (
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
    </section>
  );
}

/** Die Zusatzansicht: Startkarte oder, wenn Paket und Spielstand da sind, die Oberwelt. */
export function AbenteuerAnsicht({ wert }: { readonly wert: string | null }) {
  const dienste = useAppdienste();
  const stand = useAbenteuerstand();
  const [zustand, setzeZustand] = useState<Paketzustand>({ art: "fehlt" });
  const [Oberwelt, setzeOberwelt] = useState<ComponentType<{
    readonly wert: string | null;
  }> | null>(null);
  const [offen, setzeOffen] = useState(false);

  useEffect(() => {
    let aktiv = true;
    void aktualisierePaketzustand().then((z) => {
      if (aktiv) setzeZustand(z);
    });
    return () => {
      aktiv = false;
    };
  }, []);

  const lade = () => {
    setzeZustand({ art: "laedt", geladen: 0, gesamt: 1 });
    dienste
      .ladePaket((geladen, gesamt) => setzeZustand({ art: "laedt", geladen, gesamt }))
      .then(() => aktualisierePaketzustand().then(setzeZustand))
      .catch(() => {
        const online = typeof navigator === "undefined" || navigator.onLine;
        setzeZustand({ art: "fehler", grund: online ? "unbekannt" : "ohneNetz" });
      });
  };

  const starte = () => {
    if (!stand) {
      // Erster Start: Spielstand anlegen; die Eingangswertung ist fest, wenn die App genug
      // gewertete Partien hat (Architektur, Abschnitt 4), sonst läuft sie noch mit.
      const spiel = speicherzustand().daten.spiel;
      const fest = spiel.wertung.length >= ANFANGSPARTIEN;
      void dienste.schreibeStand(
        leererAbenteuerstand(new Date(), t("abenteuer.heldname"), dienste.wertung(), fest),
      );
    }
    void ladeModul().then((modul) => {
      modul.verbinde(dienste);
      setzeOberwelt(() => modul.Oberwelt);
      setzeOffen(true);
    });
  };

  return (
    <div className="bildschirm bildschirm-abenteuer" data-testid="abenteuer">
      <Kopfzeile titel={t("abenteuer.titel")} zurueckText={t("abenteuer.zurueck")} />
      {offen && Oberwelt && stand ? (
        <Oberwelt wert={wert} />
      ) : (
        <Startkarte zustand={zustand} beiLaden={lade} beiStart={starte} />
      )}
    </div>
  );
}
