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
 * steht ein Bewertungsbalken (spiel/rueckblick.ts). Während der Partie bleibt das aus.
 * Abhängigkeiten: ui/komponenten/usePartie.ts, spiel/, i18n.
 */
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { stufe } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import { stellungAusFen, type Farbe } from "../../schach/stellung";
import { spieleZug, zugFelder } from "../../schach/weiterspielen";
import { leserAmZug, stellungen, type Partie as PartieDaten } from "../../spiel/partie";
import { mitVorlieben } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { zugurteile, type Zugurteil } from "../../spiel/auswertung";
import { rueckblickMarken } from "../../spiel/rueckblick";
import { Auswertung, type Sprung } from "../komponenten/Auswertung";
import { Bewertungsbalken } from "../komponenten/Bewertungsbalken";
import { Brettbereich } from "../komponenten/Brettbereich";
import { Kopfzeile } from "../komponenten/Kopfzeile";
import { Partieende } from "../komponenten/Partieende";
import { Partiestatus } from "../komponenten/Partiestatus";
import { Partieuhr } from "../komponenten/Partieuhr";
import { Partiezuege } from "../komponenten/Partiezuege";
import { PartieLeiste, PartieSymbole, PartieWerkzeugkarten } from "../komponenten/PartieWerkzeuge";
import { PARTIEKAPITEL, usePartierechnung } from "../komponenten/partiewerkzeug";
import { SpielHinweis } from "../komponenten/SpielHinweis";
import { useBrettbedienung } from "../komponenten/useBrettbedienung";
import { useAuswertung } from "../komponenten/useAuswertung";
import { usePartie, type Partiesteuerung } from "../komponenten/usePartie";
import { useWerkzeugwahl, type Werkzeugwahlstand } from "../komponenten/useWerkzeugwahl";

const SYMBOLGROESSE = 20;

function gegnerVon(farbe: Farbe): Farbe {
  return farbe === "white" ? "black" : "white";
}

/** „Stufe 1 · Einsteiger · du spielst Schwarz“ */
function Untertitel({ partie }: { partie: PartieDaten }) {
  const s = stufe(partie.einstellung.stufe);
  const farbe = t(partie.einstellung.eigeneFarbe === "white" ? "farbe.w" : "farbe.b");
  return (
    <p className="partie-untertitel">
      {t("partie.untertitel", { nummer: s.nummer, name: t(s.name), farbe })}
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

/** Uhr einer Seite, falls die Partie eine Uhr hat. */
function Uhr({ s, farbe }: { s: Partiesteuerung; farbe: Farbe }) {
  const partie = s.partie;
  if (!partie?.uhr) return null;
  const eigen = farbe === partie.einstellung.eigeneFarbe;
  return (
    <Partieuhr
      name={t(eigen ? "partie.du" : "partie.engine")}
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

/** Was der Rückblick nach der ausgewerteten Partie braucht (sonst null). */
interface Rueckblick {
  readonly werte: readonly number[];
  readonly beste: readonly string[];
  readonly urteile: readonly Zugurteil[];
}

/**
 * Zeichen, besserer Zug und Balken für die gezeigte Stelle (Vorschlag H).
 *
 * Beispiel: Stelle 3 nach 1. e4 e5 2. Dh5?!: „?!“ auf h5, goldener Pfeil zum Zug der Engine.
 */
function rueckblickAn(
  rueckblick: Rueckblick | null,
  alle: readonly string[],
  sans: readonly string[],
  stelle: number,
) {
  if (!rueckblick) return { marken: [], leiste: null };
  const index = stelle - 1;
  const marken =
    index >= 0
      ? rueckblickMarken(
          alle[index] ?? "",
          sans[index] ?? "",
          rueckblick.urteile[index],
          rueckblick.beste[index] ?? "",
        )
      : [];
  const wert = rueckblick.werte[stelle] ?? 0;
  const leiste = (gedreht: boolean) => <Bewertungsbalken wert={wert} gedreht={gedreht} />;
  return { marken, leiste };
}

/** Brett und Zugliste: das, was auch die ruhige Ansicht zeigt. */
function Spielfeld({
  s,
  partie,
  hinweis,
  ansicht,
  beiAnsicht,
  zeichen,
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
}) {
  const alle = useMemo(() => stellungen(partie), [partie]);
  const sans = partie.zuege.map((z) => z.san);
  const gewaehlt = ansicht?.zuege === sans.length ? ansicht : null;
  const stelle = gewaehlt?.stelle ?? sans.length;
  const gezeigt = alle[stelle] ?? s.fen;
  const wahl = ruhig ? null : werkzeug.wahl;
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
  const letzter = stelle > 0 ? zugFelder(alle[stelle - 1] ?? "", sans[stelle - 1] ?? "") : null;
  const rb = rueckblickAn(rueckblick, alle, sans, stelle);
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
        werkzeugSymbole={ruhig ? null : <PartieSymbole werkzeug={werkzeug} />}
        zusatzSchalter={<RuhigSchalter ruhig={ruhig} />}
        seitenleiste={rb.leiste}
      />
      <Uhr s={s} farbe={partie.einstellung.eigeneFarbe} />
      {!ruhig && <PartieLeiste werkzeug={werkzeug} />}
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
  const stand = useAuswertung(eintrag);
  const urteile = useMemo(
    () => (eintrag ? zugurteile(eintrag.partie, eintrag.werte) : []),
    [eintrag],
  );
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
        ruhig={ruhig}
        werkzeug={werkzeug}
        rueckblick={
          partie.ende && eintrag && urteile.length > 0 && !ruhig
            ? { werte: eintrag.werte, beste: eintrag.beste, urteile }
            : null
        }
      />
      <Partiestatus s={s} partie={partie} ruhig={ruhig} />
      {!ruhig && leser && (
        <SpielHinweis
          key={s.fen}
          fen={s.fen}
          beiMarkierungen={(marken) => setzeHinweis({ fen: s.fen, marken })}
        />
      )}
      {partie.ende && <Partieende partie={partie} />}
      {partie.ende && eintrag && !ruhig && (
        <Auswertung eintrag={eintrag} stand={stand} urteile={urteile} beiSprung={springe} />
      )}
    </>
  );
}

export function Partie({ id }: { id: string }) {
  const s = usePartie(id);
  return (
    <div className="bildschirm bildschirm-partie" data-testid="partie">
      <Kopfzeile titel={t("partie.titel")} zurueckText={t("partie.zurueck")} />
      {!s.geladen && <p className="lade">…</p>}
      {s.geladen && !s.partie && <p className="fehlertext">{t("partie.nichtGefunden")}</p>}
      {s.partie && <Inhalt s={s} partie={s.partie} />}
    </div>
  );
}
