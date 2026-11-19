/**
 * Texte zur Größe des Spielpakets auf der Startkarte (AbenteuerAnsicht.tsx).
 *
 * Rolle im Gesamtbild: ausgelagert, damit die Ansicht unter 400 Zeilen bleibt (Regel 4); neu ist
 * der Satz für eine neue Version des Spiels (Wunsch des Autors, 19.11.2026: das Spiel soll sich
 * aktualisieren, wenn es eine neue Version gibt).
 * Abhängigkeiten: i18n, schnittstelle/paket.ts.
 */
import { t } from "../../i18n/sprache";
import type { Paketzustand } from "../schnittstelle/paket";

const BYTES_JE_MB = 1024 * 1024;

/** Größe für die Anzeige: ganze Megabyte, unter einem Megabyte „unter 1“. */
export function mbText(bytes: number): string {
  const mb = bytes / BYTES_JE_MB;
  return mb < 1 ? t("abenteuer.unterEinemMb") : mb.toFixed(0);
}

/**
 * Der Satz über dem Knopf „Spiel herunterladen“.
 * Beispiel: { art: "fehlt", bytes: 110 MB } → „Das Spiel muss einmal heruntergeladen werden: etwa 105 MB …“;
 * mit `neuerStand` → „Es gibt eine neue Version des Spiels …“.
 */
export function groessentext(zustand: Extract<Paketzustand, { art: "fehlt" }>): string {
  if (zustand.neuerStand) return t("abenteuer.neuerStand");
  return zustand.bytes
    ? t("abenteuer.groesse", { mb: mbText(zustand.bytes) })
    : t("abenteuer.groesseUnbekannt");
}
