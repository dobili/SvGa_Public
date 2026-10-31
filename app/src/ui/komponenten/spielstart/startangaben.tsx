/**
 * Angaben der Startleiste und der Karte „Schnell eine Partie“: wer spielt (Bild und Name) und die
 * Zusammenfassung „Weiß · 10 + 0 · gewertet“.
 *
 * Rolle im Gesamtbild: Eigene Datei, damit Startleiste.tsx und Vorschlagskarte.tsx nur
 * Komponenten ausführen (schnelles Neuladen in der Entwicklung). Das Bild ist das vorhandene
 * Zeichen der App: Porträt, Stufenmarke, Stift am Menschen (eigene Bots), zwei Menschen.
 * Abhängigkeiten: GegnerBild, Stufenmarke, engine/gegner.ts, engine/gruppe.ts, i18n, lucide-react.
 */
import { UserPen, Users } from "lucide-react";
import type { ReactNode } from "react";
import { gegnerVon, type EigenerGegner } from "../../../engine/gegner";
import { gruppenstufe } from "../../../engine/gruppe";
import type { Stufennummer } from "../../../engine/stufen";
import { t } from "../../../i18n/sprache";
import type { Farbe } from "../../../schach/stellung";
import { GegnerBild } from "../gegner/GegnerBild";
import { Stufenmarke } from "../gegner/Stufenmarke";

const ZEICHENGROESSE = 24;

/** Wer spielt: ein Bot, die eigene Stufe, ein Mensch, oder noch keiner (Eigene Bots ohne Wahl). */
export type Startgegner = "bot" | "stufe" | "mensch" | "keiner";

/** Was die Leiste über den Gegner zeigt. */
export interface Startangaben {
  readonly art: Startgegner;
  readonly bot: string | null;
  readonly stufe: Stufennummer;
  readonly eigene: readonly EigenerGegner[];
  readonly farbe: Farbe;
  /** „10 + 0“ oder „Ohne Uhr“ (kurz seit DS50). */
  readonly uhr: string;
  /** Zählt die Partie wirklich (Haken gesetzt und wertbar)? */
  readonly gewertet: boolean;
  /** Spielstärke des Gegners zur gewählten Uhr; null gegen einen Menschen; „unbekannt“: Gruppe. */
  readonly staerke: number | "unbekannt" | null;
}

/** Bild und Name des Gegners. Beispiel: Bot „tom“ → Porträt und „Tom“. */
export function gegnerangabe(a: Startangaben): { bild: ReactNode; name: string } {
  if (a.art === "keiner") {
    const bild = <UserPen size={ZEICHENGROESSE} aria-hidden="true" />;
    return { bild, name: t("spielen.startleiste.keinBot") };
  }
  if (a.art === "mensch") {
    const bild = <Users size={ZEICHENGROESSE} aria-hidden="true" />;
    return { bild, name: t("spielen.gegner.mensch") };
  }
  const gruppe = gruppenstufe(a.bot);
  if (gruppe !== null) {
    const name = t("spielen.startleiste.gruppe", { nummer: String(gruppe) });
    return { bild: <Stufenmarke stufe={gruppe} />, name };
  }
  const name = gegnerVon(a.bot)?.name ?? a.eigene.find((g) => g.kennung === a.bot)?.name;
  if (a.art === "bot" && a.bot && name) {
    return { bild: <GegnerBild bot={a.bot} eigene={a.eigene} name={name} />, name };
  }
  return { bild: <Stufenmarke stufe={a.stufe} />, name: t("spielen.kategorie.stufe") };
}

/** „Weiß · 10 + 0 · gewertet“; gegen einen Menschen ohne Farbe. */
export function zusammenfassung(a: Pick<Startangaben, "art" | "farbe" | "uhr" | "gewertet">) {
  const farbe = t(
    a.farbe === "white" ? "spielen.startleiste.farbe.white" : "spielen.startleiste.farbe.black",
  );
  const wertung = t(a.gewertet ? "spielen.startleiste.gewertet" : "spielen.startleiste.ungewertet");
  return [a.art === "mensch" ? null : farbe, a.uhr, wertung]
    .filter((teil) => teil !== null)
    .join(" · ");
}
