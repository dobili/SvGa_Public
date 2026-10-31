/**
 * Startkarte für „Zug erraten“: Quelle der Partien, Partie und Seite als Zeilen (Entwurf G1).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (30.10.2026): Neben den Meisterpartien aus Kapitel 11
 * gibt es berühmte Klassiker und aktuelle Turnierpartien (training/zusatzpartien.ts). Die Quelle
 * „Aus dem Buch“ bleibt die Vorgabe; die beiden anderen laden public/daten/zusatzpartien.json erst,
 * wenn der Leser sie wählt. Zusatzpartien tragen sichtbar „Zusatzinhalt (nicht aus dem Buch)“ mit
 * Kurztext, Quelle und Lizenz (Zusatzkarte).
 * Abhängigkeiten: training/zusatzpartien.ts, daten/laden.ts, Startkarte, Zusatzkarte, i18n.
 */
import type { Color } from "chessops/types";
import { useState } from "react";
import { ladeZusatzpartien } from "../../daten/laden";
import { sprache, t, type Textschluessel } from "../../i18n/sprache";
import type { Ratepartie } from "../../training/studientrainer";
import { PARTIEQUELLEN, zusatzaufgaben, type Partiequelle } from "../../training/zusatzpartien";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { einstellung, seitenzeile, type Einstellung } from "./startkarte/einstellung";
import { Startkarte } from "./startkarte/Startkarte";
import { useGemerkt } from "./startkarte/useGemerkt";
import { Zusatzkarte } from "./Zusatzkarte";

const SEITEN: readonly Color[] = ["white", "black"];
const QUELLENTEXT: Readonly<Record<Partiequelle, Textschluessel>> = {
  buch: "zugerraten.quelleBuch",
  klassiker: "zugerraten.quelleKlassiker",
  turnier: "zugerraten.quelleTurnier",
};

/** Die Zeile „Aus“ mit den drei Quellen der Partien. */
function quellenzeile(quelle: Partiequelle, setze: (q: Partiequelle) => void): Einstellung {
  return einstellung({
    kennung: "quelle",
    titel: t("zugerraten.quelle"),
    symbol: "quelle",
    optionen: PARTIEQUELLEN.map((q) => ({ wert: q, text: t(QUELLENTEXT[q]) })),
    wert: quelle,
    setze,
    testkennung: "zugerraten-quelle",
  });
}

/** Gemeinsame Angaben der Karte: Quelle, Seite und Start. */
interface Kartenwahl {
  readonly quelle: Partiequelle;
  readonly setzeQuelle: (quelle: Partiequelle) => void;
  readonly seite: Color;
  readonly setzeSeite: (seite: Color) => void;
  readonly starte: (aufgabe: Ratepartie) => void;
}

/** Die Startkarte mit Quelle, Partie und Seite; bei Zusatzpartien deren Karte darunter. */
function Partiekarte({
  liste,
  wahl,
  hinweis = null,
}: {
  liste: readonly Ratepartie[];
  wahl: Kartenwahl;
  hinweis?: React.ReactNode;
}) {
  const [index, setzeIndex] = useState("0");
  const gewaehlt = liste[Number(index)] ?? null;
  const partiezeile = einstellung({
    kennung: "partie",
    titel: t("zugerraten.partie"),
    symbol: "partie",
    optionen: liste.map((p, i) => ({ wert: String(i), text: p.titel })),
    wert: index,
    setze: setzeIndex,
    testkennung: "zugerraten-partieliste",
  });
  return (
    <Startkarte
      kennung="zugErraten"
      testkennung="zugerraten-wahl"
      zeilen={[
        quellenzeile(wahl.quelle, wahl.setzeQuelle),
        ...(liste.length > 0 ? [partiezeile] : []),
        seitenzeile(wahl.seite, wahl.setzeSeite),
      ]}
      hinweis={gewaehlt?.zusatz ? <Zusatzkarte partie={gewaehlt.zusatz} /> : hinweis}
      start={{
        zusatz: null,
        gesperrt: gewaehlt === null,
        starte: () => gewaehlt && wahl.starte(gewaehlt),
      }}
    />
  );
}

/** Die Zusatzpartien einer Quelle: erst laden, dann wie die Buchpartien wählen. */
function Zusatzliste({
  quelle,
  wahl,
}: {
  quelle: Exclude<Partiequelle, "buch">;
  wahl: Kartenwahl;
}) {
  const daten = useDaten(ladeZusatzpartien, "zusatzpartien");
  if (daten.art === "fertig")
    return (
      <Partiekarte liste={zusatzaufgaben(daten.wert, quelle, wahl.seite, sprache())} wahl={wahl} />
    );
  const hinweis =
    daten.art === "laedt" ? (
      <p className="lade">…</p>
    ) : (
      <p className="fehlertext">{t("zugerraten.zusatzLadefehler", { fehler: daten.meldung })}</p>
    );
  return <Partiekarte liste={[]} wahl={wahl} hinweis={hinweis} />;
}

/**
 * Startkarte für „Zug erraten“: Quelle, Partie und Seite (Entwurf G1, 31.10.2026).
 *
 * Eingaben: die gewählte Quelle (bleibt beim Zurückkehren zur Auswahl stehen), die Buchpartien
 * je Seite und der Start einer Partie. Die Seite ist gemerkt; die Partie beginnt bei der ersten.
 */
export function Partiewahl({
  quelle,
  setzeQuelle,
  buchpartien,
  starte,
}: {
  quelle: Partiequelle;
  setzeQuelle: (quelle: Partiequelle) => void;
  buchpartien: (seite: Color) => readonly Ratepartie[];
  starte: (aufgabe: Ratepartie) => void;
}) {
  const [seite, setzeSeite] = useGemerkt<Color>("zugErraten", "seite", SEITEN, "white");
  const wahl = { quelle, setzeQuelle, seite, setzeSeite, starte };
  return quelle === "buch" ? (
    <Partiekarte key={`buch-${seite}`} liste={buchpartien(seite)} wahl={wahl} />
  ) : (
    <Zusatzliste key={`${quelle}-${seite}`} quelle={quelle} wahl={wahl} />
  );
}
