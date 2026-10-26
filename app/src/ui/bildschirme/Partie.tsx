/**
 * Partie-Bildschirm: gegen die Engine zu Ende spielen, mit Uhr, Rücknahme und Engine-Knopf.
 *
 * Rolle im Gesamtbild: Bildschirmentwurf „Partie“ und Pflichtenheft 5.2. Oben die Zugliste mit
 * Navigation (wie bei den Abbildungen), darunter die Uhr der Engine, das Brett (bei Schwarz
 * gedreht) und die Uhr des Lesers. Die ruhige Ansicht (Wunsch des Autors,
 * Schalter mit dem Auge unten rechts am Brett) zeigt nur Brett, Zugnavigation und Züge.
 * Nach dem Ende erscheint das Ergebnis. Eine Rückfrage vor einem gefährlichen Zug gibt es nicht:
 * Der Autor hat sie gestrichen, weil der Spieler Züge zurücknehmen kann.
 * Werkzeuge (Wunsch P1, Vorschlag B2): Zählen, Röntgen und Warnsignale W1–W7 als Symbole am
 * Brett, darunter die Bündel des Buches mit Reitern und Karten (PartieWerkzeuge.tsx); in der
 * ruhigen Ansicht ausgeblendet.
 * Rückblick (Vorschlag H): Nach der Auswertung trägt beim Nachspielen das Zielfeld des gezeigten
 * Zuges sein Zeichen, ein goldener Pfeil zeigt den besseren Zug, links am Brett steht ein
 * Bewertungsbalken (spiel/rueckblick.ts), unter dem Brett die Karte zum Zug mit Urteil, besserem
 * Zug und Erklärung des Fehlers (ui/komponenten/rueckblick/useRueckblick.tsx). Während der
 * Partie bleibt das aus.
 * Hilfe während der Partie (Wunsch des Autors, 18.10.2026): ein Knopf „Engine“ unter dem Brett,
 * der Schritt für Schritt Bewertung, Urteil über den eigenen letzten Zug, Erklärung und besten
 * Zug zeigt (SpielEngine.tsx).
 * Abhängigkeiten: ui/komponenten/partie/usePartie.ts, spiel/, i18n.
 */
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { t } from "../../i18n/sprache";
import { stellungAusFen, type Farbe } from "../../schach/stellung";
import { spieleZug, zugFelder } from "../../schach/weiterspielen";
import { leserAmZug, stellungen, type Partie as PartieDaten } from "../../spiel/partie";
import { mitVorlieben } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { zugurteile, type Zugklasse } from "../../spiel/auswertung";
import { phasenJeStellung, type Phase } from "../../spiel/phasen";
import { theorieJeZug } from "../../schach/theorie";
import { gambitJeZug } from "../../schach/theorienamen";
import { useTheorie } from "../komponenten/rueckblick/useTheorie";
import { Auswertung, type Sprung } from "../komponenten/auswertung/Auswertung";
import { Brettbereich } from "../komponenten/brettbedienung/Brettbereich";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { Partieende } from "../komponenten/partie/Partieende";
import { Gruppenfreischaltung } from "../komponenten/gegner/Gruppenmodus";
import { Ergebnisblende } from "../komponenten/partie/Ergebnisblende";
import { Zugmarke } from "../komponenten/rueckblick/Zugmarke";
import { Partiestatus } from "../komponenten/partie/Partiestatus";
import { Partietitel } from "../komponenten/partie/Partietitel";
import { Partieuhr } from "../komponenten/partie/Partieuhr";
import { Partiezuege } from "../komponenten/partie/Partiezuege";
import { Untertitel } from "../komponenten/partie/Partieuntertitel";
import {
  PartieLeiste,
  PartieSymbole,
  PartieWerkzeugkarten,
} from "../komponenten/partie/PartieWerkzeuge";
import { PARTIEKAPITEL, usePartierechnung } from "../komponenten/partie/partiewerkzeug";
import type { Zweigart } from "../komponenten/rueckblick/Nebenzweig";
import { useRueckblick, type Rueckblick } from "../komponenten/rueckblick/useRueckblick";
import { SpielEngine } from "../komponenten/partie/SpielEngine";
import { useBrettbedienung } from "../komponenten/brettbedienung/useBrettbedienung";
import { useAuswertung } from "../komponenten/auswertung/useAuswertung";
import { usePartie, type Partiesteuerung } from "../komponenten/partie/usePartie";
import {
  useWerkzeugwahl,
  type Werkzeugwahlstand,
} from "../komponenten/werkzeugwahl/useWerkzeugwahl";

const SYMBOLGROESSE = 20;
function gegnerVon(farbe: Farbe): Farbe {
  return farbe === "white" ? "black" : "white";
}

/** Schalter für die ruhige Ansicht, unten rechts am Brett bei den anderen Brettschaltern. */
function RuhigSchalter({ ruhig }: { ruhig: boolean }) {
  const schalte = () =>
    void aendere((d) => ({
      ...d,
      spiel: mitVorlieben(d.spiel, { ...d.spiel.vorlieben, ruhigeAnsicht: !ruhig }),
    }));
  return (
    <button
      type="button"
      className="knopf-symbol brettschalter"
      data-tour="partie-ruhig"
      aria-pressed={ruhig}
      aria-label={t("partie.ruhig")}
      title={t("partie.ruhig")}
      onClick={schalte}
    >
      {ruhig ? <EyeOff size={SYMBOLGROESSE} /> : <Eye size={SYMBOLGROESSE} />}
      <span className="brettschalter-text" aria-hidden="true">
        {t("partie.ruhigKurz")}
      </span>
    </button>
  );
}

/** Uhr einer Seite, falls die Partie eine Uhr hat. */
function Uhr({ s, farbe }: { s: Partiesteuerung; farbe: Farbe }) {
  const partie = s.partie;
  if (!partie?.uhr) return null;
  return <Partieuhr partie={partie} farbe={farbe} uhr={partie.uhr} jetztMs={s.jetztMs} />;
}

/**
 * Der Zug des Lesers: Tippen auf Figur und Zielfeld spielt den Zug sofort. Ist „Zählen“ gewählt,
 * zählt ein Tipp stattdessen das Feld.
 */
function useLeserzug(s: Partiesteuerung, gezeigt: string, zaehlen: boolean) {
  return useBrettbedienung(
    {
      fen: gezeigt,
      spiele: (von, nach, rolle) => {
        const versuch = spieleZug(gezeigt, von, nach, rolle);
        if (versuch.art === "gespielt") s.spieleLeser(versuch.san);
        return versuch.art;
      },
    },
    zaehlen ? "zaehlen" : "ziehen",
    () => undefined,
  );
}

/** Eine gewählte Stelle in der Zugliste, mit Markierungen (Sprung aus der Auswertung). */
interface Ansichtsstelle extends Sprung {
  /** Zahl der Züge beim Wählen: Ändert sich die Partie, gilt wieder die aktuelle Stellung. */
  readonly zuege: number;
}

/** Brett und Zugliste: das, was auch die ruhige Ansicht zeigt. */
function Spielfeld({
  s,
  partie,
  hinweis,
  ansicht,
  beiAnsicht,
  zeichen,
  klassen,
  phasen,
  ruhig,
  werkzeug,
  engineKarte,
  rueckblick,
}: {
  werkzeug: Werkzeugwahlstand;
  /** Karte des Engine-Symbols direkt unter dem Brett (0.2.82), sonst null. */
  engineKarte: ReactNode;
  rueckblick: Rueckblick | null;
  s: Partiesteuerung;
  partie: PartieDaten;
  ruhig: boolean;
  hinweis: readonly Markierung[];
  ansicht: Ansichtsstelle | null;
  beiAnsicht: (ansicht: Ansichtsstelle) => void;
  zeichen: readonly (string | null)[];
  /** Zugklasse je Halbzug nach der Auswertung, für die Marken in Zugliste und Brett (0.2.131). */
  klassen: readonly (Zugklasse | null)[];
  /** Phase je Stellung für „M“ und „E“ in der Zugliste (0.2.43). */
  phasen: readonly Phase[];
}) {
  const alle = useMemo(() => stellungen(partie), [partie]);
  const sans = partie.zuege.map((z) => z.san);
  const gewaehlt = ansicht?.zuege === sans.length ? ansicht : null;
  const stelle = gewaehlt?.stelle ?? sans.length;
  // Nebenzweig „Besser war …“ (0.2.85): gilt nur für die Stelle, an der er gewählt wurde.
  const [zweig, setzeZweig] = useState<{ stelle: number; art: Zweigart; schritt: number } | null>(
    null,
  );
  const hier = zweig?.stelle === stelle ? zweig : null;
  const zweigwahl = {
    art: hier?.art ?? null,
    schritt: hier?.schritt ?? null,
    setze: (art: Zweigart, schritt: number | null) =>
      setzeZweig(schritt === null ? null : { stelle, art, schritt }),
  };
  const rb = useRueckblick(rueckblick, partie, alle, sans, stelle, phasen, zweigwahl);
  const gezeigt = rb.zweigzug?.nachher ?? alle[stelle] ?? s.fen;
  // Spielhilfen (0.2.41): Symbole und Werkzeuge nur, wenn vor der Partie gewählt; die großen
  // Werkzeuge verschwinden nach dem Ende, die Symbole bleiben.
  const { hilfen } = partie.einstellung;
  const mitWerkzeugen = hilfen.werkzeuge && !partie.ende;
  const wahl = ruhig || !(hilfen.symbole || mitWerkzeugen) ? null : werkzeug.wahl;
  const bedienung = useLeserzug(s, gezeigt, wahl === "zaehlen");
  const amZug = stelle === sans.length && leserAmZug(partie);
  const stellung = useMemo(() => stellungAusFen(gezeigt), [gezeigt]);
  const verlauf = { startFen: partie.einstellung.startFen, zuege: sans.slice(0, stelle) };
  const rechnung = usePartierechnung(
    wahl,
    bedienung.zaehlfeld,
    stellung.ok ? stellung.wert : null,
    verlauf,
    partie.einstellung.eigeneFarbe,
  );
  if (!stellung.ok) return <p className="fehlertext">{stellung.fehler}</p>;
  const letzter = rb.zweigzug
    ? zugFelder(rb.zweigzug.vorher, rb.zweigzug.san)
    : stelle > 0
      ? zugFelder(alle[stelle - 1] ?? "", sans[stelle - 1] ?? "")
      : null;
  const gesprungen = gewaehlt && gewaehlt.marken.length > 0 ? gewaehlt.marken : null;
  const markierungen = rechnung.ergebnis
    ? rechnung.markierungen
    : amZug
      ? hinweis
      : rb.zweigzug
        ? []
        : (gesprungen ?? rb.marken);
  // Zählen geht auch in früheren Stellungen; gezogen wird nur, wenn der Leser am Zug ist.
  const tippbar = amZug || wahl === "zaehlen";
  return (
    <>
      {/* Zugliste mit Navigation über dem Brett, wie bei den Abbildungen (Wunsch des Autors). */}
      <Partiezuege
        startFen={partie.einstellung.startFen}
        zuege={sans}
        stelle={stelle}
        zeichen={zeichen}
        klassen={klassen}
        phasen={phasen}
        beiStelle={(neu) => beiAnsicht({ zuege: sans.length, stelle: neu, marken: [] })}
      />
      <Uhr s={s} farbe={gegnerVon(partie.einstellung.eigeneFarbe)} />
      <Brettbereich
        stellung={stellung.wert}
        markierungen={markierungen}
        letzterZug={letzter}
        bedienung={
          tippbar ? bedienung : { ...bedienung, ziele: [], beiFeld: () => undefined, ziehen: null }
        }
        beschriftung={t("partie.titel")}
        anfangsGedreht={partie.einstellung.eigeneFarbe === "black"}
        werkzeugSymbole={
          ruhig ? null : (
            <PartieSymbole
              werkzeug={werkzeug}
              mitSymbolen={hilfen.symbole}
              mitEngine={mitWerkzeugen}
            />
          )
        }
        zusatzSchalter={<RuhigSchalter ruhig={ruhig} />}
        seitenleiste={rb.leiste}
        ueberlagerung={(gedreht: boolean) => (
          <>
            <Ergebnisblende partie={partie} />
            {!rb.zweigzug && stelle > 0 && (
              <Zugmarke
                feld={letzter?.nach ?? null}
                klasse={klassen[stelle - 1] ?? null}
                gedreht={gedreht}
              />
            )}
          </>
        )}
      />
      {/* Varianten der Karte zum Abspielen direkt unter dem Brett (Wunsch des Autors, 0.3.0). */}
      {rb.abspielen}
      <Uhr s={s} farbe={partie.einstellung.eigeneFarbe} />
      {engineKarte}
      {rb.karte}
      {!ruhig && mitWerkzeugen && <PartieLeiste werkzeug={werkzeug} />}
      <PartieWerkzeugkarten
        wahl={wahl}
        ergebnis={rechnung.ergebnis}
        stellung={stellung.wert}
        sicht={partie.einstellung.eigeneFarbe}
        engine={rechnung}
      />
    </>
  );
}

/** Beim Abwählen ist nichts zu vergessen: Das Zählfeld gilt nur, solange „Zählen“ gewählt ist. */
function keineAbwahl(): void {}

/** Inhalt, sobald die Partie geladen ist. */
function Inhalt({ s, partie }: { s: Partiesteuerung; partie: PartieDaten }) {
  const vorlieben = useSpeicher((z) => z.daten.spiel.vorlieben);
  const [hinweis, setzeHinweis] = useState<{ fen: string; marken: readonly Markierung[] }>({
    fen: "",
    marken: [],
  });
  const [ansicht, setzeAnsicht] = useState<Ansichtsstelle | null>(null);
  // Werkzeuge wie an den Abbildungen, mit allen Bündeln des Buches (Kapitel 12).
  const werkzeug = useWerkzeugwahl(PARTIEKAPITEL, keineAbwahl);
  const eintrag = useSpeicher(
    (z) => z.daten.spiel.partien.find((e) => e.partie.id === partie.id) ?? null,
  );
  // Seit 0.2.40 rechnet die Auswertung schon während der Partie, wenn der Leser am Zug ist.
  const stand = useAuswertung(partie, eintrag, leserAmZug(partie) && partie.ende === null);
  // Lichess-Liste und Eröffnungsindex (Kapitel 2 und 3) erkennen die Theoriezüge (seit dem
  // Wunsch des Autors vom 25.10.2026 wie „Book“ bei chess.com; Regel in schach/theorie.ts).
  const theorie = useTheorie() ?? null;
  const urteile = useMemo(() => {
    if (!eintrag) return [];
    const p = eintrag.partie;
    const fens = stellungen(p);
    const sans = p.zuege.map((z) => z.san);
    const jeZug = theorie ? theorieJeZug(theorie, fens, sans) : [];
    const gambits = theorie ? gambitJeZug(theorie, fens, sans) : [];
    return zugurteile(p, eintrag.werte, eintrag.beste, eintrag.abstaende, jeZug, gambits);
  }, [eintrag, theorie]);
  const phasen = useMemo(() => phasenJeStellung(partie), [partie]);
  const ruhig = vorlieben.ruhigeAnsicht;
  const leser = leserAmZug(partie);
  const springe = (sprung: Sprung) => {
    setzeAnsicht({ ...sprung, zuege: partie.zuege.length });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      {!ruhig && <Untertitel partie={partie} />}
      <Spielfeld
        s={s}
        partie={partie}
        hinweis={hinweis.fen === s.fen ? hinweis.marken : []}
        ansicht={ansicht}
        beiAnsicht={setzeAnsicht}
        zeichen={urteile.map((u) => u.zeichen)}
        klassen={urteile.map((u) => u.klasse)}
        phasen={phasen}
        ruhig={ruhig}
        werkzeug={werkzeug}
        engineKarte={
          // Engine-Symbol gewählt, der Leser am Zug, Partie läuft (seit 0.2.82 als Symbol).
          !ruhig &&
          leser &&
          !partie.ende &&
          partie.einstellung.hilfen.werkzeuge &&
          werkzeug.wahl === "engine" ? (
            <SpielEngine
              key={s.fen}
              fen={s.fen}
              zuege={partie.zuege.map((z) => z.san)}
              startFen={partie.einstellung.startFen}
              beiMarkierungen={(marken) => setzeHinweis({ fen: s.fen, marken })}
            />
          ) : null
        }
        rueckblick={
          partie.ende && eintrag && urteile.length > 0 && !ruhig
            ? {
                werte: eintrag.werte,
                beste: eintrag.beste,
                urteile,
                varianten: eintrag.varianten,
                theorie,
              }
            : null
        }
      />
      <Partiestatus s={s} partie={partie} ruhig={ruhig} />
      {partie.ende && <Partieende partie={partie} />}
      {partie.ende && <Gruppenfreischaltung gegnerBot={partie.einstellung.bot} />}
      {partie.ende && eintrag && !ruhig && (
        <Auswertung
          eintrag={eintrag}
          stand={stand}
          urteile={urteile}
          phasen={phasen}
          beiSprung={springe}
        />
      )}
    </>
  );
}

/**
 * Der Bildschirm einer laufenden Partie gegen die Engine (oder einen Menschen am selben Gerät):
 * Brett, Uhren, Zugliste, Rücknahme und am Ende das Ergebnis.
 */
export function Partie({ id }: { id: string }) {
  const s = usePartie(id);
  return (
    <div className="bildschirm bildschirm-partie" data-testid="partie">
      <Kopfzeile titel={<Partietitel partie={s.partie} />} zurueckText={t("partie.zurueck")} />
      {!s.geladen && <p className="lade">…</p>}
      {s.geladen && !s.partie && <p className="fehlertext">{t("partie.nichtGefunden")}</p>}
      {s.partie && <Inhalt s={s} partie={s.partie} />}
    </div>
  );
}
