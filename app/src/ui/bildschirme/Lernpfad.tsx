/**
 * Bildschirm „Dein Weg durchs Buch“ (Gamifizierung P2, Lernpfad).
 *
 * Rolle im Gesamtbild: Macht den Fortschritt im Buch als Weg sichtbar (Ziel-Gradient): 13
 * Stationen für die Kapitel 0 bis 12, fünf Etappen nach den Teilen des Buches mit ihrem Orden als
 * Etappenziel, die eigene Figur an der aktuellen Station und darüber ein Satz, was bis zum Ende
 * des Kapitels und bis zum nächsten Orden fehlt. Erreichbar über „Als Weg anzeigen“ über der
 * Kapitelliste (Buch.tsx) und aus dem Profil; eingetragen als Zusatzansicht „lernpfad“
 * (app/zusatzansichten.ts). Kein eigenes Speicherfeld; nur der Merker „lernpfadStation“.
 * Entscheidung E3: eigener Bildschirm, die Kapitelliste bleibt. Gestaltung B1 (31.10.2026): der
 * Satz steht mit dem Ring der aktuellen Station in einer Karte, die Einleitung entfällt, der Weg
 * führt durch fünf Landschaften (komponenten/lernpfad/Landschaft.tsx).
 * Abhängigkeiten: komponenten/lernpfad/, daten/laden.ts, speicher, app/merker.ts, i18n.
 */
import { useEffect, useRef, useState } from "react";
import { liesMerker } from "../../app/merker";
import { ladeIndex, type Datenverzeichnis } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import type { Fortschritt } from "../../speicher/format";
import { useSpeicher } from "../../speicher/speicher";
import { useDaten } from "../komponenten/bausteine/useDaten";
import {
  aktuelleStation,
  etappen,
  hinweistext,
  kapitelDerNummer,
  MERKER_STATION,
  stationen,
} from "../komponenten/lernpfad/lernpfad";
import { Kapitelnummer } from "../komponenten/kapitel/Kapitelnummer";
import { Weg } from "../komponenten/lernpfad/Weg";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import "../stil/lernpfad.css";
import "../stil/lernpfad-land.css";

/** Ob das Gerät „Bewegung reduzieren“ wünscht (dann springt die Ansicht ohne Gleiten). */
function bewegungReduziert(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Der Weg mit Satz; die aktuelle Station rückt beim Öffnen in die Mitte des Bildschirms. */
function Pfad({ index, fortschritt }: { index: Datenverzeichnis; fortschritt: Fortschritt }) {
  const rahmen = useRef<HTMLDivElement>(null);
  // Die Station vom letzten Öffnen; die Figur merkt sich danach die neue (Wegfigur.tsx).
  const [vorher] = useState(() => kapitelDerNummer(liesMerker(MERKER_STATION)));
  const liste = stationen(index.kapitel, fortschritt);
  const aktuell = aktuelleStation(liste, kapitelDerNummer(liesMerker("zuletzt")));
  const station = liste[aktuell];
  useEffect(() => {
    const ziel = rahmen.current?.querySelector(".lernpfad-station.aktuell");
    ziel?.scrollIntoView?.({ block: "center", behavior: bewegungReduziert() ? "auto" : "smooth" });
  }, []);
  const titel = (kapitel: number) => index.kapitel.find((k) => k.kapitel === kapitel)?.titel ?? "";
  return (
    <div ref={rahmen}>
      <div className="karte lernpfad-hinweis">
        {station && <Kapitelnummer nummer={station.kapitel} anteil={station.anteil} />}
        <p data-testid="lernpfad-hinweis" aria-live="polite">
          {hinweistext(liste, aktuell)}
        </p>
      </div>
      <Weg
        etappen={etappen(liste, index.kapitel, fortschritt)}
        titel={titel}
        aktuell={station?.kapitel ?? 0}
        vorher={vorher}
      />
    </div>
  );
}

/** Der Bildschirm (Zusatzansicht „lernpfad“; der Wert wird nicht gebraucht). */
export function Lernpfad() {
  const index = useDaten(ladeIndex, "index");
  const fortschritt = useSpeicher((z) => z.daten.fortschritt);
  return (
    <div className="bildschirm bildschirm-lernpfad">
      <Kopfzeile titel={t("lernpfad.titel")} zurueckText={t("lernpfad.zurueck")} />
      {index.art === "laedt" && <p className="lade">…</p>}
      {index.art === "fehler" && (
        <p className="fehlertext">{t("buch.ladefehler", { fehler: index.meldung })}</p>
      )}
      {index.art === "fertig" && <Pfad index={index.wert} fortschritt={fortschritt} />}
    </div>
  );
}
