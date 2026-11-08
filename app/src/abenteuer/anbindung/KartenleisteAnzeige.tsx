/**
 * Die Kartenleiste in der Partie: das Deck des Abenteuers als Knöpfe, jede Karte einmal je Partie
 * (Regelwerk R23, R24; Baustein F3). Der Eintrag für die Partie-Erweiterungen steht in
 * Kartenleiste.tsx.
 *
 * Rolle im Gesamtbild: App-Seite der Modulgrenze (nutzt Engine, Werkzeuge und Speicher der App);
 * die Regeln (spielbar, verbuchen) kommen aus regeln/karten.ts, die Sorten aus dem Zusatzpaket.
 * Wirkungen: Fingerzeig markiert das Startfeld des besten Zuges, Gefahrenradar die bedrohten
 * eigenen Figuren (Warnsignale, Kapitel 4), Zweite Chance nimmt den letzten eigenen Zug samt
 * Antwort zurück, Flüstern zeigt drei Kandidaten als Pfeile, Mentor-Zug spielt den besten Zug.
 * Sprüche (Schritt 13): Kühler Kopf und Grübelfalle verschieben Bedenkzeit, Großes Maul setzt
 * gefühlte Zeitnot (anbindung/spruchkarte.ts); nur gegen Straßengegner, Zeitkarten nur mit Uhr.
 * Abhängigkeiten: engine/engineDienst.ts, analyse/k4-warnsignale.ts, schach/stellung.ts,
 * spiel/zuege.ts, speicher (Spielstand), daten/laden.ts (Kartensorten), regeln/karten.ts, i18n.
 */
import { useEffect, useState } from "react";
import { warnsignale } from "../../analyse/k4-warnsignale";
import type { Markierung } from "../../analyse/werkzeug";
import { AuftragAbgebrochen, engine } from "../../engine/engineDienst";
import { t } from "../../i18n/sprache";
import { stellungAusFen } from "../../schach/stellung";
import { mitLaufender } from "../../speicher/partien";
import { aendere } from "../../speicher/speicher";
import { leserAmZug, type Partie } from "../../spiel/partie";
import { uciZuSan } from "../../spiel/zuege";
import { ladeSpieldaten, type Gegnerdaten, type Kartendaten } from "../daten/laden";
import { kartenSpielbar, mitGespielterKarte } from "../regeln/karten";
import { passtZurPartie, spruecheErlaubt } from "../regeln/zeitkarten";
import { spieleZeitkarte } from "./spruchkarte";
import type { Kartensorte } from "../schnittstelle/karten";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import type { Leisteneigenschaften } from "../schnittstelle/modul";
import { tSpiel } from "../texte/texte";
import { useAbenteuerstand } from "./dienste";

/** Rechenzeiten der Karten in Millisekunden (R23: Fingerzeig Tiefe 12, Mentor-Zug Tiefe 14). */
const FINGERZEIG_MS = 1500;
const FLUESTERN_MS = 2500;
const MENTOR_MS = 3000;
const KANDIDATEN = 3;

/** Dialogvariable: Ambrose hat beim ersten Spruch erklärt, wo Sprüche hingehören. */
const SPRUCH_ERKLAERT = "spruchErklaert";

/** Merkt sich im Spielstand, dass Ambrose die Sprüche erklärt hat. */
function mitErklaerung(stand: Abenteuerstand, erklaert: boolean): Abenteuerstand {
  if (!erklaert) return stand;
  return { ...stand, dialogvariablen: { ...stand.dialogvariablen, [SPRUCH_ERKLAERT]: true } };
}

/** Die eigenen Züge der Partie (für „Zweite Chance erst nach dem ersten eigenen Zug“). */
function eigeneZuege(partie: Partie): number {
  return partie.zuege.filter((z) => z.von === "leser").length;
}

/** Nimmt den letzten eigenen Zug samt Antwort zurück, unabhängig von `ruecknahmeErlaubt`. */
function zurueckOhneErlaubnis(partie: Partie): Partie {
  const zuege = [...partie.zuege];
  while (zuege.length > 0 && zuege[zuege.length - 1]?.von !== "leser") zuege.pop();
  zuege.pop();
  return { ...partie, zuege, ende: null, ruecknahmen: partie.ruecknahmen + 1 };
}

/** Der Fingerzeig: nur das Startfeld des besten Zuges. */
async function fingerzeig(fen: string): Promise<Markierung[]> {
  const bewertung = await engine.bewerte(fen, FINGERZEIG_MS, 1);
  const uci = bewertung.besterZug;
  return uci ? [{ typ: "feld", farbe: "gold", feld: uci.slice(0, 2) }] : [];
}

/** Flüstern: die drei besten Kandidaten als Pfeile, ohne Reihenfolge. */
async function fluestern(fen: string): Promise<Markierung[]> {
  const bewertung = await engine.bewerte(fen, FLUESTERN_MS, KANDIDATEN);
  return bewertung.varianten.flatMap((v) => {
    const uci = v.zuege[0];
    return uci
      ? [
          {
            typ: "pfeil" as const,
            farbe: "gold" as const,
            von: uci.slice(0, 2),
            nach: uci.slice(2, 4),
          },
        ]
      : [];
  });
}

/** Gefahrenradar: die roten Markierungen der Warnsignale (eigene bedrohte Figuren). */
function gefahrenradar(fen: string, eigene: Partie["einstellung"]["eigeneFarbe"]): Markierung[] {
  const stellung = stellungAusFen(fen);
  if (!stellung.ok) return [];
  return warnsignale(stellung.wert, eigene).markierungen.filter((m) => m.farbe === "rot");
}

export function KartenleisteAnzeige({
  partiekennung,
  steuerung,
  beiMarkierungen,
}: Leisteneigenschaften) {
  const stand = useAbenteuerstand();
  const [sorten, setzeSorten] = useState<readonly Kartendaten[]>([]);
  const [gegnerliste, setzeGegnerliste] = useState<readonly Gegnerdaten[]>([]);
  const [laeuft, setzeLaeuft] = useState<string | null>(null);
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const begegnung = partiekennung.split("#")[0] ?? partiekennung;

  useEffect(() => {
    let aktiv = true;
    ladeSpieldaten()
      .then((d) => {
        if (!aktiv) return;
        setzeSorten(d.karten);
        setzeGegnerliste(d.gegner);
      })
      .catch(() => undefined);
    return () => {
      aktiv = false;
    };
  }, []);

  const partie = steuerung.partie;
  const karten = stand?.partiekarten ?? null;
  // Sichtbarer Zustand des Gegners (R8, R9): „Coach Delgado ist überheblich geworden.“
  const zustand = stand?.laufendeWertung?.zustand ?? null;
  const zustandszeile = zustand && (
    <span className="abenteuer-zustand" data-testid="abenteuer-zustand">
      {t("abenteuer.zustand", { gegner: tSpiel(zustand.gegner), zustand: tSpiel(zustand.grund) })}
    </span>
  );
  if (!stand || !partie || !karten || karten.deck.length === 0) {
    return (
      <aside className="abenteuer-kartenleiste" data-testid="abenteuer-kartenleiste">
        <strong>{t("abenteuer.kartenleiste")}</strong>
        {zustandszeile}
        <span>{t("abenteuer.kartenleisteHinweis", { begegnung })}</span>
      </aside>
    );
  }

  const lage = {
    leserAmZug: leserAmZug(partie),
    engineDenkt: steuerung.engineDenkt,
    beendet: partie.ende !== null,
    halbzug: partie.zuege.length,
    eigeneZuege: eigeneZuege(partie),
  };
  const gegner = gegnerliste.find((g) => g.kennung === karten.gegner);
  const partielage = {
    uhr: partie.uhr !== null,
    sprueche: spruecheErlaubt(gegner?.rolle ?? null),
  };

  /** Spielt eine Karte: Wirkung ausführen, dann im Spielstand verbuchen. */
  const spiele = async (sorte: Kartensorte) => {
    setzeLaeuft(sorte.kennung);
    setzeMeldung(null);
    let zeilen: readonly string[] = [];
    try {
      const fen = steuerung.fen;
      switch (sorte.wirkung.art) {
        case "fingerzeig":
          beiMarkierungen(await fingerzeig(fen));
          break;
        case "gefahrenradar":
          beiMarkierungen(gefahrenradar(fen, partie.einstellung.eigeneFarbe));
          break;
        case "fluestern":
          beiMarkierungen(await fluestern(fen));
          break;
        case "mentorzug": {
          const bewertung = await engine.bewerte(fen, MENTOR_MS, 1);
          const san = bewertung.besterZug ? uciZuSan(fen, bewertung.besterZug) : null;
          if (san) steuerung.spieleLeser(san);
          break;
        }
        case "zweiteChance":
          await aendere((d) => ({
            ...d,
            spiel: mitLaufender(d.spiel, zurueckOhneErlaubnis(partie)),
          }));
          break;
        case "zeit":
        case "zeitnot": {
          const folge = spieleZeitkarte(partie, sorte, gegner);
          await aendere((d) => ({ ...d, spiel: mitLaufender(d.spiel, folge.partie) }));
          zeilen = folge.zeilen;
          break;
        }
        default:
          break;
      }
      // Beim ersten Spruch erklärt Ambrose, wo Sprüche hingehören (docs/spiel/10, S2).
      const ersterSpruch =
        sorte.spruch_art === true && stand.dialogvariablen[SPRUCH_ERKLAERT] !== true;
      await aendere((d) => ({
        ...d,
        abenteuer: d.abenteuer
          ? mitErklaerung(mitGespielterKarte(d.abenteuer, sorte, lage.halbzug), ersterSpruch)
          : d.abenteuer,
      }));
      const text = zeilen.length > 0 ? zeilen.join(" ") : tSpiel(sorte.spruch);
      setzeMeldung(ersterSpruch ? `${text} ${tSpiel("spruch.ambrose.ersterSpruch")}` : text);
    } catch (fehler) {
      if (!(fehler instanceof AuftragAbgebrochen)) setzeMeldung(t("abenteuer.karteFehler"));
    } finally {
      setzeLaeuft(null);
    }
  };

  return (
    <aside className="abenteuer-kartenleiste" data-testid="abenteuer-kartenleiste">
      <strong>{t("abenteuer.kartenleiste")}</strong>
      {zustandszeile}
      {karten.deck.map((kennung) => {
        const sorte = sorten.find((s) => s.kennung === kennung) as Kartensorte | undefined;
        if (!sorte) return null;
        const gespielt = karten.gespielt.some((k) => k.kennung === kennung);
        const erlaubt =
          laeuft === null &&
          kartenSpielbar(karten, sorte, lage) &&
          passtZurPartie(sorte, partielage);
        return (
          <button
            key={kennung}
            type="button"
            className="abenteuer-karte"
            disabled={!erlaubt}
            aria-pressed={gespielt}
            data-testid={`abenteuer-karte-${kennung}`}
            onClick={() => void spiele(sorte)}
          >
            {tSpiel(sorte.name)}
            {gespielt && " ✓"}
          </button>
        );
      })}
      {meldung && <span className="abenteuer-karte-meldung">{meldung}</span>}
    </aside>
  );
}
