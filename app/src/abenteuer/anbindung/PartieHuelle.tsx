/**
 * Partie des Schach-Abenteuers in der Spielhülle: Brett, Uhren, Kartenleiste und ein Weg zurück,
 * im Aussehen des Spiels statt im Partie-Bildschirm der App (docs/spiel/18_Spielhuelle.md).
 *
 * Rolle im Gesamtbild: Zusatzansicht „abenteuer-partie“ (Vollbild); der Wert ist die Id der Partie
 * in der App. Die Logik bleibt die der App: `usePartie` spielt die Züge des Gegners, führt die
 * Uhr und speichert jeden Zug; die beendete Partie steht wie jede andere in der Partienliste und
 * wird dort beim Öffnen ausgewertet. Hier fehlen mit Absicht Kopfzeile, Zugliste, Werkzeuge,
 * Auswertung, „Neue Partie“ und „Teilen“ (Wunsch des Autors, 10.11.2026). Nach dem Ende führt
 * „Weiter“ in die Oberwelt; dort liest das Spiel das Ergebnis und zeigt seine Ergebniskarte.
 * Abhängigkeiten: ui/komponenten/partie/usePartie.ts (Logik), Brettbereich, useLeserzug,
 * Ergebnisblende, partieerweiterungen.ts (Kartenleiste), spiel/uhr.ts, anbindung/Huelle.tsx.
 * Eine beendete Partie lässt sich Zug für Zug nachspielen (◀ ▶ unter dem Brett); so öffnet auch
 * „Meine Partien“ im Tagebuch eine alte Partie (docs/spiel/18, Abschnitt 8).
 * Sonderfälle: Partie ohne Uhr zeigt keine Uhren; Blindschach blendet die Figuren aus; eine
 * unbekannte Id zeigt einen Hinweis und den Weg zurück. Partiemomente der Begegnung (T5) zeigt
 * anbindung/Momentzeile.tsx über dem Brett.
 */
import { useMemo, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { useNavigation } from "../../app/navigationsKontext";
import { stellungAusFen, type Farbe } from "../../schach/stellung";
import { zugFelder } from "../../schach/weiterspielen";
import { leserAmZug, stellungen, type Partie } from "../../spiel/partie";
import { restzeit, zeitAlsText, type Uhrstand } from "../../spiel/uhr";
import { Brettbereich } from "../../ui/komponenten/brettbedienung/Brettbereich";
import { Ergebnisblende } from "../../ui/komponenten/partie/Ergebnisblende";
import { passendeErweiterungen } from "../../ui/komponenten/partie/partieerweiterungen";
import { useLeserzug } from "../../ui/komponenten/partie/useLeserzug";
import { usePartie, type Partiesteuerung } from "../../ui/komponenten/partie/usePartie";
import { ANSICHT_ABENTEUER } from "../schnittstelle/modul";
import { tSpiel } from "../texte/texte";
import { Huelle } from "./Huelle";
import { gegnerName, sprecherAusPfad, statustext } from "./huellentexte";
import { Momentzeile } from "./Momentzeile";
import { Schutzengelzeile } from "./Schutzengelzeile";
import { useSchutzengel } from "./useSchutzengel";
import { Testleiste } from "./Testleiste";

/** Unter so viel Restzeit (ms) wird die Uhr rot, wie in der App. */
const KNAPP_MS = 10_000;

/** Die andere Farbe. */
function gegenfarbe(farbe: Farbe): Farbe {
  return farbe === "white" ? "black" : "white";
}

/** Uhr einer Seite: Name und Restzeit; die laufende Uhr hervorgehoben, knappe Zeit rot. */
function Uhr({
  uhr,
  farbe,
  name,
  jetztMs,
}: {
  uhr: Uhrstand;
  farbe: Farbe;
  name: string;
  jetztMs: number;
}) {
  const rest = restzeit(uhr, farbe, jetztMs);
  return (
    <div
      className="abenteuer-huelle-uhr"
      data-laeuft={uhr.laeuft === farbe}
      data-knapp={rest < KNAPP_MS}
      data-testid={`uhr-${farbe}`}
    >
      <span>{name}</span>
      <span className="abenteuer-huelle-zeit" role="timer">
        {zeitAlsText(rest)}
      </span>
    </div>
  );
}

/** Fuß während der Partie: Status und „Aufgeben“ mit einer Nachfrage. */
function Spielfuss({ s, gegner }: { s: Partiesteuerung; gegner: string }) {
  const [frage, setzeFrage] = useState(false);
  if (frage) {
    return (
      <section className="abenteuer-huelle-fuss">
        <p>{tSpiel("huelle.aufgebenFrage")}</p>
        <div className="knopfreihe">
          <button type="button" className="knopf-gefahr" onClick={s.gibAuf}>
            {tSpiel("huelle.aufgebenJa")}
          </button>
          <button type="button" className="knopf-zweit" onClick={() => setzeFrage(false)}>
            {tSpiel("huelle.aufgebenNein")}
          </button>
        </div>
      </section>
    );
  }
  return (
    <section className="abenteuer-huelle-fuss">
      <p role="status" data-testid="partiestatus">
        {statustext(s, gegner)}
      </p>
      <button
        type="button"
        className="knopf-zweit knopf-aufgeben"
        data-testid="abenteuer-partie-aufgeben"
        onClick={() => setzeFrage(true)}
      >
        {tSpiel("huelle.aufgeben")}
      </button>
    </section>
  );
}

/** Der eine Weg zurück: in die Oberwelt, die das Ergebnis liest und ihre Karte zeigt. */
function Weiterknopf() {
  const { navigiere } = useNavigation();
  return (
    <button
      type="button"
      className="knopf-haupt"
      data-testid="partie-zurueck-zur-stadt"
      onClick={() => navigiere({ bildschirm: "zusatz", kennung: ANSICHT_ABENTEUER })}
    >
      {tSpiel("huelle.weiter")}
    </button>
  );
}

/** Blätterknöpfe der beendeten Partie: ein Halbzug zurück oder vor, dazwischen der Stand. */
function Blaettern({
  stelle,
  anzahl,
  setze,
}: {
  stelle: number;
  anzahl: number;
  setze: (stelle: number) => void;
}) {
  return (
    <div className="abenteuer-huelle-blaettern" data-testid="abenteuer-partie-blaettern">
      <button
        type="button"
        className="chip"
        disabled={stelle === 0}
        aria-label={tSpiel("huelle.zugZurueck")}
        data-testid="abenteuer-partie-zurueck"
        onClick={() => setze(stelle - 1)}
      >
        ◀
      </button>
      <span role="status">{tSpiel("huelle.nachspielStand", { zug: stelle, anzahl })}</span>
      <button
        type="button"
        className="chip"
        disabled={stelle >= anzahl}
        aria-label={tSpiel("huelle.zugVor")}
        data-testid="abenteuer-partie-vor"
        onClick={() => setze(stelle + 1)}
      >
        ▶
      </button>
    </div>
  );
}

/** Brett, Uhren, Kartenleiste und Fuß einer geladenen Partie. */
function Spielfeld({ s, partie }: { s: Partiesteuerung; partie: Partie }) {
  // Markierungen der Karten (Fingerzeig, Gefahrenradar) gelten nur für die Stellung, in der sie kamen.
  const [hinweis, setzeHinweis] = useState<{ fen: string; marken: readonly Markierung[] }>({
    fen: "",
    marken: [],
  });
  const eigene = partie.einstellung.eigeneFarbe;
  const gegner = gegnerName(partie);
  // Schutzengel (K4): Solange er wacht, prüft die Engine jeden Zug, bevor er gespielt wird.
  const engel = useSchutzengel(s, partie);
  const bedienung = useLeserzug(engel.steuerung, s.fen, false);
  // Nachspielen der beendeten Partie: Zahl der gezeigten Halbzüge; null = Schlussstellung.
  const [stelle, setzeStelle] = useState<number | null>(null);
  const anzahl = partie.zuege.length;
  const gezeigt = partie.ende ? (stelle ?? anzahl) : anzahl;
  const fen = gezeigt === anzahl ? s.fen : (stellungen(partie)[gezeigt] ?? s.fen);
  const stellung = useMemo(() => stellungAusFen(fen), [fen]);
  const letzter = useMemo(() => {
    if (gezeigt === 0) return null;
    return zugFelder(stellungen(partie)[gezeigt - 1] ?? "", partie.zuege[gezeigt - 1]?.san ?? "");
  }, [partie, gezeigt]);
  if (!stellung.ok) return <p className="fehlertext">{stellung.fehler}</p>;
  const amZug = leserAmZug(partie) && !partie.ende;
  return (
    <>
      {/* Partiemomente der Begegnung (T5): Sprechzeile über dem Brett, blockiert nichts. */}
      <Momentzeile s={s} partie={partie} />
      {engel.halt && !partie.ende && (
        <Schutzengelzeile grund={engel.halt} beiEnde={engel.schliesse} />
      )}
      {partie.uhr && (
        <Uhr uhr={partie.uhr} farbe={gegenfarbe(eigene)} name={gegner} jetztMs={s.jetztMs} />
      )}
      <Brettbereich
        stellung={stellung.wert}
        markierungen={hinweis.fen === s.fen ? hinweis.marken : []}
        letzterZug={letzter}
        bedienung={
          amZug ? bedienung : { ...bedienung, ziele: [], beiFeld: () => undefined, ziehen: null }
        }
        beschriftung={tSpiel("huelle.brett", { gegner })}
        anfangsGedreht={eigene === "black"}
        ueberlagerung={gezeigt === anzahl ? <Ergebnisblende partie={partie} /> : undefined}
      />
      {partie.uhr && (
        <Uhr uhr={partie.uhr} farbe={eigene} name={tSpiel("huelle.du")} jetztMs={s.jetztMs} />
      )}
      {/* Kartenleiste des Spiels (Erweiterungspunkt A4), solange die Partie läuft. */}
      {!partie.ende &&
        passendeErweiterungen(partie.einstellung).map((e) => (
          <e.Leiste
            key={e.kennung}
            partiekennung={partie.einstellung.abenteuer?.kennung ?? ""}
            steuerung={s}
            beiMarkierungen={(marken) => setzeHinweis({ fen: s.fen, marken })}
          />
        ))}
      {partie.ende && anzahl > 0 && (
        <Blaettern stelle={gezeigt} anzahl={anzahl} setze={setzeStelle} />
      )}
      {partie.ende ? <Weiterknopf /> : <Spielfuss s={s} gegner={gegner} />}
      {!partie.ende && <Testleiste id={partie.id} />}
    </>
  );
}

/** Die Zusatzansicht; `wert` ist die Id der Partie in der App. */
export function PartieHuelle({ wert }: { readonly wert: string | null }) {
  const s = usePartie(wert ?? "");
  const partie = s.partie;
  const blind = partie?.einstellung.abenteuer?.variante === "blind";
  return (
    <Huelle
      figur={gegnerName(partie)}
      sprecher={sprecherAusPfad(partie?.einstellung.abenteuer?.portraet)}
      testid="partie"
      klasse={`abenteuer-huelle-partie ${blind ? "abenteuer-huelle-blind" : ""}`}
    >
      {!s.geladen && <p className="lade">{tSpiel("huelle.laedt")}</p>}
      {s.geladen && !partie && (
        <>
          <p className="fehlertext">{tSpiel("huelle.partieFehlt")}</p>
          <Weiterknopf />
        </>
      )}
      {partie && <Spielfeld s={s} partie={partie} />}
    </Huelle>
  );
}
