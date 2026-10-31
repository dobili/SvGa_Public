/**
 * Auswertung nach der Partie: Zeitleiste der Partie in Momenten und „In Zahlen“ (Entwurf F2
 * „Zeitleiste der Partie“, Wahl des Autors 31.10.2026).
 *
 * Rolle im Gesamtbild: Pflichtenheft 5.3 („Sprung zur ersten klaren Abweichung von der besten
 * Fortsetzung, grobe Patzer markiert“) und 5.2 („In Zug 12 hat die Engine eine Figur hängen
 * lassen. Hast du es gesehen?“). Ziel des Autors: weniger technisch, weniger Text, kein Formular;
 * Einsteiger am Handy, meist dunkel. Aufbau: Fortschritt der Engine, „Die Partie in Momenten“
 * (Verlaufskurve mit Fehlerpunkten und Ausschnitt, darunter die Zeitleiste mit Phasen und
 * Momenten: erste klare Abweichung oder „Gut gespielt!“, Fehler und Patzer, absichtliche Fehler
 * der Engine, Ende; jeder Moment springt aufs Brett), dann „In Zahlen“ (Seitenwahl,
 * Spielstärke, Deine Züge; Zahlen.tsx). Eine Seitenwahl gilt für beide Teile (Voreinstellung die
 * eigene Seite, R55/R56). Ergebnis oben und Knöpfe unten stehen außerhalb (Ergebniskopf.tsx,
 * Partieabschluss.tsx). Die Werte rechnet useAuswertung im Hintergrund, die Urteile
 * spiel/auswertung.ts, die Kennzahlen seitenzahlen.ts.
 * Abhängigkeiten: momente.ts, zeitleiste.ts, Zeitleiste.tsx, Verlaufskurve.tsx, Zahlen.tsx, i18n.
 */
import type { Color } from "chessops/types";
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import type { Theoriequellen } from "../../../schach/theorie";
import type { Zugurteil } from "../../../spiel/auswertung";
import { phasenwechsel, type Phase } from "../../../spiel/phasen";
import type { Partieeintrag } from "../../../speicher/partien";
import { Fortschrittsbalken } from "../bausteine/Fortschrittsbalken";
import { gutGespielt, momente, type Momentkontext } from "./momente";
import type { Seitenzahlen } from "./seitenzahlen";
import { zugtext, type Sprung } from "./sprung";
import type { Auswertungsstand } from "./useAuswertung";
import { Verlaufskurve } from "./Verlaufskurve";
import { Seitenwahl, Zahlen } from "./Zahlen";
import { phasenabschnitte } from "./zeitleiste";
import { Zeitleiste } from "./Zeitleiste";

export type { Sprung } from "./sprung";

const PROZENT = 100;
/** Ab dieser Stufe hat die Engine kein Fehlerprofil mehr; „keinen absichtlichen Fehler“ wäre leer. */
const ERSTE_STUFE_OHNE_PROFIL = 4;

/**
 * Fortschritt der laufenden Auswertung als Balken mit Prozentzahl (R29, Wunsch des Autors).
 * Beispiel: 12 von 48 Stellungen → Balken zu einem Viertel, daneben „25 %“.
 */
function Auswertungsfortschritt({ erledigt, gesamt }: { erledigt: number; gesamt: number }) {
  const prozent = gesamt > 0 ? Math.round((erledigt / gesamt) * PROZENT) : 0;
  return (
    <div className="karte auswertung-fortschritt">
      <p>{t("auswertung.laeuft")}</p>
      <div className="auswertung-fortschritt-zeile">
        <Fortschrittsbalken
          anteil={{ erreicht: erledigt, gesamt }}
          beschriftung={t("auswertung.titel")}
        />
        <span className="auswertung-prozent" data-testid="auswertung-prozent">
          {t("auswertung.prozent", { prozent })}
        </span>
      </div>
    </div>
  );
}

/** Der Satz „keinen absichtlichen Fehler“, nur gegen schwache Stufen mit Fehlerprofil. */
function OhneEnginefehler({ eintrag, gezeigt }: { eintrag: Partieeintrag; gezeigt: boolean }) {
  const e = eintrag.partie.einstellung;
  if (gezeigt || e.gegner !== "engine") return null;
  const niedrigste = Math.min(...Object.values(e.stufenJePhase));
  if (niedrigste >= ERSTE_STUFE_OHNE_PROFIL) return null;
  return <p className="hinweis zeitleiste-hinweis">{t("auswertung.engineOhneFehler")}</p>;
}

/** Eingaben der Auswertung. */
interface AuswertungEigenschaften {
  eintrag: Partieeintrag;
  stand: Auswertungsstand;
  urteile: readonly Zugurteil[];
  /** Phase je Stellung (spiel/phasen.ts), für Kurve, Zeitleiste und Spielstärke je Phase. */
  phasen: readonly Phase[];
  /** Theoriequellen für den Namen der Eröffnung; null, solange nicht geladen. */
  theorie: Theoriequellen | null;
  /** Kennzahlen beider Seiten (seitenzahlen.ts); null vor der Auswertung. */
  zahlen: Readonly<Record<Color, Seitenzahlen>> | null;
  beiSprung: (sprung: Sprung) => void;
}

/** „Die Partie in Momenten“: Überschrift, Seitenwahl, Kurve, Zeitleiste. */
function Momente(p: AuswertungEigenschaften & { seite: Color; beiSeite: (s: Color) => void }) {
  const partie = p.eintrag.partie;
  const kontext: Momentkontext = { partie, urteile: p.urteile, seite: p.seite };
  const alle = momente(kontext);
  const zeichenAn = (index: number) => p.urteile.find((u) => u.index === index)?.zeichen ?? "";
  return (
    <section className="auswertung-abschnitt" data-testid="momente">
      <h2 className="auswertung-ueberschrift">{t("auswertungneu.momente.titel")}</h2>
      <p className="hinweis">{t("auswertungneu.momente.text")}</p>
      <Seitenwahl
        partie={partie}
        seite={p.seite}
        name={t("auswertungneu.momente.seite")}
        beiWahl={p.beiSeite}
      />
      <Verlaufskurve
        werte={p.eintrag.werte}
        urteile={p.urteile}
        wechsel={phasenwechsel(p.phasen)}
        beiStelle={(stelle) => p.beiSprung({ stelle, marken: [] })}
        zugname={(stelle) =>
          stelle === 0
            ? t("rueckblick.startstellung")
            : zugtext(partie, stelle - 1, zeichenAn(stelle - 1))
        }
      />
      <Zeitleiste
        abschnitte={phasenabschnitte(partie, p.phasen, alle)}
        grund={{ eintrag: p.eintrag, urteile: p.urteile, theorie: p.theorie }}
        jePhase={p.zahlen?.[p.seite].jePhase ?? null}
        gedreht={partie.einstellung.eigeneFarbe === "black"}
        gutGespielt={gutGespielt(kontext)}
        beiSprung={p.beiSprung}
      />
      <OhneEnginefehler eintrag={p.eintrag} gezeigt={alle.some((m) => m.art === "engine")} />
    </section>
  );
}

/**
 * Die Auswertung unter einer beendeten Partie. Vor dem Ende der Engine-Rechnung zeigt sie den
 * Fortschritt; ohne Urteile (etwa ein Fehler der Engine) nur diesen Teil.
 */
export function Auswertung(p: AuswertungEigenschaften) {
  const partie = p.eintrag.partie;
  const [seite, setzeSeite] = useState<Color>(partie.einstellung.eigeneFarbe);
  const fertig = p.urteile.length > 0;
  return (
    <div className="auswertung" data-testid="auswertung" data-tour="auswertung">
      {p.stand.art === "laeuft" && (
        <Auswertungsfortschritt erledigt={p.stand.erledigt} gesamt={p.stand.gesamt} />
      )}
      {p.stand.art === "fehler" && <p className="fehlertext">{p.stand.meldung}</p>}
      {/* Ohne Züge (sofort aufgegeben) bleibt ein Satz statt einer leeren Fläche; sonst fehlte
          auch das Tourziel „auswertung“, sobald der Fortschritt verschwindet. */}
      {p.stand.art === "fertig" && !fertig && (
        <p className="karte hinweis" data-testid="auswertung-leer">
          {t("auswertungneu.leer")}
        </p>
      )}
      {fertig && <Momente {...p} seite={seite} beiSeite={setzeSeite} />}
      {fertig && p.zahlen && (
        <Zahlen partie={partie} seite={seite} zahlen={p.zahlen} beiSeite={setzeSeite} />
      )}
    </div>
  );
}
