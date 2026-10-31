/**
 * Die Unterseiten von „Spielen“ als Liste (Entwurf J3): je Eintrag Kennung, Kachel auf der
 * Startseite (Bild, Titel, kurzer Text) und die Seite selbst.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (31.10.2026): Weitere Gegnerarten und Kacheln sollen
 * später dazukommen, ohne Spielen.tsx umzubauen. Eine neue Unterseite ist ein Eintrag mehr:
 * Spielen.tsx zeigt sie für `navigiere({ bildschirm: "spielen", seite: kennung })`, die
 * Startseite zeigt ihre Kachel. Die Bilder der Kacheln sind die vorhandenen Zeichen der App
 * (Ergänzung des Autors, 31.10.2026): eigene Stufe der Schieberegler, eigene Bots der Stift am
 * Menschen, Mensch gegen Mensch die zwei Menschen wie bisher in der Gegnerwahl; „Gegner
 * aussuchen“ zeigt vier Porträts.
 * Abhängigkeiten: seiten/*.tsx, engine/gegner.ts, gegner/gegnerportraet.ts, i18n, lucide-react.
 */
import { SlidersHorizontal, UserPen, Users } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { GEGNER, istSpassbot, type EigenerGegner } from "../../../engine/gegner";
import { STUFEN_ZAHL } from "../../../engine/stufen";
import { t, tZahl } from "../../../i18n/sprache";
import { Gesichter } from "./Kachelgesichter";
import { EigeneBotsSeite } from "./seiten/EigeneBotsSeite";
import { EigeneStufeSeite } from "./seiten/EigeneStufeSeite";
import { FreiePartie } from "./seiten/FreiePartie";
import { GegnerAussuchen } from "./seiten/GegnerAussuchen";

/** Größe der Zeichen auf den Kacheln (Bildpunkte). */
const KACHELZEICHEN = 28;

/** Was eine Seite bekommt: die Stellung (und Abbildung), aus der gespielt wird. */
export interface Seiteneingaben {
  readonly startFen?: string;
  readonly abbildung?: string;
}

/** Ein Eintrag der Liste. */
export interface Spielseite {
  readonly kennung: string;
  readonly titel: () => string;
  readonly text: (eigene: readonly EigenerGegner[]) => string;
  readonly bild: () => ReactNode;
  readonly Seite: ComponentType<Seiteneingaben>;
}

/** Die Unterseiten in der Reihenfolge der Kacheln; eine neue Seite ist eine Zeile mehr. */
export const SPIELSEITEN: readonly Spielseite[] = [
  {
    kennung: "gegner",
    titel: () => t("spielenneu.seite.gegner.titel"),
    text: () =>
      t("spielenneu.seite.gegner.kachel", {
        anzahl: GEGNER.filter((g) => !istSpassbot(g)).length,
        stufen: STUFEN_ZAHL,
      }),
    bild: () => <Gesichter />,
    Seite: GegnerAussuchen,
  },
  {
    kennung: "stufe",
    titel: () => t("spielen.kategorie.stufe"),
    text: () => t("spielenneu.seite.stufe.kachel"),
    bild: () => <SlidersHorizontal size={KACHELZEICHEN} aria-hidden="true" />,
    Seite: EigeneStufeSeite,
  },
  {
    kennung: "eigene",
    titel: () => t("spielen.kategorie.eigene"),
    text: (eigene) =>
      eigene.length === 0
        ? t("spielenneu.seite.eigene.kachelLeer")
        : tZahl("spielenneu.seite.eigene.kachel", eigene.length, { anzahl: eigene.length }),
    bild: () => <UserPen size={KACHELZEICHEN} aria-hidden="true" />,
    Seite: EigeneBotsSeite,
  },
  {
    kennung: "frei",
    titel: () => t("spielenneu.seite.frei.titel"),
    text: () => t("spielenneu.seite.frei.kachel"),
    bild: () => <Users size={KACHELZEICHEN} aria-hidden="true" />,
    Seite: FreiePartie,
  },
];

/** Die Seite zu einer Kennung, sonst null (Startseite). */
export function spielseite(kennung: string | undefined): Spielseite | null {
  return SPIELSEITEN.find((s) => s.kennung === kennung) ?? null;
}
