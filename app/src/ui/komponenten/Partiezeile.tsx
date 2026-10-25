/**
 * Eine Zeile der Partienliste (seit 0.2.142 neu aufgebaut, Wunsch des Autors vom 25.10.2026: „zu
 * unübersichtlich“).
 *
 * Rolle im Gesamtbild: Links der Gegner (Porträt, darunter sein Name), in der Mitte oben Ergebnis,
 * gespielte Farbe, das Zeichen der Zeitart und der Stern, darunter klein Zeitart mit Bedenkzeit,
 * Datum und Züge; rechts groß die Zahlen beider Seiten untereinander (Nachbesserung vom
 * 25.10.2026: kein leerer Raum rechts). Die Zahlen sind die Spielstärke in der Partie, wenn sie für
 * beide Seiten geschätzt werden kann, sonst stets die Genauigkeit beider Seiten. Das eigene Porträt und der eigene Name stehen nicht
 * mehr da: Man ist an jeder Partie beteiligt. Platzhalter statt Porträt: Stufenmarke bei der
 * Engine ohne Bot, ein Dateizeichen bei eingelesenen Partien (Name aus dem PGN), zwei Personen bei
 * Mensch gegen Mensch.
 * Abhängigkeiten: spiel/partie.ts, spiel/wertung.ts, spiel/genauigkeit.ts, speicher/partien.ts,
 * Ergebnismarke, GegnerBild, Stufenmarke, zeitartzeichen.ts, ui/brett (Figur), Navigation, i18n.
 */
import { FileInput, Star, Trash2, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useEinstellungen } from "../../app/einstellungen";
import { useNavigation } from "../../app/navigationsKontext";
import { gegnername } from "../../engine/gegner";
import { stufe } from "../../engine/stufen";
import { datumText, t } from "../../i18n/sprache";
import { ohnePartie, type Partieeintrag } from "../../speicher/partien";
import { aendere, useSpeicher } from "../../speicher/speicher";
import { wertungstempo } from "../../spiel/elomodell";
import type { Partie } from "../../spiel/partie";
import { staerkeDerPartie } from "../../spiel/wertung";
import { zeitklasse } from "../../spiel/zeitklasse";
import { Figur } from "../brett/Figur";
import { BRETTFARBEN, FELD } from "../brett/masse";
import { Ergebnismarke } from "./Ergebnismarke";
import { GegnerBild } from "./GegnerBild";
import { Knopfsymbol } from "./Knopfsymbol";
import { partiezahlen } from "./partiezahlen";
import { Stufenmarke } from "./Stufenmarke";
import { ZEITARTZEICHEN } from "./zeitartzeichen";

/** Größe der Figur für die gespielte Farbe (Bildpunkte). */
const FIGURGROESSE = 26;
/** Größe der Platzhalterzeichen statt Porträt und des Zeichens der Zeitart. */
const PLATZHALTER = 24;
const ZEITARTSYMBOL = 15;
const ZEITZEICHEN = 20;
const LOESCHSYMBOL = 20;
const WERTUNGSSYMBOL = 15;
const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;

/** „Blitz 3 + 2“; null ohne Uhr. */
function zeittext(partie: Partie): string | null {
  const uhr = partie.einstellung.uhr;
  const klasse = zeitklasse(uhr);
  if (!uhr || !klasse) return null;
  return t("spielen.zeitangabe", {
    klasse: t(`zeitklasse.${klasse}`),
    minuten: uhr.grundzeitMs / MINUTE_MS,
    sekunden: uhr.zuschlagMs / SEKUNDE_MS,
  });
}

/** Nur das Zeichen der Zeitart (für Bildschirmleser „Blitz 3 + 2“); ohne Uhr nichts. */
function Zeitzeichen({ partie }: { partie: Partie }) {
  const text = zeittext(partie);
  const uhr = partie.einstellung.uhr;
  if (!text || !uhr) return null;
  const Zeichen = ZEITARTZEICHEN[wertungstempo(uhr)];
  return (
    <span className="partie-zeitzeichen" role="img" aria-label={text} title={text}>
      <Zeichen size={ZEITZEICHEN} aria-hidden="true" />
    </span>
  );
}

/**
 * Zeitart mit Zeichen wie in der Bedenkzeit-Auswahl: „⚡ Blitz 3 + 2“; ohne Uhr nichts. Bullet (nur
 * eingelesene Partien) trägt das Blitz-Zeichen, der Text sagt „Bullet“. `mitPunkt`: in einer
 * Textzeile („Weiterspielen“) mit „ · “ davor.
 */
export function Zeitangabe({ partie, mitPunkt = false }: { partie: Partie; mitPunkt?: boolean }) {
  const text = zeittext(partie);
  const uhr = partie.einstellung.uhr;
  if (!text || !uhr) return null;
  const Zeichen = ZEITARTZEICHEN[wertungstempo(uhr)];
  return (
    <span className="partie-zeitart">
      {mitPunkt && " · "}
      <Zeichen size={ZEITARTSYMBOL} aria-hidden="true" />
      {text}
    </span>
  );
}

/** Ein König in der Farbe, die der Leser gespielt hat; beide bei Mensch gegen Mensch. */
function Seitenfigur({ partie }: { partie: Partie }) {
  const einstellungen = useEinstellungen();
  const mensch = partie.einstellung.gegner === "mensch" && !partie.einstellung.importiert;
  const weiss = partie.einstellung.eigeneFarbe === "white";
  const zeichen = mensch ? ["K", "k"] : [weiss ? "K" : "k"];
  const name = mensch
    ? t("spielen.gegner.mensch")
    : t("spielen.partieSeite", { farbe: t(weiss ? "farbe.w" : "farbe.b") });
  return (
    <svg
      className="seitenfigur"
      viewBox={`0 0 ${FELD * zeichen.length} ${FELD}`}
      width={FIGURGROESSE * zeichen.length}
      height={FIGURGROESSE}
      role="img"
      aria-label={name}
    >
      {zeichen.map((z, i) => (
        <Figur
          key={z}
          zeichen={z}
          x={i * FELD}
          y={0}
          satz={einstellungen.figurensatz}
          farbe={BRETTFARBEN[einstellungen.brettfarben].figur}
        />
      ))}
    </svg>
  );
}

/** Platzhalter statt eines Porträts: ein Zeichen im selben Rahmen. */
function Platzhalter({ children }: { children: ReactNode }) {
  return (
    <span className="gegnerbild">
      <span className="gegner-portraet gegner-zeichen" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

/**
 * Bild und Name des Gegners. Beispiel: Bot Tom → Porträt, „Tom“; eingelesen mit Weiß gegen „Anna“
 * → Dateizeichen, „Anna“; Engine ohne Bot → Stufenmarke, „Stufe 3“.
 */
function useGegner(partie: Partie): { bild: ReactNode; name: string } {
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const e = partie.einstellung;
  if (e.importiert) {
    const name = e.eigeneFarbe === "white" ? e.importiert.schwarz : e.importiert.weiss;
    return {
      bild: (
        <Platzhalter>
          <FileInput size={PLATZHALTER} />
        </Platzhalter>
      ),
      name,
    };
  }
  if (e.gegner === "mensch") {
    return {
      bild: (
        <Platzhalter>
          <Users size={PLATZHALTER} />
        </Platzhalter>
      ),
      name: t("spielen.partieMensch"),
    };
  }
  const stufenname = t("spielen.partieStufe", { nummer: stufe(e.stufe).nummer });
  if (e.bot === null) {
    return {
      bild: (
        <span className="gegnerbild partie-stufe">
          <Stufenmarke stufe={stufe(e.stufe).nummer} />
        </span>
      ),
      name: stufenname,
    };
  }
  const name = gegnername(e.bot, e.botName) ?? stufenname;
  return { bild: <GegnerBild bot={e.bot} eigene={eigene} name={name} />, name };
}

/**
 * Die Zahlen beider Seiten untereinander, die eigene oben und kräftig, darunter „vs …“; bei
 * Mensch gegen Mensch Weiß über Schwarz. Ohne Auswertung nichts.
 */
function Zahlen({ eintrag }: { eintrag: Partieeintrag }) {
  const staerke = staerkeDerPartie(eintrag);
  if (!staerke) return null;
  const ich = eintrag.partie.einstellung.eigeneFarbe;
  const zahlen = partiezahlen(staerke[ich], staerke[ich === "white" ? "black" : "white"]);
  if (!zahlen) return null;
  return (
    <span className="partie-zahlen" aria-label={t("spielen.zahlenVorlesen", zahlen)}>
      <strong>{zahlen.ich}</strong>
      <span className="partie-zahl-gegner">
        <span className="partie-zahlen-vs" aria-hidden="true">
          {t("spielen.vs")}
        </span>{" "}
        {zahlen.gegner}
      </span>
    </span>
  );
}

/** „Blitz 3 + 2 · 25.10.2026 · 32 Züge“ (Einzahl „1 Zug“, ohne Uhr ohne Zeitart). */
function kleingedruckt(partie: Partie): string {
  const datum = datumText(new Date(partie.begonnen));
  const zuege = Math.ceil(partie.zuege.length / 2);
  const rest = t(zuege === 1 ? "spielen.partieKleinEinZug" : "spielen.partieKlein", {
    datum,
    zuege,
  });
  const zeit = zeittext(partie);
  return zeit ? `${zeit} · ${rest}` : rest;
}

/** Löschen einer ungewerteten Partie: Papierkorb, dann Nachfrage in der Zeile. */
function Loeschen({ partie }: { partie: Partie }) {
  const [frage, setzeFrage] = useState(false);
  const datum = datumText(new Date(partie.begonnen));
  if (!frage)
    return (
      <button
        type="button"
        className="knopf-symbol partie-loeschen"
        aria-label={t("spielen.partieLoeschen", { datum })}
        title={t("spielen.partieLoeschen", { datum })}
        onClick={() => setzeFrage(true)}
      >
        <Trash2 size={LOESCHSYMBOL} aria-hidden="true" />
      </button>
    );
  return (
    <div className="partie-nachfrage" role="group" aria-label={t("spielen.partieLoeschenFrage")}>
      <span>{t("spielen.partieLoeschenFrage")}</span>
      <button
        type="button"
        className="knopf-gefahr"
        onClick={() => void aendere((d) => ({ ...d, spiel: ohnePartie(d.spiel, partie.id) }))}
      >
        <Knopfsymbol art="loeschen" />
        {t("spielen.partieLoeschenJa")}
      </button>
      <button type="button" className="knopf-zweit" onClick={() => setzeFrage(false)}>
        {t("loeschen.nein")}
      </button>
    </div>
  );
}

/**
 * Die Zeile. Beispiel: Sieg mit Weiß gegen Tom im Blitz → links Toms Porträt und „Tom“, Mitte
 * Pokal „1–0“, weißer König, ⚡, Stern, klein „Blitz 3 + 2 · 25.10.2026 · 32 Züge“; rechts
 * „≈ 1450“ über „vs ≈ 1320“. Ungewertete Partien tragen unten rechts den Papierkorb.
 */
export function Partiezeile({ eintrag }: { eintrag: Partieeintrag }) {
  const { navigiere } = useNavigation();
  const { partie } = eintrag;
  const gegner = useGegner(partie);
  const loeschbar = !partie.einstellung.gewertet;
  return (
    <li className="partieeintrag">
      <button
        type="button"
        className={
          loeschbar ? "begriff-knopf partiezeile mit-loeschen" : "begriff-knopf partiezeile"
        }
        onClick={() => navigiere({ bildschirm: "partie", id: partie.id })}
      >
        <span className="partie-wer">
          {gegner.bild}
          <span className="partie-wer-name">{gegner.name}</span>
        </span>
        <span className="partie-was">
          <span className="partie-kopf">
            <Ergebnismarke partie={partie} />
            <Seitenfigur partie={partie} />
            <Zeitzeichen partie={partie} />
            {partie.einstellung.gewertet && (
              <Star
                className="partiezeile-wertung"
                size={WERTUNGSSYMBOL}
                aria-label={t("spielen.partieGewertet")}
                role="img"
              />
            )}
          </span>
          <span className="partie-klein">{kleingedruckt(partie)}</span>
        </span>
        <Zahlen eintrag={eintrag} />
      </button>
      {loeschbar && <Loeschen partie={partie} />}
    </li>
  );
}
