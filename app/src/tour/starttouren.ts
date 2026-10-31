/**
 * Die zwei Wege der ersten Tour: „Ich lese das Buch“ und „Ich will spielen und auswerten“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (31.10.2026): Wer das Buch kauft und den QR-Code scannt,
 * soll an die Hand genommen werden (wo fange ich an, wie hilft mir die App beim Buch); wer nur den
 * Link bekommt, will meist spielen und Partien auswerten. Der Hinweis beim ersten Start
 * (TourAngebot.tsx) fragt deshalb nach dem Weg und startet eine dieser Touren; „Erst umsehen“
 * nimmt die kurze Haupttour (touren.ts). Die Schritte zeigen auf die Startseite des Buches bzw.
 * von Spielen; was dort nicht steht (Einlesen einer Partie im Profil), erklärt ein Schritt in der
 * Mitte mit einem Sprungknopf. Der Hinweis zum Installieren erscheint nur im Browser-Tab.
 * Abhängigkeiten: touren.ts (nur Typen), i18n (Schlüssel).
 */
import type { Ansicht } from "../app/stapel";
import type { Textschluessel } from "../i18n/sprache";
import type { Tour, Tourschritt } from "./touren";

/** Schritt mit Ziel; fehlt das Ziel, steht der Text in der Mitte. */
function am(ziel: string, text: Textschluessel): Tourschritt {
  return { ziel, ersatzMitte: true, text };
}

/** Schritt in der Mitte, auf Wunsch mit Sprungknopf. */
function mitte(text: Textschluessel, sprung?: Tourschritt["sprung"]): Tourschritt {
  return sprung
    ? { ziel: null, ersatzMitte: true, text, sprung }
    : { ziel: null, ersatzMitte: true, text };
}

/** Wohin „Los: Kapitel 0 öffnen“ springt: das erste Kapitel des Buches (Kapitel 0). */
const ERSTES_KAPITEL: Ansicht = { bildschirm: "kapitel", nummer: 0 };

/** Der Hinweis zum Installieren, nur wenn die App im Browser-Tab läuft. */
const INSTALLIEREN: Tourschritt = {
  ziel: null,
  ersatzMitte: true,
  text: "starttour.installieren",
  nurWenn: "nichtInstalliert",
};

/** Die Leiste und das Toursymbol, gemeinsam für beide Wege. */
const LEISTE: readonly Tourschritt[] = [
  am("leiste-training", "starttour.leiste"),
  am("tour-symbol", "tour.haupt.symbol"),
];

/** Die beiden Touren der Startwahl, nach Kennung. */
export const STARTTOUREN: Readonly<Record<"start.buch" | "start.spielen", Tour>> = {
  "start.buch": {
    titel: "starttour.titel.buch",
    schritte: [
      mitte("starttour.buch.willkommen"),
      am("buch-heute", "starttour.buch.heute"),
      am("buch-lernpfad", "starttour.buch.weg"),
      am("buch-nummer", "starttour.buch.nummer"),
      am("buch-kapitel", "starttour.buch.kapitel"),
      ...LEISTE,
      INSTALLIEREN,
      mitte("starttour.buch.los", { text: "starttour.buch.losKnopf", ansicht: ERSTES_KAPITEL }),
    ],
  },
  "start.spielen": {
    titel: "starttour.titel.spielen",
    schritte: [
      mitte("starttour.spielen.willkommen"),
      am("spielen-vorschlag", "starttour.spielen.schnell"),
      am("spielen-kacheln", "starttour.spielen.kacheln"),
      mitte("starttour.spielen.auswertung"),
      mitte("starttour.spielen.einlesen", {
        text: "starttour.spielen.einlesenKnopf",
        ansicht: { bildschirm: "ich" },
      }),
      ...LEISTE,
      INSTALLIEREN,
      mitte("starttour.spielen.los"),
    ],
  },
};
