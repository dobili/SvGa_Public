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
 * unbekannte Id zeigt einen Hinweis und den Weg zurück. Partiemomente der Begegnung (T5,
 * anbindung/Momentzeile.tsx), Schutzengel, Karten und das Tischgespräch (Tischgespraech.tsx)
 * sprechen in die Sprechblasen über und unter dem Brett (Tischblase.tsx, docs/spiel/29).
 * Bedienung mit dem Daumen (docs/spiel/30): Brett und rechte Spalte sind eigene Blöcke; hoch
 * stehen sie untereinander (kein Knopf über dem Brett), quer nebeneinander, das Brett links in
 * voller Höhe (huellenlage.css). Drehen baut nur die Ansicht neu, der Zustand bleibt.
 */
import { useMemo, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { stellungAusFen, type Farbe } from "../../schach/stellung";
import { zugFelder } from "../../schach/weiterspielen";
import { leserAmZug, stellungen, type Partie } from "../../spiel/partie";
import { restzeit, zeitAlsText, type Uhrstand } from "../../spiel/uhr";
import { Brettbereich } from "../../ui/komponenten/brettbedienung/Brettbereich";
import { Ergebnisblende } from "../../ui/komponenten/partie/Ergebnisblende";
import { passendeErweiterungen } from "../../ui/komponenten/partie/partieerweiterungen";
import { useLeserzug } from "../../ui/komponenten/partie/useLeserzug";
import { usePartie, type Partiesteuerung } from "../../ui/komponenten/partie/usePartie";
import { partieBrettquelle, useAbenteuerBrettstil } from "../brett/useAbenteuerBrettstil";
import { useZurWelt } from "./zurWelt";
import { tSpiel } from "../texte/texte";
import { Gegnerbild } from "./Gegnerbild";
import { Huelle } from "./Huelle";
import { Erzaehlvorhang, Kurzformzeile, Nachwort } from "./Kurzformzeile";
import { endgrund, gegnerName, sprecherAusPfad, statustext } from "./huellentexte";
import { Momentzeile } from "./Momentzeile";
import { Schutzengelzeile } from "./Schutzengelzeile";
import { Tischblase, TischblasenRahmen } from "./Tischblase";
import { Tischgespraech } from "./Tischgespraech";
import { useBegegnung } from "./useBegegnung";
import { useSchutzengel } from "./useSchutzengel";
import { useStaerkewechsel } from "./useStaerkewechsel";
import { useKurzform } from "./useKurzform";
import { useZugerraten } from "./useZugerraten";
import { Testleiste } from "./Testleiste";

/** Unter so viel Restzeit (ms) wird die Uhr rot, wie in der App. */
const KNAPP_MS = 10_000;

/** Die andere Farbe. */
function gegenfarbe(farbe: Farbe): Farbe {
  return farbe === "white" ? "black" : "white";
}

/**
 * Uhr einer Seite: Name und Restzeit; die laufende Uhr hervorgehoben, knappe Zeit rot. Die Uhr
 * des Gegners trägt eine eigene Klasse: hoch steht sie über dem Brett (huellenlage.css).
 */
function Uhr({
  uhr,
  farbe,
  name,
  jetztMs,
  gegnerseite = false,
}: {
  uhr: Uhrstand;
  farbe: Farbe;
  name: string;
  jetztMs: number;
  gegnerseite?: boolean;
}) {
  const rest = restzeit(uhr, farbe, jetztMs);
  return (
    <div
      className={`abenteuer-huelle-uhr ${gegnerseite ? "abenteuer-huelle-uhr-gegner" : ""}`}
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

/**
 * Fuß während der Partie: Status und „Aufgeben“ mit einer Nachfrage. Während der Wertung einer
 * kurzen Partieform (`wertet`) schweigt der Status: „Du bist am Zug.“ stimmte dann nicht.
 */
function Spielfuss({ s, gegner, wertet }: { s: Partiesteuerung; gegner: string; wertet: boolean }) {
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
      {!wertet && (
        <p role="status" data-testid="partiestatus">
          {statustext(s, gegner)}
        </p>
      )}
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
  const zurWelt = useZurWelt();
  return (
    <button
      type="button"
      className="knopf-haupt"
      data-testid="partie-zurueck-zur-stadt"
      onClick={zurWelt}
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
  const begegnung = useBegegnung(partie.einstellung.abenteuer?.kennung ?? "");
  // Schutzengel (K4): Solange er wacht, prüft die Engine jeden Zug, bevor er gespielt wird.
  const engel = useSchutzengel(s, partie);
  // Spielstärke durch Dialog (staerkeNach in begegnungen.json), etwa „Atme“ gegen Mira.
  useStaerkewechsel(partie);
  // Zugerraten im Halbfinale (regeln/zugerraten.ts): prüft den Zug vor dem Schutzengel.
  const raten = useZugerraten(engel.steuerung, partie);
  // Kurze Partieformen (R13 bis R13b): nach den vereinbarten Zügen entscheidet die Bewertung.
  const kurz = useKurzform(partie);
  const bedienung = useLeserzug(raten.steuerung, s.fen, false);
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
  // Steht die Wertung einer kurzen Form an, ist das Brett zu: kein Zug über die Abmachung hinaus.
  const wertet = kurz?.gesperrt ?? false;
  const amZug = leserAmZug(partie) && !partie.ende && !wertet;
  return (
    <>
      {/* Sprechblasen am Brett (docs/spiel/29): oben der Gegner, unten Ambrose oder der Held. */}
      <Tischblase lage="oben" />
      <Tischblase lage="unten" />
      {/* Partiemomente der Begegnung (T5) und das Tischgespräch sprechen in die Blasen. */}
      <Momentzeile s={s} partie={partie} />
      <Tischgespraech
        partie={partie}
        jetztMs={s.jetztMs}
        gegnerkennung={begegnung?.gegner ?? null}
      />
      {engel.halt && !partie.ende && (
        <Schutzengelzeile
          grund={engel.halt}
          partiekennung={partie.id}
          halbzug={anzahl}
          beiEnde={engel.schliesse}
        />
      )}
      {raten.zeile && (
        <p className="abenteuer-moment" role="status" data-testid="abenteuer-zugerraten">
          {tSpiel(raten.zeile)}
        </p>
      )}
      <div className="abenteuer-partie-brett">
        <Brettbereich
          stellung={stellung.wert}
          markierungen={hinweis.fen === s.fen ? hinweis.marken : []}
          letzterZug={letzter}
          bedienung={
            amZug ? bedienung : { ...bedienung, ziele: [], beiFeld: () => undefined, ziehen: null }
          }
          beschriftung={tSpiel("huelle.brett", { gegner })}
          anfangsGedreht={eigene === "black"}
          ueberlagerung={
            gezeigt === anzahl ? (
              <Ergebnisblende
                partie={partie}
                grund={endgrund(partie, gegner)}
                bild={<Gegnerbild partie={partie} />}
              />
            ) : undefined
          }
        />
      </div>
      {/* Rechte Spalte im Querformat, im Hochformat unter dem Brett (huellenlage.css); die Uhr des
          Gegners steht hoch über dem Brett, quer oben in der Spalte. */}
      <div className="abenteuer-partie-seite">
        {/* Erzählter Einstieg der kurzen Partieformen; blockiert nichts, verschwindet beim ersten Zug. */}
        <Erzaehlvorhang begegnung={begegnung} partie={partie} />
        {partie.uhr && (
          <Uhr
            uhr={partie.uhr}
            farbe={gegenfarbe(eigene)}
            name={gegner}
            jetztMs={s.jetztMs}
            gegnerseite
          />
        )}
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
        {kurz && !partie.ende && <Kurzformzeile stand={kurz} />}
        <Nachwort begegnung={begegnung} partie={partie} />
        {partie.ende && anzahl > 0 && (
          <Blaettern stelle={gezeigt} anzahl={anzahl} setze={setzeStelle} />
        )}
        {partie.ende ? <Weiterknopf /> : <Spielfuss s={s} gegner={gegner} wertet={wertet} />}
        {!partie.ende && <Testleiste id={partie.id} />}
      </div>
    </>
  );
}

/** Die Zusatzansicht; `wert` ist die Id der Partie in der App. */
export function PartieHuelle({ wert }: { readonly wert: string | null }) {
  const s = usePartie(wert ?? "");
  const partie = s.partie;
  const blind = partie?.einstellung.abenteuer?.variante === "blind";
  // Brett und Pixelfiguren je Ort und Gegner (docs/spiel/30, Abschnitt 5); Blindschach ohne Stil.
  useAbenteuerBrettstil(partieBrettquelle(partie));
  return (
    <TischblasenRahmen>
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
    </TischblasenRahmen>
  );
}
