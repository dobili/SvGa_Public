/**
 * Auswahl für „Zug erraten“: Quelle der Partien, Partie und Seite.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (30.10.2026): Neben den Meisterpartien aus Kapitel 11
 * gibt es berühmte Klassiker und aktuelle Turnierpartien (training/zusatzpartien.ts). Die Quelle
 * „Aus dem Buch“ bleibt die Vorgabe; die beiden anderen laden public/daten/zusatzpartien.json erst,
 * wenn der Leser sie wählt. Zusatzpartien tragen sichtbar „Zusatzinhalt (nicht aus dem Buch)“ mit
 * Kurztext, Quelle und Lizenz (Zusatzkarte).
 * Abhängigkeiten: training/zusatzpartien.ts, daten/laden.ts, Auswahlliste, Zusatzkarte, i18n.
 */
import type { Color } from "chessops/types";
import { useState } from "react";
import { ladeZusatzpartien } from "../../daten/laden";
import { sprache, t, type Textschluessel } from "../../i18n/sprache";
import type { Ratepartie } from "../../training/studientrainer";
import { PARTIEQUELLEN, zusatzaufgaben, type Partiequelle } from "../../training/zusatzpartien";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Auswahlliste } from "./Auswahlliste";
import { Zusatzkarte } from "./Zusatzkarte";

const SEITEN: readonly Color[] = ["white", "black"];
const QUELLENTEXT: Readonly<Record<Partiequelle, Textschluessel>> = {
  buch: "zugerraten.quelleBuch",
  klassiker: "zugerraten.quelleKlassiker",
  turnier: "zugerraten.quelleTurnier",
};

/** Eine Reihe Chips: Quelle oder Seite. */
function Chipwahl<T extends string>({
  titel,
  werte,
  text,
  wert,
  setze,
  testkennung,
}: {
  titel: string;
  werte: readonly T[];
  text: (wert: T) => string;
  wert: T;
  setze: (wert: T) => void;
  testkennung?: string;
}) {
  return (
    <fieldset className="zahlwahl" data-testid={testkennung}>
      <legend>{titel}</legend>
      {werte.map((w) => (
        <button
          key={w}
          type="button"
          className="chip"
          aria-pressed={wert === w}
          onClick={() => setze(w)}
        >
          {text(w)}
        </button>
      ))}
    </fieldset>
  );
}

/** Liste der Partien einer Quelle, Seite, Karte zur gewählten Zusatzpartie und Startknopf. */
function Partieliste({
  liste,
  seite,
  setzeSeite,
  starte,
}: {
  liste: readonly Ratepartie[];
  seite: Color;
  setzeSeite: (seite: Color) => void;
  starte: (aufgabe: Ratepartie) => void;
}) {
  const [index, setzeIndex] = useState(0);
  const gewaehlt = liste[index] ?? null;
  return (
    <>
      <Auswahlliste
        titel={t("zugerraten.partie")}
        eintraege={liste.map((p, i) => ({ wert: String(i), text: p.titel }))}
        wert={String(index)}
        setze={(i) => setzeIndex(Number(i))}
        testkennung="zugerraten-partieliste"
      />
      {gewaehlt?.zusatz && <Zusatzkarte partie={gewaehlt.zusatz} />}
      <Chipwahl
        titel={t("repertoiretrainer.seite")}
        werte={SEITEN}
        text={(s) => t(s === "white" ? "farbe.w" : "farbe.b")}
        wert={seite}
        setze={setzeSeite}
      />
      <button
        type="button"
        className="knopf-haupt"
        disabled={gewaehlt === null}
        onClick={() => gewaehlt && starte(gewaehlt)}
      >
        <Knopfsymbol art="starten" />
        {t("taktiktrainer.starten")}
      </button>
    </>
  );
}

/** Die Zusatzpartien einer Quelle: erst laden, dann wie die Buchpartien wählen. */
function Zusatzliste({
  quelle,
  ...rest
}: {
  quelle: Exclude<Partiequelle, "buch">;
  seite: Color;
  setzeSeite: (seite: Color) => void;
  starte: (aufgabe: Ratepartie) => void;
}) {
  const daten = useDaten(ladeZusatzpartien, "zusatzpartien");
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return (
      <p className="fehlertext">{t("zugerraten.zusatzLadefehler", { fehler: daten.meldung })}</p>
    );
  return (
    <Partieliste liste={zusatzaufgaben(daten.wert, quelle, rest.seite, sprache())} {...rest} />
  );
}

/**
 * Auswahl von Quelle, Partie und Seite für „Zug erraten“.
 *
 * Eingaben: die gewählte Quelle (bleibt beim Zurückkehren zur Auswahl stehen), die Buchpartien
 * je Seite und der Start einer Partie.
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
  const [seite, setzeSeite] = useState<Color>("white");
  const auswahl = { seite, setzeSeite, starte };
  return (
    <div
      className="trainerrunde trainerwahl"
      data-testid="zugerraten-wahl"
      data-tour="trainer-wahl"
    >
      <Chipwahl
        titel={t("zugerraten.quelle")}
        werte={PARTIEQUELLEN}
        text={(q) => t(QUELLENTEXT[q])}
        wert={quelle}
        setze={setzeQuelle}
        testkennung="zugerraten-quelle"
      />
      {quelle === "buch" ? (
        <Partieliste key="buch" liste={buchpartien(seite)} {...auswahl} />
      ) : (
        <Zusatzliste key={quelle} quelle={quelle} {...auswahl} />
      )}
    </div>
  );
}
