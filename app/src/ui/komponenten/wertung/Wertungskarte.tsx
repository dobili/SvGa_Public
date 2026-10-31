/**
 * Karte „Deine Wertung“ im Profil (Profil neu, Entwurf W3 „Drei Kacheln“, Wahl des Autors
 * 31.10.2026): oben je Zeitklasse eine Kachel mit Zahl und Zahl der Partien, darunter die Kurve
 * der gewählten Zeitklasse im selben Maßstab wie die Zahl, dann die Phasen als Balken.
 *
 * Rolle im Gesamtbild: Ersetzt die frühere Karte mit drei Reiterzeilen und dem Maßstab in der
 * Karte (fortschritt/Wertungskurve.tsx). Der Maßstab (Lichess, chess.com, FIDE) wird einmal in den
 * Einstellungen gewählt (Reiter „Anzeige“) und bleibt gespeichert wie bisher; die Karte sagt nur,
 * welcher gilt. Zeitklassen ohne eigene Partie zeigen eine markierte Schätzung
 * (wertungskacheln.ts). Ohne jede gewertete Partie steht ein Leerzustand da (Weniger Text P1:
 * leere Zeitkacheln, eine Zeile, „Erste Partie“); die Regeln stehen im ⓘ der Überschrift (P2). Ausschnitt,
 * Erklärung und „Wertung zurücksetzen“ liegen im aufklappbaren Bereich „Mehr“ (Wertungsdetail.tsx).
 * Seit dem 31.10.2026 zurückgeholt: „Aus deinen Zügen“ unter den Kacheln (Zugschaetzung.tsx), der
 * Verlauf je Phase (Tipp auf einen Phasenbalken) und der Hinweis, welche Partien zählen.
 * Abhängigkeiten: wertungskacheln.ts, Wertungsdetail.tsx, Phasenbalken.tsx, Zugschaetzung.tsx,
 * fortschritt/wertungsmassstab.ts, fortschritt/wertungstext.ts, Navigation, i18n,
 * Stil in ui/stil/wertungskarte.css.
 */
import { Play } from "lucide-react";
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t, tZahl } from "../../../i18n/sprache";
import type { Wertungstempo } from "../../../spiel/elomodell";
import type { Partieeintrag } from "../../../speicher/partien";
import type { Wertungspunkt } from "../../../spiel/wertung";
import "../../stil/wertungskarte.css";
import { MitInfoblase } from "../bausteine/Infoblase";
import { Leerzustand } from "../bausteine/Leerzustand";
import { Titelsymbol } from "../bausteine/Titelsymbol";
import { useWertungsmassstab, type Wertungsmassstab } from "../fortschritt/wertungsmassstab";
import { zeitklassenname } from "../fortschritt/wertungstext";
import { ausschnittsbereich, STANDARD_AUSSCHNITT } from "./ausschnitte";
import { Phasenbalken } from "./Phasenbalken";
import { Wertungsdetail } from "./Wertungsdetail";
import { Zugschaetzung } from "./Zugschaetzung";
import {
  startklasse,
  wertungskacheln,
  zahlInMassstab,
  type Wertungskachel,
} from "./wertungskacheln";

/** Steht für eine Zahl ohne Entsprechung im Maßstab. */
const OHNE_ZAHL = "–";

/** Die Zahl einer Kachel als Text: „1310“, „≈ 1460“ oder „–“. */
function kachelzahl(kachel: Wertungskachel, massstab: Wertungsmassstab): string {
  const zahl = kachel.wert === null ? null : zahlInMassstab(kachel.tempo, kachel.wert, massstab);
  if (zahl === null) return OHNE_ZAHL;
  return kachel.geschaetzt ? t("profil.wertung.ungefaehr", { zahl }) : String(zahl);
}

/**
 * Überschrift „Deine Wertung“ mit ⓘ (Weniger Text P2, 31.10.2026): Die Regeln, welche Partien
 * zählen, und dass die Wertung je Zeitklasse getrennt steht, stehen vollständig in der Blase.
 */
function TitelMitRegeln() {
  return (
    <MitInfoblase
      zeile={
        <h2 className="karte-titel">
          <Titelsymbol art="wertung" />
          {t("profil.wertung.titel")}
        </h2>
      }
      thema={t("profil.wertung.titel")}
      erklaerung={
        <>
          <p>{t("profil.wertung.einladung")}</p>
          <p>{t("profil.wertung.welchePartien")}</p>
        </>
      }
    />
  );
}

/** Kopf der Karte: Titel mit ⓘ und der gewählte Maßstab mit Hinweis auf die Einstellungen. */
function Kopf({ massstab }: { massstab: Wertungsmassstab }) {
  return (
    <>
      <TitelMitRegeln />
      <p className="hinweis" data-testid="wertung-massstab">
        {t("profil.wertung.massstab", { liste: t(`wertung.massstab.${massstab}`) })}
      </p>
    </>
  );
}

/** Eine Kachel: Zeitklasse, Zahl, „3 Partien“ oder „geschätzt“; ein Tipp wählt sie. */
function Kachel({
  kachel,
  massstab,
  gewaehlt,
  beiWahl,
}: {
  kachel: Wertungskachel;
  massstab: Wertungsmassstab;
  gewaehlt: boolean;
  beiWahl: (tempo: Wertungstempo) => void;
}) {
  const zusatz = kachel.geschaetzt
    ? t("profil.wertung.geschaetzt")
    : tZahl("profil.wertung.partien", kachel.partien, { anzahl: kachel.partien });
  return (
    <button
      type="button"
      className={`wertungskachel${gewaehlt ? " gewaehlt" : ""}${kachel.geschaetzt ? " geschaetzt" : ""}`}
      aria-pressed={gewaehlt}
      data-testid={`wertung-kachel-${kachel.tempo}`}
      onClick={() => beiWahl(kachel.tempo)}
    >
      <span className="wertungskachel-klasse">{zeitklassenname(kachel.tempo)}</span>
      <span className="wertungskachel-zahl" data-testid={`wertung-zahl-${kachel.tempo}`}>
        {kachelzahl(kachel, massstab)}
      </span>
      <span className="wertungskachel-zusatz">{zusatz}</span>
    </button>
  );
}

/**
 * Ohne gewertete Partie: leere Zeitkacheln, „Noch keine Wertung.“ und „Erste Partie“ (Weniger
 * Text P1); der frühere Einladungssatz und die Regeln stehen im ⓘ der Überschrift.
 */
function Einladung() {
  const { wechsleBereich } = useNavigation();
  return (
    <section className="karte wertung" data-testid="wertung" data-tour="einstellungen-wertung">
      <TitelMitRegeln />
      <Leerzustand
        bild="zeitkacheln"
        zeile={t("wenigertext.seiten.wertung.leer")}
        testid="wertung-einladung"
        knopf={{
          text: t("wenigertext.seiten.knopf.erstePartie"),
          symbol: Play,
          beiTipp: () => wechsleBereich("spielen"),
          haupt: true,
        }}
      />
    </section>
  );
}

/**
 * Die Karte. `jetzt` für die Zeiträume (in Tests fest).
 * Beispiel: drei Schnellschach-Partien, Wertung 1500 auf Lichess → Kacheln „≈ 1300 geschätzt“,
 * „1500 · 3 Partien“ (hervorgehoben), „≈ 1650 geschätzt“; darunter die Kurve mit drei Punkten und
 * „vorläufig · 3 von 10“.
 */
export function Wertungskarte({
  punkte,
  partien,
  jetzt = new Date(),
}: {
  punkte: readonly Wertungspunkt[];
  partien: readonly Partieeintrag[];
  jetzt?: Date;
}) {
  const [wahl, setzeWahl] = useState<Wertungstempo | null>(null);
  const [ausschnitt, setzeAusschnitt] = useState(STANDARD_AUSSCHNITT);
  const [massstab] = useWertungsmassstab();
  const kacheln = wertungskacheln(punkte);
  if (punkte.length === 0) return <Einladung />;
  const tempo = startklasse(punkte, wahl);
  const kachel = kacheln.find((k) => k.tempo === tempo);
  return (
    <section className="karte wertung" data-testid="wertung" data-tour="einstellungen-wertung">
      <Kopf massstab={massstab} />
      <div className="wertungskacheln" role="group" aria-label={t("profil.wertung.zeitklassen")}>
        {kacheln.map((k) => (
          <Kachel
            key={k.tempo}
            kachel={k}
            massstab={massstab}
            gewaehlt={k.tempo === tempo}
            beiWahl={setzeWahl}
          />
        ))}
      </div>
      {kachel && !kachel.geschaetzt && (
        <Zugschaetzung partien={partien} tempo={tempo} massstab={massstab} />
      )}
      {kachel && (
        <Wertungsdetail
          kachel={kachel}
          punkte={punkte}
          massstab={massstab}
          jetzt={jetzt}
          ausschnitt={ausschnitt}
          beiAusschnitt={setzeAusschnitt}
        />
      )}
      {kachel && !kachel.geschaetzt && (
        <Phasenbalken
          punkte={punkte}
          partien={partien}
          tempo={tempo}
          massstab={massstab}
          bereich={ausschnittsbereich(ausschnitt)}
          jetzt={jetzt}
        />
      )}
    </section>
  );
}
