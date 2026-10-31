/**
 * Texte des Abweichungsmodus nach der Antwort: Was hat sich durch die Abweichung geändert, hat
 * der Leser darauf reagiert, und warum ist der beste Zug der Stellung ein anderer als der beste
 * Zug für die Eröffnungsziele?
 *
 * Rolle im Gesamtbild: Punkte O und D7 des Nebenchats (Wunsch des Autors, 30.10.2026). Die Sätze
 * entstehen aus Zielbilanz, Stellungsprofil und den Fortsetzungen der Engine; die Engine selbst
 * rechnet in ui/trainer/useAbweichung.ts.
 * Abhängigkeiten: training/zielzug.ts, analyse/stellungsprofil.ts, training/roentgentrainer.ts
 * (fenMitZugrecht), schach/stellung.ts, i18n.
 * Buchbezug: Kapitel 2, „Wenn der Gegner das Buch verlässt“: erst fragen, was der neue Zug
 * ändert, dann nach den drei Zielen antworten.
 */
import type { Color, Square } from "chessops/types";
import { profil } from "../analyse/stellungsprofil";
import { aufzaehlung, figurenname, zugtext } from "../analyse/texte";
import { t, zahlText } from "../i18n/sprache";
import { ohneZugzeichen } from "../schach/notation";
import { feldAusName, gegner, stellungAusFen } from "../schach/stellung";
import { zugFelder } from "../schach/weiterspielen";
import type { Zielbilanz } from "../schach/zielbilanz";
import { fenMitZugrecht } from "./roentgentrainer";
import { stellungNach } from "./uebungsaufgabe";
import { zielbilanzVon } from "./zielzug";

/** Unterschied ab dem ein Zug spürbar schlechter ist (Bauern), wie „gut“ im Abweichungsmodus. */
const SPUERBAR_AB = 0.5;
const NACHKOMMA = 1;

/**
 * Was will der Gegner mit seinem Abweichzug? Die eigenen Figuren, die die gezogene Figur jetzt
 * angreift, und die Schläge mit Gewinn, die er hätte, wenn er gleich noch einmal zöge.
 * Beispiel: London, 5... Ld6 → „Ld6 greift Läufer f4 an.“
 */
export function abweichungshinweis(fenVorAbw: string, abw: string, fenNachAbw: string): string[] {
  const felder = zugFelder(fenVorAbw, abw);
  const gelesen = stellungAusFen(fenNachAbw);
  const ziel = felder ? feldAusName(felder.nach) : null;
  if (!gelesen.ok || ziel === null) return [];
  const s = gelesen.wert;
  const ich = s.amZug;
  const p = profil(s);
  const ziele = [...s.brett[ich]].filter((feld) =>
    p.angriffskarte.angreiferVon(feld, gegner(ich), false).some((a) => a.feld === ziel),
  );
  const saetze: string[] = [];
  if (ziele.length > 0) {
    const namen = ziele.flatMap((f: Square) => {
      const figur = s.brett.get(f);
      return figur && figur.role !== "pawn" ? [figurenname({ feld: f, figur })] : [];
    });
    if (namen.length > 0)
      saetze.push(t("abweichung.hinweis.greiftAn", { zug: zugtext(abw), ziele: aufzaehlung(namen) }));
  }
  const nochmal = stellungAusFen(fenMitZugrecht(s, gegner(ich)));
  const drohungen = nochmal.ok
    ? (profil(nochmal.wert).schlaegeVon(gegner(ich)) ?? []).filter((z) => z.bilanz > 0)
    : [];
  if (drohungen.length > 0)
    saetze.push(
      t("abweichung.hinweis.droht", {
        zuege: aufzaehlung(drohungen.map((z) => zugtext(z.san))),
      }),
    );
  if (saetze.length === 0) saetze.push(t("abweichung.hinweis.ruhig", { zug: zugtext(abw) }));
  return saetze;
}

/** Hat der Leser den Planzug gespielt (der nächste Buchzug, ohne Schachzeichen verglichen)? */
export function istPlanzug(eigen: string, planzug: string | null): boolean {
  return planzug !== null && ohneZugzeichen(eigen) === ohneZugzeichen(planzug);
}

/** Was ein Zug für die Ziele bringt: entwickelt, besetzt das Zentrum, rochiert. */
function fortschritt(vorher: Zielbilanz, nachher: Zielbilanz): string[] {
  const teile: string[] = [];
  if (nachher.entwicklung.offen.length < vorher.entwicklung.offen.length)
    teile.push(t("abweichung.ziele.entwicklung"));
  if (nachher.zentrum.bauern.length > vorher.zentrum.bauern.length)
    teile.push(t("abweichung.ziele.zentrum"));
  else if (nachher.zentrum.kontrolliert.length > vorher.zentrum.kontrolliert.length)
    teile.push(t("abweichung.ziele.kontrolle"));
  if (nachher.koenig.rochiert && !vorher.koenig.rochiert) teile.push(t("abweichung.ziele.koenig"));
  return teile;
}

/** Zug mit Wert und Folge (wie in useAbweichung.ts). */
export interface Zugwert {
  readonly zug: string;
  readonly wert: number;
  readonly folge: readonly string[];
}

/**
 * Die Begründung, warum der beste Zug ein anderer ist als der Zug für die Ziele.
 *
 * Eingaben: Stellung vor dem Zug, Seite, bester Zug, Zielzug. Ausgabe: zwei bis drei Sätze.
 * Beispiel: Zielzug Sc3 (entwickelt) verliert 1,5, denn nach Sc3 folgt Lxf4 → „… kostet aber
 * 1,5 Bauern: Nach Sc3 spielt Schwarz Lxf4.“
 */
export function zielbegruendung(
  fen: string,
  seite: Color,
  bester: Zugwert,
  ziel: Zugwert,
): string[] {
  const vorher = zielbilanzVon(fen, seite);
  const nachher = zugFelder(fen, ziel.zug)
    ? zielbilanzVon(stellungNach(fen, [ziel.zug]), seite)
    : null;
  const was = vorher && nachher ? fortschritt(vorher, nachher) : [];
  const saetze = [
    t("abweichung.ziele.bringt", {
      zug: zugtext(ziel.zug),
      was: was.length > 0 ? aufzaehlung(was) : t("abweichung.ziele.punkte"),
    }),
  ];
  const abstand = bester.wert - ziel.wert;
  const antwort = ziel.folge[1];
  if (abstand >= SPUERBAR_AB) {
    saetze.push(
      t(antwort ? "abweichung.ziele.kostetMit" : "abweichung.ziele.kostet", {
        zug: zugtext(ziel.zug),
        bauern: zahlText(abstand, NACHKOMMA),
        antwort: antwort ? zugtext(antwort) : "",
      }),
    );
  } else {
    saetze.push(t("abweichung.ziele.knapp", { zug: zugtext(ziel.zug), bester: zugtext(bester.zug) }));
  }
  saetze.push(
    t("abweichung.ziele.besterFolge", {
      zug: zugtext(bester.zug),
      folge: bester.folge.map(zugtext).join(" "),
    }),
  );
  return saetze;
}
