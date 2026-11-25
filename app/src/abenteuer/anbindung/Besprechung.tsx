/**
 * Partiebesprechung mit Ambrose (Wunsch des Autors, 25.11.2026; Entwurf
 * docs/spiel/auftraege/partiebesprechung_25-11.md): eine beendete Partie noch einmal ansehen,
 * Ambrose spricht in der Blase über dem Brett, am Zielfeld steht die Marke der Zugklasse.
 *
 * Rolle im Gesamtbild: Zusatzansicht „abenteuer-besprechung“ (Vollbild), Wert: Id der Partie in
 * der App; geöffnet aus dem Tagebuch („Meine Partien“, Knopf „Besprechen“). Im Rahmen der
 * Spielhülle (Huelle.tsx) mit dem Brett des Ortes. Bedienung: ◀ ▶ je Halbzug, ⏮ ⏭ zur vorigen und
 * nächsten Stelle, über die Ambrose spricht, darunter eine Reihe Marken zum direkten Sprung. Ist
 * die Partie noch nicht ausgewertet, rechnet die Auswertungs-Engine der App (useBesprechung.ts);
 * Ambrose „sieht sie sich an“. Fehlt Ambrose (Tiefpunkt, nach dem Abschied), spricht niemand mit
 * Porträt: Die Sätze stehen als Notizen da (regeln/besprechung.ts, besprechungsstimme).
 * Hoch steht die Blase über dem Brett, quer rechts in der Spalte (huellenlage.css, Blöcke
 * abenteuer-partie-brett und abenteuer-partie-seite wie in der Partie).
 * Abhängigkeiten: anbindung/useBesprechung.ts, Huelle.tsx, Brettbereich, Zugmarke, Klassenmarke,
 * regeln/besprechungsmomente.ts, texte/texte.ts.
 */
import { useMemo, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { stellungAusFen } from "../../schach/stellung";
import { zugFelder } from "../../schach/weiterspielen";
import type { Zugklasse } from "../../spiel/auswertung";
import { stellungen } from "../../spiel/partie";
import { useSpeicher } from "../../speicher/speicher";
import type { Partieeintrag } from "../../speicher/partien";
import { Klassenmarke } from "../../ui/komponenten/auswertung/Auswertungssymbole";
import { zugtext } from "../../ui/komponenten/auswertung/sprung";
import type { Brettbedienung } from "../../ui/komponenten/brettbedienung/useBrettbedienung";
import { Brettbereich } from "../../ui/komponenten/brettbedienung/Brettbereich";
import { Zugmarke } from "../../ui/komponenten/rueckblick/Zugmarke";
import { partieBrettquelle, useAbenteuerBrettstil } from "../brett/useAbenteuerBrettstil";
import { Portraet } from "../dialog/Portraet";
import { AMBROSE } from "../regeln/abwesenheit";
import { naechsteMomentstelle } from "../regeln/besprechungsmomente";
import { tSpiel } from "../texte/texte";
import { useAbenteuerstand } from "./dienste";
import { Huelle } from "./Huelle";
import { gegnerName } from "./huellentexte";
import { useBesprechung, type Besprechungsstand, type Besprochenermoment } from "./useBesprechung";
import { useZurWelt } from "./zurWelt";
import "../besprechung.css";

/** Das Brett nimmt hier keine Züge an: nur ansehen. */
const NUR_ANSEHEN: Brettbedienung = {
  zaehlfeld: null,
  ausgewaehlt: null,
  ziele: [],
  gesperrt: null,
  umwandlungOffen: false,
  beiFeld: () => undefined,
  ziehen: null,
  vergiss: () => undefined,
  waehleUmwandlung: () => undefined,
};

/** Was die Blase an einer Stelle sagt: Auftakt, Satz des Moments, am Ende der Schluss. */
function satzAn(b: Besprechungsstand, stelle: number, anzahl: number): string {
  if (b.auswertung.art !== "fertig") return b.rechnet;
  if (stelle === 0) return b.auftakt;
  const moment = b.momente.find((m) => m.moment.index + 1 === stelle);
  const teile = [moment?.satz ?? "", stelle === anzahl ? b.schluss : ""];
  return teile.filter((t) => t !== "").join(" ");
}

/** Die Sprechblase über dem Brett: mit Ambrose als Geist mit Porträt, sonst als Notiz. */
function Blase({ text, mitAmbrose }: { readonly text: string; readonly mitAmbrose: boolean }) {
  if (!text) return <p className="abenteuer-besprechung-still" aria-hidden="true" />;
  return (
    <div
      className="abenteuer-besprechung-blase"
      data-erscheinung={mitAmbrose ? "geist" : "notiz"}
      data-testid="abenteuer-besprechung-blase"
    >
      {mitAmbrose && <Portraet sprecher={AMBROSE} stimmung={null} zeile={text} />}
      <p role="status" aria-live="polite">
        {mitAmbrose && <strong>{tSpiel(`figur.${AMBROSE}.name`)}</strong>} {text}
      </p>
    </div>
  );
}

/** Ein Knopf der Bedienung. */
function Knopf(props: {
  readonly zeichen: string;
  readonly beschriftung: string;
  readonly testid: string;
  readonly ziel: number | null;
  readonly setze: (stelle: number) => void;
}) {
  const { zeichen, beschriftung, testid, ziel, setze } = props;
  return (
    <button
      type="button"
      className="chip"
      disabled={ziel === null}
      aria-label={beschriftung}
      data-testid={testid}
      onClick={() => ziel !== null && setze(ziel)}
    >
      {zeichen}
    </button>
  );
}

/** ⏮ ◀ Stand ▶ ⏭: Halbzug für Halbzug, oder von Stelle zu Stelle, über die Ambrose spricht. */
function Bedienung(props: {
  readonly stelle: number;
  readonly anzahl: number;
  readonly momente: readonly Besprochenermoment[];
  readonly setze: (stelle: number) => void;
}) {
  const { stelle, anzahl, setze } = props;
  const momente = props.momente.map((m) => m.moment);
  const zurueck = stelle > 0 ? stelle - 1 : null;
  const vor = stelle < anzahl ? stelle + 1 : null;
  return (
    <div className="abenteuer-huelle-blaettern" data-testid="abenteuer-besprechung-bedienung">
      <Knopf
        zeichen="⏮"
        beschriftung={tSpiel("besprechung.vorigeStelle")}
        testid="abenteuer-besprechung-vorige"
        ziel={naechsteMomentstelle(momente, stelle, "zurueck") ?? (stelle > 0 ? 0 : null)}
        setze={setze}
      />
      <Knopf
        zeichen="◀"
        beschriftung={tSpiel("huelle.zugZurueck")}
        testid="abenteuer-besprechung-zurueck"
        ziel={zurueck}
        setze={setze}
      />
      <span role="status" data-testid="abenteuer-besprechung-stand">
        {tSpiel("huelle.nachspielStand", { zug: stelle, anzahl })}
      </span>
      <Knopf
        zeichen="▶"
        beschriftung={tSpiel("huelle.zugVor")}
        testid="abenteuer-besprechung-vor"
        ziel={vor}
        setze={setze}
      />
      <Knopf
        zeichen="⏭"
        beschriftung={tSpiel("besprechung.naechsteStelle")}
        testid="abenteuer-besprechung-naechste"
        ziel={naechsteMomentstelle(momente, stelle, "vor") ?? (stelle < anzahl ? anzahl : null)}
        setze={setze}
      />
    </div>
  );
}

/** Die Reihe der Momente: je eine Marke mit dem Zug, Tipp springt hin. */
function Momentreihe(props: {
  readonly eintrag: Partieeintrag;
  readonly b: Besprechungsstand;
  readonly stelle: number;
  readonly setze: (stelle: number) => void;
}) {
  const { eintrag, b, stelle, setze } = props;
  if (b.momente.length === 0) return null;
  return (
    <ul className="abenteuer-besprechung-momente" data-testid="abenteuer-besprechung-momente">
      {b.momente.map(({ moment }) => {
        const klasse: Zugklasse | null = b.klassen[moment.index] ?? null;
        const ziel = moment.index + 1;
        return (
          <li key={moment.index}>
            <button
              type="button"
              className="chip"
              aria-pressed={stelle === ziel}
              data-kategorie={moment.kategorie}
              onClick={() => setze(ziel)}
            >
              {klasse && <Klassenmarke klasse={klasse} />} {zugtext(eintrag.partie, moment.index)}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Pfeile des Moments an dieser Stelle, sonst keine. */
function pfeileAn(b: Besprechungsstand, stelle: number): readonly Markierung[] {
  return b.momente.find((m) => m.moment.index + 1 === stelle)?.pfeile ?? [];
}

/** Das Brett an einer Stelle: Stellung, letzter Zug, Marke der Zugklasse am Feld, Pfeile. */
function Besprechungsbrett(props: {
  readonly eintrag: Partieeintrag;
  readonly b: Besprechungsstand;
  readonly stelle: number;
}) {
  const { eintrag, b, stelle } = props;
  const partie = eintrag.partie;
  const fens = useMemo(() => stellungen(partie), [partie]);
  const fen = fens[stelle] ?? fens[0] ?? "";
  const stellung = useMemo(() => stellungAusFen(fen), [fen]);
  if (!stellung.ok) return <p className="fehlertext">{stellung.fehler}</p>;
  const vorher = fens[stelle - 1] ?? "";
  const letzter = stelle > 0 ? zugFelder(vorher, partie.zuege[stelle - 1]?.san ?? "") : null;
  const fertig = b.auswertung.art === "fertig";
  const klasse = fertig && stelle > 0 ? (b.klassen[stelle - 1] ?? null) : null;
  return (
    <div className="abenteuer-partie-brett">
      <Brettbereich
        stellung={stellung.wert}
        markierungen={fertig ? pfeileAn(b, stelle) : []}
        letzterZug={letzter}
        bedienung={NUR_ANSEHEN}
        beschriftung={tSpiel("besprechung.brett", { gegner: gegnerName(partie) })}
        anfangsGedreht={partie.einstellung.eigeneFarbe === "black"}
        ueberlagerung={(gedreht: boolean) => (
          <Zugmarke feld={letzter?.nach ?? null} klasse={klasse} gedreht={gedreht} />
        )}
      />
    </div>
  );
}

/** Brett, Blase und Bedienung einer geladenen Partie. */
function Inhalt({ eintrag }: { readonly eintrag: Partieeintrag }) {
  const b = useBesprechung(eintrag, useAbenteuerstand());
  const zurWelt = useZurWelt();
  const anzahl = eintrag.partie.zuege.length;
  const [stelle, setzeStelle] = useState(0);
  const fertig = b.auswertung.art === "fertig";
  return (
    <>
      <Besprechungsbrett eintrag={eintrag} b={b} stelle={stelle} />
      <div className="abenteuer-partie-seite">
        <Blase text={satzAn(b, stelle, anzahl)} mitAmbrose={b.kontext.stimme === "ambrose"} />
        {b.auswertung.art === "fehler" && (
          <p className="fehlertext">{tSpiel("besprechung.fehler")}</p>
        )}
        {fertig && (
          <Bedienung stelle={stelle} anzahl={anzahl} momente={b.momente} setze={setzeStelle} />
        )}
        {fertig && <Momentreihe eintrag={eintrag} b={b} stelle={stelle} setze={setzeStelle} />}
        <button
          type="button"
          className="knopf-haupt"
          data-testid="abenteuer-besprechung-ende"
          onClick={zurWelt}
        >
          {tSpiel("besprechung.ende")}
        </button>
      </div>
    </>
  );
}

/** Die Zusatzansicht; `wert` ist die Id der Partie in der App. */
export function Besprechung({ wert }: { readonly wert: string | null }) {
  const eintrag = useSpeicher(
    (z) => z.daten.spiel.partien.find((e) => e.partie.id === wert) ?? null,
  );
  const geladen = useSpeicher((z) => z.geladen);
  const zurWelt = useZurWelt();
  useAbenteuerBrettstil(partieBrettquelle(eintrag?.partie));
  return (
    <Huelle
      figur={tSpiel("besprechung.titel")}
      sprecher={null}
      testid="abenteuer-besprechung"
      klasse="abenteuer-huelle-partie abenteuer-huelle-besprechung"
    >
      {eintrag?.partie.ende ? (
        <Inhalt eintrag={eintrag} />
      ) : (
        <>
          <p className={geladen ? "fehlertext" : "lade"}>
            {tSpiel(geladen ? "huelle.partieFehlt" : "huelle.laedt")}
          </p>
          <button type="button" className="knopf-haupt" onClick={zurWelt}>
            {tSpiel("besprechung.ende")}
          </button>
        </>
      )}
    </Huelle>
  );
}
