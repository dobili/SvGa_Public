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
 * ab, ebenso ein Tipp auf den Hintergrund.
 * Abhängigkeiten: daten, analyse, engine, ui/brett, ui/komponenten (Werkzeugwahl), Navigation,
 * i18n.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { schreibeMerker } from "../../app/merker";
import { useNavigation } from "../../app/navigationsKontext";
import type { Werkzeugergebnis } from "../../analyse/werkzeug";
import { letzterZugAus, type LetzterZug } from "../../engine/letzterzug";
import { hauptlinie } from "../../schach/variantenbaum";
import { spielbar } from "../../spiel/partie";
import { ladeKapitel, type Abbildung as AbbildungDaten, type Kapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { stellungAusFen, type Stellung } from "../../schach/stellung";
import { Brettbereich } from "../komponenten/Brettbereich";
import { AntwortenKarte } from "../komponenten/AntwortenKarte";
import { EngineKarte } from "../komponenten/EngineKarte";
import { FalleKarte } from "../komponenten/FalleKarte";
import { RuheKarte } from "../komponenten/RuheKarte";
import { Kopfzeile } from "../komponenten/Kopfzeile";
import { Unterschrift } from "../komponenten/Unterschrift";
import { useDaten } from "../komponenten/useDaten";
import { useEroeffnungsindex } from "../komponenten/useEroeffnungsindex";
import {
  useEngineMarkierungen,
  type Enginemarkierungen,
} from "../komponenten/useEngineMarkierungen";
import { useFalle, type Fallenstand } from "../komponenten/useFalle";
import { useGesehen } from "../komponenten/useGesehen";
import { Erklaerkarte } from "../komponenten/Erklaerkarte";
import { useErklaerung } from "../komponenten/useErklaerung";
import { useHintergrundTipp } from "../komponenten/useHintergrundTipp";
import { useBrettbedienung } from "../komponenten/useBrettbedienung";
import { useNachspielen } from "../komponenten/useNachspielen";
import { buchmarkierungen } from "../komponenten/buchmarkierungen";
import { Werkzeugkarte } from "../komponenten/Werkzeugkarte";
import { Werkzeugzusatz } from "../komponenten/Werkzeugzusatz";
import { hatSicht, werkzeugergebnis } from "../komponenten/werkzeugergebnis";
import { useSicht, type Sicht } from "../komponenten/useSicht";
import { Brettsymbole } from "../komponenten/Brettsymbole";
import { Reiterleiste, Werkzeugleiste, type Werkzeugwahl } from "../komponenten/Werkzeugleiste";
import { useWerkzeugwahl } from "../komponenten/useWerkzeugwahl";
import { WarumFragen } from "../komponenten/WarumFrage";
import { Zugleiste } from "../komponenten/Zugleiste";

/** Knöpfe für die vorige und nächste Abbildung im selben Kapitel. */
function Blaettern({ kapitel, nummer }: { kapitel: Kapitel; nummer: string }) {
  const { ersetze } = useNavigation();
  const stelle = kapitel.abbildungen.findIndex((a) => a.id === nummer);
  const vorige = kapitel.abbildungen[stelle - 1];
  const naechste = kapitel.abbildungen[stelle + 1];
  return (
    <>
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
    </>
  );
}

/** So viele Halbzüge der Hauptvariante bekommt k7-motiv (Schlüsselzug und Fortsetzung). */
const FORTSETZUNG_HALBZUEGE = 8;

/**
 * Karten unter dem Brett: zuerst die Kacheln des gewählten Werkzeugs (Werkzeugergebnis und die
 * Engine-Kacheln), dann die Warum-Fragen, dann Unterschrift und Fundstelle (Wunsch des Autors
 * nach dem Test von 0.2.26).
 */
function Karten({
  kapitel,
  abbildung,
  hier,
  stellung,
  wahl,
  ergebnis,
  falle,
  gegnerplan,
  erzwingend,
  ruhe,
  enginebrett,
  letzterZug,
  naechsterZug,
  sicht,
}: {
  kapitel: Kapitel;
  abbildung: AbbildungDaten;
  hier: AbbildungDaten | null;
  stellung: Stellung;
  wahl: Werkzeugwahl | null;
  ergebnis: Werkzeugergebnis | null;
  falle: Fallenstand;
  gegnerplan: Enginemarkierungen;
  erzwingend: Enginemarkierungen;
  ruhe: Enginemarkierungen;
  enginebrett: Enginemarkierungen;
  letzterZug: LetzterZug | null;
  naechsterZug: string | null;
  sicht: Sicht;
}) {
  const { navigiere } = useNavigation();
  const erklaerung = useErklaerung(wahl);
  return (
    <div className="abbildung-karten">
      {erklaerung.sichtbar && (wahl === "zaehlen" || wahl === "ziehen") && (
        <Erklaerkarte werkzeug={wahl} ausblenden={erklaerung.ausblenden} />
      )}
      {wahl === "zaehlen" && !ergebnis && !erklaerung.sichtbar && (
        <p className="hinweis">{t("abbildung.tippeFeld")}</p>
      )}
      {ergebnis && (
        <Werkzeugkarte
          key={ergebnis.werkzeug}
          ergebnis={ergebnis}
          sicht={hatSicht(ergebnis.werkzeug) ? sicht : null}
          zusatz={
            // Engine in derselben Karte: „Gegner?“ (Vorschlag D4), „Erzwingende Züge“ (B1),
            // Nachrechnung der Zentrumsbauern bei der Zielbilanz (C1.1).
            <Werkzeugzusatz
              wahl={wahl}
              stellung={stellung}
              eigen={sicht.farbe}
              beiGegnerplan={gegnerplan.setzeMarkierungen}
              beiErzwingend={erzwingend.setzeMarkierungen}
            />
          }
        />
      )}
      {!stellung.regeln && <p className="hinweis">{t("abbildung.lehrbild")}</p>}
      {wahl === "engine" && stellung.regeln && (
        <EngineKarte
          key={stellung.fen}
          stellung={stellung}
          letzterZug={letzterZug}
          beiMarkierungen={enginebrett.setzeMarkierungen}
        />
      )}
      {wahl === "k4-prueffragen" && stellung.regeln && naechsterZug && (
        <AntwortenKarte
          key={`${stellung.fen} ${naechsterZug}`}
          stellung={stellung}
          geplant={naechsterZug}
        />
      )}
      {wahl === "k7-ruhe" && stellung.regeln && (
        <RuheKarte
          key={stellung.fen}
          stellung={stellung}
          beiMarkierungen={ruhe.setzeMarkierungen}
        />
      )}
      {falle.angebot && (
        <FalleKarte
          key={`${stellung.fen} ${falle.angebot.uci}`}
          stellung={stellung}
          angebot={falle.angebot}
          beiMarkierungen={falle.setzeMarkierungen}
        />
      )}
      <WarumFragen hier={hier} />
      {stellung.regeln && spielbar(stellung.fen) && (
        <button
          type="button"
          className="knopf-zweit"
          onClick={() =>
            navigiere({
              bildschirm: "spielen",
              startFen: stellung.fen,
              ...(hier ? { abbildung: hier.id } : {}),
            })
          }
        >
          {t("abbildung.gegenEngine")}
        </button>
      )}
      {hier && hier.id !== abbildung.id && (
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => navigiere({ bildschirm: "abbildung", nummer: hier.id })}
        >
          {t("abbildung.andereOeffnen", { nummer: hier.id })}
        </button>
      )}
      <Unterschrift
        nummer={abbildung.id}
        teile={abbildung.unterschrift}
        beiVerweis={(nummer) => navigiere({ bildschirm: "abbildung", nummer })}
      />
      {abbildung.abschnitt && (
        <p className="fundstelle">
          {t("abbildung.fundstelle", {
            kapitel: kapitel.kapitel,
            abschnitt: `${abbildung.abschnitt.nummer} ${abbildung.abschnitt.titel}`,
          })}
        </p>
      )}
    </div>
  );
}

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
          <Brettsymbole kapitel={kapitel.kapitel} mitRegeln={mitRegeln} werkzeug={werkzeug} />
        }
        skelett={skelettAn}
      />
      {/* Lehrbilder ohne König (Kapitel 0 und 5): keine Bündel, am Brett nur „Zählen“. */}
      <Werkzeugleiste kapitel={kapitel.kapitel} mitRegeln={mitRegeln} werkzeug={werkzeug} />
      {werkzeug.buendel && (
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

export function Abbildung({ nummer }: { nummer: string }) {
  const kapitelnummer = Number(nummer.split(".")[0]);
  const kapitel = useDaten(() => ladeKapitel(kapitelnummer), `kapitel-${kapitelnummer}`);
  const abbildung =
    kapitel.art === "fertig" ? kapitel.wert.abbildungen.find((a) => a.id === nummer) : undefined;
  return (
    <div className="bildschirm bildschirm-abbildung">
      <Kopfzeile
        titel={t("abbildung.titel", { nummer })}
        zurueckText={t("abbildung.zurueck")}
        rechts={
          kapitel.art === "fertig" ? <Blaettern kapitel={kapitel.wert} nummer={nummer} /> : null
        }
      />
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
