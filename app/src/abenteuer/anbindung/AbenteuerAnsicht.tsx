/**
 * Die Hülle des Abenteuers in der App: Zusatzansicht „abenteuer“ (app/zusatzansichten.ts), im
 * Vollbild ohne Kopfzeile und Leiste der App (Entscheidung D1 des Autors, 07.11.2026).
 *
 * Rolle im Gesamtbild: Dieser kleine Teil gehört zum Kern der App. Er zeigt die Startkarte
 * (Paket laden, Spielstand anlegen), lädt das eigentliche Spiel erst dann als eigenen Baustein
 * (dynamischer Import von modul/abenteuer.tsx → assets/abenteuer-*.js, nicht vorab geladen) und
 * übergibt ihm die Dienste der App (anbindung/dienste.ts). Das Spielmenü (Knopf oben rechts) ist
 * der einzige Rückweg in die App: „Zurück zur App“, dazu Paket löschen.
 * Abhängigkeiten: anbindung/dienste.ts, regeln/spielstand.ts, schnittstelle/modul.ts, i18n,
 * paket/paketlader.ts (Löschen), app/blattstapel.ts (Zurück-Taste schließt das Menü).
 */
import { useEffect, useState, type ComponentType } from "react";
import { useZurueckSchliesst } from "../../app/blattstapel";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { speicherzustand } from "../../speicher/speicher";
import { ANFANGSPARTIEN } from "../../spiel/wertung";
import "../abenteuer.css";
import { loeschePaket } from "../paket/paketlader";
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
      <h1 className="abenteuer-start-titel">{t("abenteuer.titel")}</h1>
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

/** Das Spielmenü: der Rückweg in die App und das Löschen des Pakets. */
function Spielmenue({
  beiSchliessen,
  beiZurueck,
  beiLoeschen,
}: {
  beiSchliessen: () => void;
  beiZurueck: () => void;
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
      <button type="button" className="knopf-zweit" onClick={beiLoeschen}>
        {t("abenteuer.paketLoeschen")}
      </button>
      <button type="button" className="knopf-zweit" onClick={beiSchliessen}>
        {t("abenteuer.menueSchliessen")}
      </button>
    </section>
  );
}

/** Die Zusatzansicht: Startkarte oder, wenn Paket und Spielstand da sind, die Oberwelt. */
export function AbenteuerAnsicht({ wert }: { readonly wert: string | null }) {
  const dienste = useAppdienste();
  const { zurueck } = useNavigation();
  const stand = useAbenteuerstand();
  const [zustand, setzeZustand] = useState<Paketzustand>({ art: "fehlt" });
  const [Oberwelt, setzeOberwelt] = useState<ComponentType<{
    readonly wert: string | null;
  }> | null>(null);
  const [offen, setzeOffen] = useState(false);
  const [menue, setzeMenue] = useState(false);

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

  const loesche = () => {
    void loeschePaket().then(() => {
      setzeMenue(false);
      setzeOffen(false);
      setzeZustand({ art: "fehlt" });
    });
  };

  return (
    <div className="bildschirm bildschirm-abenteuer" data-testid="abenteuer">
      <button
        type="button"
        className="abenteuer-menueknopf"
        aria-label={t("abenteuer.menue")}
        data-testid="abenteuer-menueknopf"
        onClick={() => setzeMenue(true)}
      >
        ☰
      </button>
      {offen && Oberwelt && stand ? (
        <Oberwelt wert={wert} />
      ) : (
        <Startkarte zustand={zustand} beiLaden={lade} beiStart={starte} />
      )}
      {menue && (
        <Spielmenue
          beiSchliessen={() => setzeMenue(false)}
          beiZurueck={zurueck}
          beiLoeschen={loesche}
        />
      )}
    </div>
  );
}
