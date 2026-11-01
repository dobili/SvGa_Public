/**
 * Eine Probepartie als Abzweig in ihre Variante speichern; Gegner und Kommentar als Text.
 *
 * Rolle im Gesamtbild: Teil der Probepartie „von hier“ (Wunsch des Autors, 1.11.2026). Genutzt
 * unter der Partie (Probeabschluss.tsx) und von der Karte „Probepartie läuft“ auf „Spielen“
 * (Probekarte.tsx); eigene Datei seit Stufe 3, weil beide Bildschirme es brauchen.
 * Abhängigkeiten: training/probevariante.ts, speicher, engine/gegner.ts, partietexte.ts, i18n.
 */
import { gegnername } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { mitProbe } from "../../../speicher/partien";
import { aendere, speicherzustand } from "../../../speicher/speicher";
import type { Partie } from "../../../spiel/partie";
import { probeAlsVariante } from "../../../training/probevariante";
import { kurzergebnis } from "../partie/partietexte";

/** Der Gegner einer Probepartie als Text („Lotte“, „die Engine“, „einen Menschen“). */
export function probegegner(partie: Partie): string {
  const { einstellung } = partie;
  const eigene = speicherzustand().daten.spiel.eigeneGegner;
  return einstellung.gegner === "mensch"
    ? t("varianten.probe.mensch")
    : (gegnername(einstellung.bot, einstellung.botName, eigene) ?? t("varianten.probe.engine"));
}

/** „Gegen Lotte zu Ende gespielt: Matt! Du hast gewonnen.“ oder „… gespielt (abgebrochen)“. */
function probekommentar(partie: Partie): string {
  const gegner = probegegner(partie);
  return partie.ende
    ? t("varianten.probe.kommentar", { gegner, ergebnis: kurzergebnis(partie) })
    : t("varianten.probe.abgebrochen", { gegner });
}

/**
 * Speichert die Probepartie als Abzweig; Kennung und Pfad, oder eine Meldung an einer Grenze.
 * Auch für die Karte „Probepartie läuft“ auf „Spielen“ (Probekarte.tsx).
 */
export function speichereProbe(partie: Partie): { id: string; pfad: readonly string[] } | string {
  const daten = speicherzustand().daten;
  const titel = t("varianten.titel.stellung");
  const jetzt = new Date();
  const kommentar = probekommentar(partie);
  const probe = () =>
    probeAlsVariante(daten.variationen, daten.spiel.partien, partie, kommentar, titel, jetzt);
  const vorab = probe();
  if (!vorab) return t("varianten.fehlt");
  if ("grenze" in vorab) return t(`varianten.grenze.${vorab.grenze}`);
  void aendere((d) => {
    const r = probeAlsVariante(d.variationen, d.spiel.partien, partie, kommentar, titel, jetzt);
    if (!r || "grenze" in r) return d;
    return { ...d, variationen: r.liste, spiel: mitProbe(d.spiel, null) };
  });
  return { id: vorab.id, pfad: vorab.pfad };
}
