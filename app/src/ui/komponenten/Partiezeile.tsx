/**
 * Eine Zeile der Partienliste (seit 0.2.142 neu aufgebaut, Wunsch des Autors vom 25.10.2026: „zu
 * unübersichtlich“).
 *
 * Rolle im Gesamtbild: Links der Gegner (Porträt, darunter sein Name), rechts auf einen Blick
 * Ergebnis, gespielte Farbe, Zeitart und die Zahlen beider Seiten (Spielstärke in der Partie, sonst
 * Genauigkeit); klein darunter Datum und Züge. Das eigene Porträt und der eigene Name stehen nicht
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
import type { Seitenbilanz } from "../../spiel/genauigkeit";
import type { Partie } from "../../spiel/partie";
import { staerkeDerPartie } from "../../spiel/wertung";
import { zeitklasse } from "../../spiel/zeitklasse";
import { Figur } from "../brett/Figur";
import { BRETTFARBEN, FELD } from "../brett/masse";
import { Ergebnismarke } from "./Ergebnismarke";
import { GegnerBild } from "./GegnerBild";
import { Knopfsymbol } from "./Knopfsymbol";
import { Stufenmarke } from "./Stufenmarke";
import { ZEITARTZEICHEN } from "./zeitartzeichen";

/** Größe der Figur für die gespielte Farbe (Bildpunkte). */
const FIGURGROESSE = 26;
/** Größe der Platzhalterzeichen statt Porträt und des Zeichens der Zeitart. */
const PLATZHALTER = 24;
const ZEITARTSYMBOL = 15;
const LOESCHSYMBOL = 20;
const WERTUNGSSYMBOL = 15;
const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;

/**
 * Zeitart mit Zeichen wie in der Bedenkzeit-Auswahl: „⚡ Blitz 3 + 2“; ohne Uhr nichts. Bullet (nur
 * eingelesene Partien) trägt das Blitz-Zeichen, der Text sagt „Bullet“. `mitPunkt`: in einer
 * Textzeile („Weiterspielen“) mit „ · “ davor.
 */
export function Zeitangabe({ partie, mitPunkt = false }: { partie: Partie; mitPunkt?: boolean }) {
  const uhr = partie.einstellung.uhr;
  const klasse = zeitklasse(uhr);
  if (!uhr || !klasse) return null;
  const Zeichen = ZEITARTZEICHEN[wertungstempo(uhr)];
  return (
    <span className="partie-zeitart">
      {mitPunkt && " · "}
      <Zeichen size={ZEITARTSYMBOL} aria-hidden="true" />
      {t("spielen.zeitangabe", {
        klasse: t(`zeitklasse.${klasse}`),
        minuten: uhr.grundzeitMs / MINUTE_MS,
        sekunden: uhr.zuschlagMs / SEKUNDE_MS,
      })}
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
      name: t("spielen.gegner.mensch"),
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

/** „≈ 1450“ oder „78 %“; null ohne Zahl. */
function seitenwert(b: Seitenbilanz): string | null {
  if (b.spielstaerke !== null) return t("spielen.zahlStaerke", { wert: b.spielstaerke });
  if (b.genauigkeit !== null) return t("spielen.zahlGenau", { wert: Math.round(b.genauigkeit) });
  return null;
}

/**
 * Die Zahlen beider Seiten, die eigene zuerst: „≈ 1450 vs ≈ 1520“; bei Mensch gegen Mensch Weiß vs
 * Schwarz. Ohne Auswertung nichts.
 */
function Zahlen({ eintrag }: { eintrag: Partieeintrag }) {
  const staerke = staerkeDerPartie(eintrag);
  if (!staerke) return null;
  const e = eintrag.partie.einstellung;
  const ich = e.eigeneFarbe;
  const andere = ich === "white" ? "black" : "white";
  const links = seitenwert(staerke[ich]);
  const rechts = seitenwert(staerke[andere]);
  if (!links && !rechts) return null;
  const vorlesen = t("spielen.zahlenVorlesen", { ich: links ?? "–", gegner: rechts ?? "–" });
  return (
    <span className="partie-zahlen" aria-label={vorlesen}>
      <strong>{links ?? "–"}</strong>
      <span className="partie-zahlen-vs" aria-hidden="true">
        {t("spielen.vs")}
      </span>
      <strong>{rechts ?? "–"}</strong>
    </span>
  );
}

/** „25.10.2026 · 32 Züge“ (Einzahl „1 Zug“). */
function kleingedruckt(partie: Partie): string {
  const datum = datumText(new Date(partie.begonnen));
  const zuege = Math.ceil(partie.zuege.length / 2);
  return t(zuege === 1 ? "spielen.partieKleinEinZug" : "spielen.partieKlein", { datum, zuege });
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
 * Die Zeile. Beispiel: Sieg mit Weiß gegen Tom im Blitz → links Toms Porträt und „Tom“, rechts
 * Pokal „1–0“, weißer König, „⚡ Blitz 3 + 2“, Stern; darunter „≈ 1450 vs ≈ 1320“, klein
 * „25.10.2026 · 32 Züge“.
 */
export function Partiezeile({ eintrag }: { eintrag: Partieeintrag }) {
  const { navigiere } = useNavigation();
  const { partie } = eintrag;
  const gegner = useGegner(partie);
  return (
    <li className="partieeintrag">
      <button
        type="button"
        className="begriff-knopf partiezeile"
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
            <Zeitangabe partie={partie} />
            {partie.einstellung.gewertet && (
              <Star
                className="partiezeile-wertung"
                size={WERTUNGSSYMBOL}
                aria-label={t("spielen.partieGewertet")}
                role="img"
              />
            )}
          </span>
          <Zahlen eintrag={eintrag} />
          <span className="partie-klein">{kleingedruckt(partie)}</span>
        </span>
      </button>
      {!partie.einstellung.gewertet && <Loeschen partie={partie} />}
    </li>
  );
}
