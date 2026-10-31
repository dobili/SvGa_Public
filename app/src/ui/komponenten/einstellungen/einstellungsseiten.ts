/**
 * Die Unterseiten der Einstellungen: „Bots und Wertung“, „Deine Daten“, „Über die App“, als Liste
 * zum Eintragen, mit dem Stand für ihre Zeile.
 *
 * Rolle im Gesamtbild: Entwurf K2 „Brettvorschau oben“ (Wahl des Autors, 31.10.2026). Bis 0.3.31
 * standen „Daten auf diesem Gerät“ und „Über die App“ unter jedem Reiter erneut, die Bots hatten
 * einen eigenen Reiter. Jetzt steht unten genau einmal eine kurze Liste (Seitenliste.tsx): Jede
 * Zeile nennt den Stand („Maia an · Lichess“, „noch nie gesichert“, „0.3.31“) und öffnet eine
 * eigene Seite. Die Seiten laufen über die Ansicht „zusatz“ (app/zusatzansichten.ts), App.tsx
 * bleibt unverändert. Eine neue Seite ist ein Eintrag in `EINSTELLUNGSSEITEN` (eintragen statt
 * umbauen).
 * Abhängigkeiten: app/einstellungen.ts, app/version.ts, speicher/, fortschritt/wertungsmassstab,
 * maiastand, BotsUndWertung, DatenLoeschen, UeberDieApp, i18n.
 */
import { Bot, HardDriveDownload, Info, type LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import { useEinstellungen } from "../../../app/einstellungen";
import { APP_VERSION } from "../../../app/version";
import { datumText, t, type Textschluessel } from "../../../i18n/sprache";
import { sicherungFaellig } from "../../../speicher/sicherung";
import { useSpeicher } from "../../../speicher/speicher";
import { useWertungsmassstab } from "../fortschritt/wertungsmassstab";
import { BotsUndWertung } from "./BotsUndWertung";
import { DatenLoeschen } from "./DatenLoeschen";
import { useMaiaBereit } from "./maiastand";
import { UeberDieApp } from "./UeberDieApp";

/** Stand einer Seite in ihrer Zeile; `warnung` zeigt einen orangen Punkt davor. */
export interface Seitenstand {
  readonly text: string;
  readonly warnung?: boolean;
}

/** Eine Unterseite der Einstellungen. */
export interface Einstellungsseite {
  /** Kennung der Ansicht „zusatz“, etwa „einstellungen-daten“. */
  readonly kennung: string;
  readonly name: Textschluessel;
  readonly symbol: LucideIcon;
  /** Ziel der Tour der Einstellungen (tour/touren.ts). */
  readonly tour: string;
  /** Der Stand für die Zeile (ein Hook, er darf Speicher und Einstellungen lesen). */
  readonly useStand: () => Seitenstand;
  readonly Inhalt: ComponentType;
}

/** „Maia an · Lichess“, „Maia aus · FIDE“ oder „ohne Maia · chess.com“. */
function useBotsStand(): Seitenstand {
  const bereit = useMaiaBereit();
  const { maia } = useEinstellungen();
  const [massstab] = useWertungsmassstab();
  const maiaText = !bereit
    ? t("einstellungenneu.bots.ohneMaia")
    : t(maia === "an" ? "einstellungenneu.bots.maiaAn" : "einstellungenneu.bots.maiaAus");
  return { text: `${maiaText} · ${t(`wertung.massstab.${massstab}`)}` };
}

/**
 * „noch nie gesichert“ oder „gesichert am 12.10.2026“; der orange Punkt, sobald eine Sicherung
 * fällig ist (speicher/sicherung.ts: vier Wochen, nur mit eigenen Daten).
 */
function useDatenStand(): Seitenstand {
  const daten = useSpeicher((zustand) => zustand.daten);
  const text = daten.letzteSicherung
    ? t("einstellungenneu.daten.gesichert", { datum: datumText(new Date(daten.letzteSicherung)) })
    : t("einstellungenneu.daten.nie");
  return { text, warnung: sicherungFaellig(daten, new Date()) };
}

/** Alle Unterseiten in der Reihenfolge der Liste; je Seite ein Eintrag. */
export const EINSTELLUNGSSEITEN: readonly Einstellungsseite[] = [
  {
    kennung: "einstellungen-bots",
    name: "einstellungenneu.seite.bots",
    symbol: Bot,
    tour: "einstellungen-reiter-bots",
    useStand: useBotsStand,
    Inhalt: BotsUndWertung,
  },
  {
    kennung: "einstellungen-daten",
    name: "einstellungenneu.seite.daten",
    symbol: HardDriveDownload,
    tour: "einstellungen-daten",
    useStand: useDatenStand,
    Inhalt: DatenLoeschen,
  },
  {
    kennung: "einstellungen-ueber",
    name: "einstellungenneu.seite.ueber",
    symbol: Info,
    tour: "einstellungen-ueber",
    useStand: () => ({ text: APP_VERSION }),
    Inhalt: UeberDieApp,
  },
];
