/**
 * Abbildung-Bildschirm: Brett mit den Buchmarkierungen, Bildunterschrift, Werkzeuge, Engine.
 *
 * Rolle im Gesamtbild: Herzstück der App (Konzept 10.1, Bildschirmentwurf „Abbildung“). Hat die
 * Abbildung eine Zugfolge, lässt sie sich mit der Zugleiste nachspielen (AP 5). Seit dem
 * Werkzeug-Umbau 0.2.30: Symbole am Brett (Zählen, Ziehen, Engine, Röntgen, Warnsignale),
 * darunter die Bündel des Kapitels, im gewählten Bündel die Reiter seiner Teile, dann die Karten.
 * Bedienung: Anfangs ist nichts gewählt, das Brett zeigt die Markierungen des Buches. Mit
 * „Zählen“ zählt ein Tipp aufs Feld Angreifer und Verteidiger; Zählen und Ziehen zeigen dazu ihre
 * Erklärkachel (bis man sie ausblendet). Ein zweites Tippen auf ein Bündel oder Symbol wählt es
 * ab, ebenso ein Tipp auf den Hintergrund. Seit 0.2.39 ist der Titel „Abb. 7.12“ ein Knopf: Ein
 * Tipp öffnet ein Nummernfeld für den Sprung zu einer anderen Abbildung (Idee des Autors). Seit
 * 0.2.90 kann „Erst selbst denken“ Werkzeuge und Engine zurückhalten, bis der Leser die Stellung
 * eingeschätzt hat (SelbstDenken.tsx, Einstellung „Auch vor Werkzeugen und Engine“). Seit 0.2.93
 * legt das Lesezeichen am Brett die gezeigte Stellung in die Lernsammlung (SammelFormular.tsx).
 * Abhängigkeiten: daten, analyse, engine, ui/brett, ui/komponenten (Werkzeugwahl, Nummernsprung),
 * Navigation, i18n.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { schreibeMerker } from "../../app/merker";
import { useNavigation } from "../../app/navigationsKontext";
import { letzterZugAus } from "../../engine/letzterzug";
import { hauptlinie } from "../../schach/variantenbaum";
import { ladeKapitel, type Abbildung as AbbildungDaten, type Kapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { stellungAusFen } from "../../schach/stellung";
import { Brettbereich } from "../komponenten/brettbedienung/Brettbereich";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { SammelFormular, SammelSchalter } from "../komponenten/lernsammlung/SammelFormular";
import { EigeneEinschaetzung, SelbstDenkenKarte } from "../komponenten/abbildung/SelbstDenken";
import { useSelbstDenken } from "../komponenten/abbildung/useSelbstDenken";
import { Karten } from "./AbbildungKarten";
import { Nummernfeld, Nummerntitel } from "../komponenten/abbildung/Nummernsprung";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { useEroeffnungsindex } from "../komponenten/bausteine/useEroeffnungsindex";
import { useEngineMarkierungen } from "../komponenten/werkzeugkarten/useEngineMarkierungen";
import { useFalle } from "../komponenten/werkzeugkarten/useFalle";
import { useGesehen } from "../komponenten/abbildung/useGesehen";
import { useHintergrundTipp } from "../komponenten/werkzeugwahl/useHintergrundTipp";
import { useBrettbedienung } from "../komponenten/brettbedienung/useBrettbedienung";
import { useNachspielen } from "../komponenten/brettbedienung/useNachspielen";
import { buchmarkierungen } from "../komponenten/abbildung/buchmarkierungen";
import { werkzeugergebnis } from "../komponenten/werkzeugwahl/werkzeugergebnis";
import { useSicht } from "../komponenten/werkzeugwahl/useSicht";
import { Brettsymbole } from "../komponenten/werkzeugwahl/Brettsymbole";
import { Reiterleiste, Werkzeugleiste } from "../komponenten/werkzeugwahl/Werkzeugleiste";
import { useWerkzeugwahl } from "../komponenten/werkzeugwahl/useWerkzeugwahl";
import { Zugleiste } from "../komponenten/brettbedienung/Zugleiste";

/** Knöpfe für die vorige und nächste Abbildung im selben Kapitel. */
function Blaettern({ kapitel, nummer }: { kapitel: Kapitel; nummer: string }) {
  const { ersetze } = useNavigation();
  const stelle = kapitel.abbildungen.findIndex((a) => a.id === nummer);
  const vorige = kapitel.abbildungen[stelle - 1];
  const naechste = kapitel.abbildungen[stelle + 1];
  return (
    <span className="blaettern" data-tour="abbildung-blaettern">
      <button
        type="button"
        className="knopf-symbol"
        aria-label={t("abbildung.vorige")}
        disabled={!vorige}
        onClick={() => vorige && ersetze({ bildschirm: "abbildung", nummer: vorige.id })}
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="knopf-symbol"
        aria-label={t("abbildung.naechste")}
        disabled={!naechste}
        onClick={() => naechste && ersetze({ bildschirm: "abbildung", nummer: naechste.id })}
      >
        <ChevronRight size={22} aria-hidden="true" />
      </button>
    </span>
  );
}

/** So viele Halbzüge der Hauptvariante bekommt k7-motiv (Schlüsselzug und Fortsetzung). */
const FORTSETZUNG_HALBZUEGE = 8;

/**
 * Inhalt des Bildschirms: Zugleiste (falls die Abbildung eine Zugfolge hat), Brett, Werkzeuge.
 *
 * Die Werkzeuge und die Engine arbeiten immer auf der gezeigten Stellung; die Pfeile des Buches
 * erscheinen nur, solange die Stellung einer Abbildung gezeigt wird.
 */
function Inhalt({ kapitel, abbildung }: { kapitel: Kapitel; abbildung: AbbildungDaten }) {
  const nachspielen = useNachspielen(kapitel, abbildung);
  // Anfangs ist kein Werkzeug gewählt: Das Brett zeigt die Abbildung wie im Buch (0.2.29).
  // Abwählen vergisst auch Zählfeld und gewählte Figur (über die Brettbedienung).
  const vergissRef = useRef<() => void>(() => undefined);
  const beiAbwahl = useCallback(() => vergissRef.current(), []);
  const werkzeug = useWerkzeugwahl(kapitel.kapitel, beiAbwahl);
  const { wahl } = werkzeug;
  const bedienung = useBrettbedienung(nachspielen, wahl, werkzeug.setzeWahl);
  useEffect(() => {
    vergissRef.current = bedienung.vergiss;
  }, [bedienung.vergiss]);
  // Skelett-Ansicht: nur im Bündel „Skelett-Röntgen“ (früher das Knochensymbol am Brett).
  const [skelett, setzeSkelett] = useState(false);
  const [sammeln, setzeSammeln] = useState(false);
  const skelettAn = skelett && werkzeug.buendel === "skelett";
  const stellung = useMemo(() => stellungAusFen(nachspielen.fen), [nachspielen.fen]);
  const sicht = useSicht(nachspielen.fen);
  const eroeffnungen = useEroeffnungsindex(kapitel.kapitel);
  const falle = useFalle(
    stellung.ok ? stellung.wert : null,
    wahl === "k4-falle",
    nachspielen.naechsterZug,
  );
  const gegnerplan = useEngineMarkierungen(
    stellung.ok ? stellung.wert : null,
    wahl === "k6-gegner",
  );
  const erzwingend = useEngineMarkierungen(
    stellung.ok ? stellung.wert : null,
    wahl === "k7-erzwingend",
  );
  const ruhe = useEngineMarkierungen(stellung.ok ? stellung.wert : null, wahl === "k7-ruhe");
  const enginebrett = useEngineMarkierungen(stellung.ok ? stellung.wert : null, wahl === "engine");
  // Der letzte Zug für das Urteil der Engine; je Stellung dasselbe Objekt (useZugurteil.ts).
  const { startFen } = nachspielen.verlauf;
  const zugschluessel = nachspielen.verlauf.zuege.join(" ");
  const letzterZug = useMemo(
    () => letzterZugAus(startFen, zugschluessel ? zugschluessel.split(" ") : []),
    [startFen, zugschluessel],
  );

  // Erst selbst denken (seit 0.2.90, Einstellung „Auch vor Werkzeugen und Engine“): je Abbildung.
  const denken = useSelbstDenken(nachspielen.abbildungHier?.id ?? abbildung.id, nachspielen.fen);

  // Tipp auf den Hintergrund: kein Werkzeug, also wieder die Markierungen des Buches.
  useHintergrundTipp(wahl !== null, werkzeug.abwaehlen);

  useEffect(() => schreibeMerker("zuletzt", abbildung.id), [abbildung.id]);
  // Es zählt die Abbildung, deren Stellung gerade auf dem Brett steht (ohne eigene Züge).
  useGesehen(nachspielen.eigene.stelle === 0 ? nachspielen.abbildungHier?.id : undefined);

  if (!stellung.ok) {
    return <p className="fehlertext">{stellung.fehler}</p>;
  }
  const hier = nachspielen.abbildungHier;
  const ergebnis = werkzeugergebnis(wahl, bedienung.zaehlfeld, stellung.wert, {
    sicht: sicht.farbe,
    naechsterZug: nachspielen.naechsterZug,
    abschnitt: hier?.abschnitt?.label ?? undefined,
    buchstellung: nachspielen.eigene.zuege.length === 0,
    verlauf: nachspielen.verlauf,
    eroeffnungen,
    fallencheck: hier ? kapitel.fallenchecks.find((f) => f.stopp === hier.id) : undefined,
    bilanz: hier
      ? kapitel.bilanzen.find((b) => b.art === "plan" && b.abbildung === hier.id)
      : undefined,
    // Die Fortsetzung des Buches nach dem nächsten Zug, solange der Leser auf der Buchlinie ist.
    fortsetzung:
      nachspielen.beispiel && nachspielen.eigene.zuege.length === 0
        ? hauptlinie(nachspielen.beispiel, nachspielen.pfad, FORTSETZUNG_HALBZUEGE).slice(1)
        : [],
    uebung: hier ? kapitel.uebungen.find((u) => u.abbildungen.includes(hier.id)) : undefined,
  });
  // Beim Ziehen verdecken Pfeile und Rahmen des Buches die Punkte der Zielfelder (Wunsch des
  // Autors nach dem Test von 0.2.0); sie kommen zurück, sobald ein anderes Werkzeug gewählt ist.
  const buch = hier && wahl !== "ziehen" ? buchmarkierungen(hier) : [];
  // Die Engine zeigt ihre Pfeile und Zeichen nur auf Wunsch; sonst bleiben die des Buches.
  const ohneWerkzeug =
    wahl === "engine" && enginebrett.markierungen.length > 0 ? enginebrett.markierungen : buch;
  const mitZugleiste = nachspielen.beispiel !== null || nachspielen.eigene.zuege.length > 0;
  const mitRegeln = stellung.wert.regeln !== null;
  return (
    <>
      {/* Zugleiste über dem Brett, Werkzeuge und ihre Ergebnisse direkt darunter: So erscheint
          eine Auswertung dort, wo der Leser gerade getippt hat (Wunsch des Autors, 0.2.2). */}
      {mitZugleiste && <Zugleiste stand={nachspielen} />}
      <Brettbereich
        stellung={stellung.wert}
        markierungen={
          ergebnis
            ? [
                // Hat die Engine die Kandidaten eingestuft, ersetzen ihre Markierungen die des Werkzeugs.
                ...(erzwingend.markierungen.length > 0
                  ? erzwingend.markierungen
                  : ergebnis.markierungen),
                ...falle.markierungen,
                ...gegnerplan.markierungen,
                ...ruhe.markierungen,
              ]
            : ohneWerkzeug
        }
        letzterZug={nachspielen.letzterZug}
        bedienung={bedienung}
        beschriftung={hier ? t("abbildung.titel", { nummer: hier.id }) : t("zugleiste.stellung")}
        werkzeugSymbole={
          denken.gesperrt ? null : (
            <Brettsymbole kapitel={kapitel.kapitel} mitRegeln={mitRegeln} werkzeug={werkzeug} />
          )
        }
        skelett={skelettAn}
        zusatzSchalter={<SammelSchalter an={sammeln} beiKlick={() => setzeSammeln(!sammeln)} />}
      />
      {sammeln && (
        <SammelFormular
          key={nachspielen.fen}
          mitErklaerung
          fen={nachspielen.fen}
          herkunft={{
            herkunft: "abbildung",
            quelle: hier?.id ?? abbildung.id,
            verlauf: nachspielen.verlauf,
          }}
        />
      )}
      {denken.gesperrt && <SelbstDenkenKarte stand={denken} />}
      {!denken.gesperrt && <EigeneEinschaetzung stand={denken} />}
      {/* Lehrbilder ohne König (Kapitel 0 und 5): keine Bündel, am Brett nur „Zählen“. */}
      {!denken.gesperrt && (
        <Werkzeugleiste kapitel={kapitel.kapitel} mitRegeln={mitRegeln} werkzeug={werkzeug} />
      )}
      {!denken.gesperrt && werkzeug.buendel && (
        <Reiterleiste
          kennung={werkzeug.buendel}
          kapitel={kapitel.kapitel}
          werkzeug={werkzeug}
          skelett={
            werkzeug.buendel === "skelett"
              ? { an: skelett, schalte: () => setzeSkelett(!skelett) }
              : null
          }
        />
      )}
      <Karten
        kapitel={kapitel}
        abbildung={abbildung}
        hier={hier}
        stellung={stellung.wert}
        wahl={wahl}
        ergebnis={ergebnis}
        falle={falle}
        gegnerplan={gegnerplan}
        erzwingend={erzwingend}
        ruhe={ruhe}
        enginebrett={enginebrett}
        letzterZug={letzterZug}
        naechsterZug={nachspielen.naechsterZug}
        sicht={sicht}
      />
    </>
  );
}

/**
 * Der Bildschirm einer Abbildung des Buches: Brett mit den Markierungen des Buches,
 * Bildunterschrift, Zugfolge zum Nachspielen, Werkzeuge und Engine.
 */
export function Abbildung({ nummer }: { nummer: string }) {
  const kapitelnummer = Number(nummer.split(".")[0]);
  const kapitel = useDaten(() => ladeKapitel(kapitelnummer), `kapitel-${kapitelnummer}`);
  const abbildung =
    kapitel.art === "fertig" ? kapitel.wert.abbildungen.find((a) => a.id === nummer) : undefined;
  const [sprung, setzeSprung] = useState(false);
  return (
    <div className="bildschirm bildschirm-abbildung">
      <Kopfzeile
        titel={
          <Nummerntitel nummer={nummer} offen={sprung} beiTipp={() => setzeSprung((s) => !s)} />
        }
        zurueckText={t("abbildung.zurueck")}
        rechts={
          kapitel.art === "fertig" ? <Blaettern kapitel={kapitel.wert} nummer={nummer} /> : null
        }
      />
      {sprung && <Nummernfeld beiSchliessen={() => setzeSprung(false)} />}
      {kapitel.art === "laedt" && <p className="lade">…</p>}
      {kapitel.art === "fehler" && (
        <p className="fehlertext">{t("buch.ladefehler", { fehler: kapitel.meldung })}</p>
      )}
      {kapitel.art === "fertig" && !abbildung && (
        <p className="fehlertext">{t("buch.nichtGefunden", { eingabe: nummer })}</p>
      )}
      {kapitel.art === "fertig" && abbildung && (
        <Inhalt key={abbildung.id} kapitel={kapitel.wert} abbildung={abbildung} />
      )}
    </div>
  );
}
