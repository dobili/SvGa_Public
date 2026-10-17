/**
 * Partie-Bildschirm: gegen die Engine zu Ende spielen, mit Uhr, Rücknahme und Hinweis.
 *
 * Rolle im Gesamtbild: Bildschirmentwurf „Partie“ und Pflichtenheft 5.2. Oben die Zugliste mit
 * Navigation (wie bei den Abbildungen), darunter die Uhr der Engine, das Brett (bei Schwarz
 * gedreht) und die Uhr des Lesers. Die ruhige Ansicht (Wunsch des Autors,
 * Schalter mit dem Auge unten rechts am Brett) zeigt nur Brett, Zugnavigation und Züge.
 * Nach dem Ende erscheint das Ergebnis (ein Spielziel gibt es seit 0.2.33 nicht mehr). Die
 * Rückfrage vor einem gefährlichen Zug (Sicherheitsblick) gibt es seit 0.2.32 nicht mehr: Der
 * Autor hat sie gestrichen, weil der Spieler Züge zurücknehmen kann.
 * Seit 0.2.33 (Wunsch P1, Vorschlag B2): Zählen, Röntgen und Warnsignale W1–W7 als Symbole am
 * Brett, darunter die Bündel des Buches mit Reitern und Karten (PartieWerkzeuge.tsx); in der
 * ruhigen Ansicht ausgeblendet.
 * Seit 0.2.38 (Vorschlag H, Rückblick): Nach der Auswertung trägt beim Nachspielen das Zielfeld
 * des gezeigten Zuges sein Zeichen, ein goldener Pfeil zeigt den besseren Zug, links am Brett
 * steht ein Bewertungsbalken (spiel/rueckblick.ts); seit 0.2.39 dazu unter dem Brett die Karte
 * zum Zug mit Urteil, besserem Zug und Erklärung des Fehlers (ui/komponenten/useRueckblick.tsx).
 * Während der Partie bleibt das aus.
 * Abhängigkeiten: ui/komponenten/usePartie.ts, spiel/, i18n.
 */
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { gegnername } from "../../engine/gegner";
import { stufe } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import { stellungAusFen, type Farbe } from "../../schach/stellung";
import { spieleZug, zugFelder } from "../../schach/weiterspielen";
import {
  EROEFFNUNG_BUCH,
  leserAmZug,
  stellungen,
  type Partie as PartieDaten,
} from "../../spiel/partie";
import { mitVorlieben } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { zugurteile } from "../../spiel/auswertung";
import { phasenJeStellung, type Phase } from "../../spiel/phasen";
import { buchzuegeAb } from "../../schach/eroeffnungsindex";
import { useEroeffnungsindex } from "../komponenten/useEroeffnungsindex";
import { Auswertung, type Sprung } from "../komponenten/Auswertung";
import { Brettbereich } from "../komponenten/Brettbereich";
import { Kopfzeile } from "../komponenten/Kopfzeile";
import { Partieende } from "../komponenten/Partieende";
import { Partiestatus } from "../komponenten/Partiestatus";
import { Partieuhr } from "../komponenten/Partieuhr";
import { Partiezuege } from "../komponenten/Partiezuege";
import { PartieLeiste, PartieSymbole, PartieWerkzeugkarten } from "../komponenten/PartieWerkzeuge";
import { PARTIEKAPITEL, usePartierechnung } from "../komponenten/partiewerkzeug";
import { useRueckblick, type Rueckblick } from "../komponenten/useRueckblick";
import { SpielHinweis } from "../komponenten/SpielHinweis";
import { useBrettbedienung } from "../komponenten/useBrettbedienung";
import { useAuswertung } from "../komponenten/useAuswertung";
import { usePartie, type Partiesteuerung } from "../komponenten/usePartie";
import { useWerkzeugwahl, type Werkzeugwahlstand } from "../komponenten/useWerkzeugwahl";

const SYMBOLGROESSE = 20;
/** Ab Kapitel 2 gibt es den Eröffnungsindex. */
const KAPITEL_MIT_EROEFFNUNGEN = 2;

function gegnerVon(farbe: Farbe): Farbe {
  return farbe === "white" ? "black" : "white";
}

/** „Stufe 1 · Einsteiger · du spielst Schwarz“, bei Mensch gegen Mensch „Beide Seiten selbst“. */
function Untertitel({ partie }: { partie: PartieDaten }) {
  const s = stufe(partie.einstellung.stufe);
  const farbe = t(partie.einstellung.eigeneFarbe === "white" ? "farbe.w" : "farbe.b");
  if (partie.einstellung.gegner === "mensch") {
    return <p className="partie-untertitel">{t("partie.untertitelMensch")}</p>;
  }
  const bot = gegnername(partie.einstellung.bot, partie.einstellung.botName);
  const gewaehlt = partie.einstellung.eroeffnung;
  const eroeffnung = gewaehlt === EROEFFNUNG_BUCH ? t("partie.eroeffnungBuch") : gewaehlt;
  const je = partie.einstellung.stufenJePhase;
  const verschieden = je.eroeffnung !== je.mittelspiel || je.endspiel !== je.mittelspiel;
  const stufenText = verschieden
    ? t("partie.stufenJePhase", { e: je.eroeffnung, m: je.mittelspiel, s: je.endspiel })
    : t("partie.stufe", { nummer: s.nummer, name: t(s.name) });
  const stufentext = bot ? t("partie.gegnerBot", { name: bot, stufen: stufenText }) : stufenText;
  return (
    <p className="partie-untertitel">
      {eroeffnung
        ? t("partie.untertitelEroeffnung", { stufe: stufentext, farbe, eroeffnung })
        : t("partie.untertitel", { stufe: stufentext, farbe })}
    </p>
  );
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
      aria-pressed={ruhig}
      aria-label={t("partie.ruhig")}
      title={t("partie.ruhig")}
      onClick={schalte}
    >
      {ruhig ? <EyeOff size={SYMBOLGROESSE} /> : <Eye size={SYMBOLGROESSE} />}
    </button>
  );
}

/** Name einer Seite: „Du“ und „Engine“, bei Mensch gegen Mensch „Weiß“ und „Schwarz“. */
function seitenname(partie: PartieDaten, farbe: Farbe): string {
  if (partie.einstellung.gegner === "mensch") return t(farbe === "white" ? "farbe.w" : "farbe.b");
  return t(farbe === partie.einstellung.eigeneFarbe ? "partie.du" : "partie.engine");
}

/** Uhr einer Seite, falls die Partie eine Uhr hat. */
function Uhr({ s, farbe }: { s: Partiesteuerung; farbe: Farbe }) {
  const partie = s.partie;
  if (!partie?.uhr) return null;
  return (
    <Partieuhr
      name={seitenname(partie, farbe)}
      farbe={farbe}
      uhr={partie.uhr}
      jetztMs={s.jetztMs}
    />
  );
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
  phasen,
  ruhig,
  werkzeug,
  rueckblick,
}: {
  werkzeug: Werkzeugwahlstand;
  rueckblick: Rueckblick | null;
  s: Partiesteuerung;
  partie: PartieDaten;
  ruhig: boolean;
  hinweis: readonly Markierung[];
  ansicht: Ansichtsstelle | null;
  beiAnsicht: (ansicht: Ansichtsstelle) => void;
  zeichen: readonly (string | null)[];
  /** Phase je Stellung für „M“ und „E“ in der Zugliste (0.2.43). */
  phasen: readonly Phase[];
}) {
  const alle = useMemo(() => stellungen(partie), [partie]);
  const sans = partie.zuege.map((z) => z.san);
  const gewaehlt = ansicht?.zuege === sans.length ? ansicht : null;
  const stelle = gewaehlt?.stelle ?? sans.length;
  const gezeigt = alle[stelle] ?? s.fen;
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
  const rb = useRueckblick(rueckblick, partie, alle, sans, stelle);
  if (!stellung.ok) return <p className="fehlertext">{stellung.fehler}</p>;
  const letzter = stelle > 0 ? zugFelder(alle[stelle - 1] ?? "", sans[stelle - 1] ?? "") : null;
  const gesprungen = gewaehlt && gewaehlt.marken.length > 0 ? gewaehlt.marken : null;
  const markierungen = rechnung.ergebnis
    ? rechnung.markierungen
    : amZug
      ? hinweis
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
        phasen={phasen}
        beiStelle={(neu) => beiAnsicht({ zuege: sans.length, stelle: neu, marken: [] })}
      />
      <Uhr s={s} farbe={gegnerVon(partie.einstellung.eigeneFarbe)} />
      <Brettbereich
        stellung={stellung.wert}
        markierungen={markierungen}
        letzterZug={letzter}
        bedienung={tippbar ? bedienung : { ...bedienung, ziele: [], beiFeld: () => undefined }}
        beschriftung={t("partie.titel")}
        anfangsGedreht={partie.einstellung.eigeneFarbe === "black"}
        werkzeugSymbole={ruhig || !hilfen.symbole ? null : <PartieSymbole werkzeug={werkzeug} />}
        zusatzSchalter={<RuhigSchalter ruhig={ruhig} />}
        seitenleiste={rb.leiste}
      />
      <Uhr s={s} farbe={partie.einstellung.eigeneFarbe} />
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
  // Der Eröffnungsindex (Kapitel 2 und 3) erkennt Buchzüge für die Zugklasse „Buch“.
  const index = useEroeffnungsindex(KAPITEL_MIT_EROEFFNUNGEN);
  const urteile = useMemo(() => {
    if (!eintrag) return [];
    const buch = index ? (fen: string, san: string) => buchzuegeAb(index, fen).includes(san) : null;
    return zugurteile(eintrag.partie, eintrag.werte, eintrag.beste, eintrag.abstaende, buch);
  }, [eintrag, index]);
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
        phasen={phasen}
        ruhig={ruhig}
        werkzeug={werkzeug}
        rueckblick={
          partie.ende && eintrag && urteile.length > 0 && !ruhig
            ? { werte: eintrag.werte, beste: eintrag.beste, urteile }
            : null
        }
      />
      <Partiestatus s={s} partie={partie} ruhig={ruhig} />
      {!ruhig && leser && partie.einstellung.hilfen.werkzeuge && (
        <SpielHinweis
          key={s.fen}
          fen={s.fen}
          beiMarkierungen={(marken) => setzeHinweis({ fen: s.fen, marken })}
        />
      )}
      {partie.ende && <Partieende partie={partie} />}
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

export function Partie({ id }: { id: string }) {
  const s = usePartie(id);
  const titel = t(
    s.partie?.einstellung.gegner === "mensch" ? "partie.titelMensch" : "partie.titel",
  );
  return (
    <div className="bildschirm bildschirm-partie" data-testid="partie">
      <Kopfzeile titel={titel} zurueckText={t("partie.zurueck")} />
      {!s.geladen && <p className="lade">…</p>}
      {s.geladen && !s.partie && <p className="fehlertext">{t("partie.nichtGefunden")}</p>}
      {s.partie && <Inhalt s={s} partie={s.partie} />}
    </div>
  );
}
