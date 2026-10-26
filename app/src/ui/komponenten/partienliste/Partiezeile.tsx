/**
 * Eine Zeile der Partienliste (Wunsch des Autors vom 25.10.2026: die alte Zeile war „zu
 * unübersichtlich“).
 *
 * Rolle im Gesamtbild: Links der Gegner (Porträt, darunter sein Name; gewertete Partien mit einem
 * kleinen goldenen Stern an der Ecke des Porträts, vom Autor am 25.10.2026 so gewählt), in der
 * Mitte oben Ergebnis, gespielte Farbe und das Zeichen der Zeitart, darunter klein Zeitart mit
 * Bedenkzeit, Datum und Züge; rechts die Zahlen beider Seiten als Marken mit König
 * (Nachbesserungen vom 25.10.2026: kein leerer Raum rechts, „grafischer“). Die Zahlen sind die
 * Spielstärke in der Partie, wenn sie für beide Seiten geschätzt werden kann, sonst stets die
 * Genauigkeit beider Seiten. Das eigene Porträt und der eigene Name stehen nicht da: Man ist an
 * jeder Partie beteiligt. Platzhalter statt Porträt: Stufenmarke bei der Engine ohne Bot, ein
 * Dateizeichen bei eingelesenen Partien (Name aus dem PGN), zwei Personen bei Mensch gegen
 * Mensch. Im Löschmodus (PartieLoeschen.tsx) wählt ein Tipp die Zeile aus.
 * Abhängigkeiten: spiel/partie.ts, spiel/wertung.ts, spiel/genauigkeit.ts, speicher/partien.ts,
 * Ergebnismarke, GegnerBild, Stufenmarke, zeitartzeichen.ts, ui/brett (Figur), Navigation, i18n.
 */
import { Check, FileInput, Lock, Star, Users } from "lucide-react";
import { Fragment, useId, type ReactNode } from "react";
import { useEinstellungen } from "../../../app/einstellungen";
import { useNavigation } from "../../../app/navigationsKontext";
import { gegnername } from "../../../engine/gegner";
import { stufe } from "../../../engine/stufen";
import { datumText, t } from "../../../i18n/sprache";
import type { Partieeintrag } from "../../../speicher/partien";
import { useSpeicher } from "../../../speicher/speicher";
import { wertungstempo } from "../../../spiel/elomodell";
import type { Partie } from "../../../spiel/partie";
import { staerkeDerPartie } from "../../../spiel/wertung";
import { zeitklasse } from "../../../spiel/zeitklasse";
import { Figur } from "../../brett/Figur";
import { BRETTFARBEN, FELD } from "../../brett/masse";
import { Ergebnismarke } from "../partie/Ergebnismarke";
import { GegnerBild } from "../gegner/GegnerBild";
import { partiezahlen, type Seitenzahl } from "./partiezahlen";
import { Stufenmarke } from "../gegner/Stufenmarke";
import { ZEITARTZEICHEN } from "../bausteine/zeitartzeichen";

/** Größe der Figur für die gespielte Farbe (Bildpunkte). */
const FIGURGROESSE = 22;
/** Größe der Platzhalterzeichen statt Porträt und des Zeichens der Zeitart. */
const PLATZHALTER = 24;
const ZEITARTSYMBOL = 15;
const ZEITZEICHEN = 20;
const WAHLSYMBOL = 14;
const PROZENT = 100;
const WERTUNGSSYMBOL = 12;
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

/** Größe des Königs vor einer Zahl (Bildpunkte). */
const ZAHLKOENIG = 16;

/** Ein kleiner König in der Farbe einer Seite (Figurensatz und Farben wie auf dem Brett). */
function Koenig({ farbe }: { farbe: "white" | "black" }) {
  const einstellungen = useEinstellungen();
  return (
    <svg viewBox={`0 0 ${FELD} ${FELD}`} width={ZAHLKOENIG} height={ZAHLKOENIG} aria-hidden="true">
      <Figur
        zeichen={farbe === "white" ? "K" : "k"}
        x={0}
        y={0}
        satz={einstellungen.figurensatz}
        farbe={BRETTFARBEN[einstellungen.brettfarben].figur}
      />
    </svg>
  );
}

/** Eine Seite: König, Zahl, bei der Genauigkeit ein schmaler Balken darunter. */
function Seitenmarke({
  farbe,
  zahl,
  eigene,
}: {
  farbe: "white" | "black";
  zahl: Seitenzahl;
  eigene: boolean;
}) {
  return (
    <span className={eigene ? "seitenmarke eigene" : "seitenmarke"}>
      <Koenig farbe={farbe} />
      <span className="seitenmarke-zahl">{zahl.text}</span>
      {zahl.anteil !== null && (
        <span className="seitenmarke-balken">
          <span style={{ inlineSize: `${Math.round(zahl.anteil * PROZENT)}%` }} />
        </span>
      )}
    </span>
  );
}

/**
 * Die Zahlen beider Seiten rechts (Nachbesserung vom 25.10.2026: „grafischer“): klein „Elo“ oder
 * „Genauigkeit“, darunter je Seite eine Marke mit König in ihrer Farbe, die eigene oben und
 * golden gerahmt; bei der Genauigkeit zeigt ein Balken den Anteil. Ohne Auswertung nichts.
 */
function Zahlen({ eintrag, kennung }: { eintrag: Partieeintrag; kennung: string }) {
  const staerke = staerkeDerPartie(eintrag);
  if (!staerke) return null;
  const ich = eintrag.partie.einstellung.eigeneFarbe;
  const andere = ich === "white" ? "black" : "white";
  const zahlen = partiezahlen(staerke[ich], staerke[andere]);
  if (!zahlen) return null;
  const art = t(zahlen.art === "elo" ? "spielen.zahlArtElo" : "spielen.zahlArtGenau");
  return (
    <span className="partie-zahlen">
      <span className="nur-vorlesen" id={kennung}>
        {t("spielen.zahlenVorlesen", { art, ich: zahlen.ich.text, gegner: zahlen.gegner.text })}
      </span>
      <span className="partie-zahlen-art" aria-hidden="true">
        {art}
      </span>
      <span className="partie-zahlen-marken" aria-hidden="true">
        <Seitenmarke farbe={ich} zahl={zahlen.ich} eigene />
        <Seitenmarke farbe={andere} zahl={zahlen.gegner} eigene={false} />
      </span>
    </span>
  );
}

/** Teile der kleinen Zeile: „Blitz 3 + 2“, „25.10.2026“, „32 Züge“ (Einzahl „1 Zug“, ohne Uhr ohne Zeitart). */
function kleingedruckt(partie: Partie): string[] {
  const datum = datumText(new Date(partie.begonnen));
  const zuege = Math.ceil(partie.zuege.length / 2);
  const zugtext = t(zuege === 1 ? "spielen.partieZugEins" : "spielen.partieZuege", { zuege });
  const zeit = zeittext(partie);
  return zeit ? [zeit, datum, zugtext] : [datum, zugtext];
}

/** Die kleine Zeile; jeder Teil bleibt beisammen, umbrochen wird nur an „ · “. */
function Kleingedruckt({ partie, kennung }: { partie: Partie; kennung: string }) {
  const teile = kleingedruckt(partie);
  return (
    <span className="partie-klein" id={kennung}>
      {teile.map((teil, i) => (
        <Fragment key={teil}>
          {i > 0 && " "}
          <span>
            {teil}
            {i < teile.length - 1 && " ·"}
          </span>
        </Fragment>
      ))}
    </span>
  );
}

/**
 * Die Zeile. Beispiel: Sieg mit Weiß gegen Tom im Blitz → links Toms Porträt und „Tom“, Mitte
 * Stern am Porträt, Pokal „1–0“, weißer König, ⚡, klein „Blitz 3 + 2 · 25.10.2026 · 32 Züge“; rechts
 * „Elo“, darunter die goldene Marke „♔ 1450“ und „♚ 1320“. Der Knopf liegt unsichtbar hinter der
 * ganzen Zeile (der Inhalt lässt Tipps durch); im Löschmodus wählt er aus statt zu öffnen.
 */
export function Partiezeile({
  eintrag,
  loeschmodus = false,
  gewaehlt = false,
  beiWahl,
}: {
  eintrag: Partieeintrag;
  /** Löschmodus (PartieLoeschen.tsx): Ein Tipp wählt aus statt zu öffnen. */
  loeschmodus?: boolean;
  gewaehlt?: boolean;
  beiWahl?: () => void;
}) {
  const { navigiere } = useNavigation();
  const { partie } = eintrag;
  const gegner = useGegner(partie);
  const gesperrt = loeschmodus && partie.einstellung.gewertet;
  const kennung = useId();
  // Name des Knopfs aus Gegner, Kopf, kleiner Zeile und Zahlen.
  const ids = {
    wer: `${kennung}-wer`,
    kopf: `${kennung}-kopf`,
    klein: `${kennung}-klein`,
    zahlen: `${kennung}-zahlen`,
  };
  const klassen = ["partieeintrag", loeschmodus && "im-loeschmodus", gewaehlt && "gewaehlt"];
  return (
    <li className={klassen.filter(Boolean).join(" ")}>
      <button
        type="button"
        className="partiezeile-oeffnen"
        aria-labelledby={Object.values(ids).join(" ")}
        aria-describedby={loeschmodus ? `${kennung}-modus` : undefined}
        aria-pressed={loeschmodus && !gesperrt ? gewaehlt : undefined}
        disabled={gesperrt}
        onClick={() =>
          loeschmodus ? beiWahl?.() : navigiere({ bildschirm: "partie", id: partie.id })
        }
      />
      <div className="partiezeile">
        <span className="partie-wer" id={ids.wer}>
          {gegner.bild}
          <span className="partie-wer-name">{gegner.name}</span>
          {partie.einstellung.gewertet && (
            <span className="partie-gewertet" role="img" aria-label={t("spielen.partieGewertet")}>
              <Star size={WERTUNGSSYMBOL} aria-hidden="true" />
            </span>
          )}

          {loeschmodus && (
            <Wahlhaken gewaehlt={gewaehlt} gesperrt={gesperrt} kennung={`${kennung}-modus`} />
          )}
        </span>
        <span className="partie-was">
          <span className="partie-kopf" id={ids.kopf}>
            <Ergebnismarke partie={partie} />
            <Seitenfigur partie={partie} />
            <Zeitzeichen partie={partie} />
          </span>
          <Kleingedruckt partie={partie} kennung={ids.klein} />
        </span>
        <Zahlen eintrag={eintrag} kennung={ids.zahlen} />
      </div>
    </li>
  );
}

/** Der Haken im Löschmodus oben links am Porträt; gewertete Partien zeigen ein Schloss. */
function Wahlhaken({
  gewaehlt,
  gesperrt,
  kennung,
}: {
  gewaehlt: boolean;
  gesperrt: boolean;
  kennung: string;
}) {
  return (
    <span className={gewaehlt ? "wahlhaken an" : "wahlhaken"}>
      {gesperrt ? (
        <Lock size={WAHLSYMBOL} aria-hidden="true" />
      ) : (
        gewaehlt && <Check size={WAHLSYMBOL} aria-hidden="true" />
      )}
      <span className="nur-vorlesen" id={kennung}>
        {t(gesperrt ? "spielen.loeschen.gewertet" : "spielen.loeschen.waehlen")}
      </span>
    </span>
  );
}
