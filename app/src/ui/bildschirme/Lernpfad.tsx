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
 * Weg führt durch fünf Landschaften (komponenten/lernpfad/Landschaft.tsx). Weniger Text P5
 * (31.10.2026): oben ein Balken mit Resten und Ordenssilhouette (Lernpfadkopf.tsx); der Satz und
 * die Einleitung stehen im ⓘ. Seit dem 31.10.2026 stehen neben den Stationen die Nebenaufgaben
 * (komponenten/lernpfad/Nebenaufgaben.tsx): alle Orden, Abzeichen und Kapitelaufgaben, je beim
 * Kapitel, zu dem sie am besten passen; für den Weg braucht man nur die Übungen und die Lernziele
 * daraus, denn seit dem 6.11.2026 zählt eine Station auch die Warum-Fragen und die abgehakten
 * Lernziele der Gesamt-Checkliste (lernpfad.ts, STATIONSTEILE). Der Weg wartet deshalb, bis
 * nachschlagen.json geladen ist, damit keine Station kurz fertig aussieht.
 * Abhängigkeiten: komponenten/lernpfad/, daten/laden.ts, speicher, app/lernstand.ts,
 * app/merker.ts, i18n.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useLernstand } from "../../app/lernstand";
import { liesMerker } from "../../app/merker";
import { ladeIndex, type Datenverzeichnis } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { useSpeicher } from "../../speicher/speicher";
import { useDaten } from "../komponenten/bausteine/useDaten";
import {
  aktuelleStation,
  etappen,
  kapitelDerNummer,
  MERKER_STATION,
  stationen,
  type Stationsquelle,
} from "../komponenten/lernpfad/lernpfad";
import { Lernpfadkopf } from "../komponenten/lernpfad/Lernpfadkopf";
import { useLernzielzahlen, useNebenaufgaben } from "../komponenten/lernpfad/useNebenaufgaben";
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
function Pfad({ index, quelle }: { index: Datenverzeichnis; quelle: Stationsquelle }) {
  const rahmen = useRef<HTMLDivElement>(null);
  // Die Station vom letzten Öffnen; die Figur merkt sich danach die neue (Wegfigur.tsx).
  const [vorher] = useState(() => kapitelDerNummer(liesMerker(MERKER_STATION)));
  const liste = stationen(index.kapitel, quelle);
  const teile = etappen(liste, index.kapitel, quelle.fortschritt);
  const aktuell = aktuelleStation(liste, kapitelDerNummer(liesMerker("zuletzt")));
  const station = liste[aktuell];
  useEffect(() => {
    const ziel = rahmen.current?.querySelector(".lernpfad-station.aktuell");
    ziel?.scrollIntoView?.({ block: "center", behavior: bewegungReduziert() ? "auto" : "smooth" });
  }, []);
  const titel = (kapitel: number) => index.kapitel.find((k) => k.kapitel === kapitel)?.titel ?? "";
  const nummern = useMemo(() => index.kapitel.map((k) => k.kapitel), [index]);
  const nebenaufgaben = useNebenaufgaben(nummern);
  return (
    <div ref={rahmen}>
      <Lernpfadkopf liste={liste} aktuell={aktuell} etappen={teile} />
      <Weg
        etappen={teile}
        titel={titel}
        aktuell={station?.kapitel ?? 0}
        vorher={vorher}
        nebenaufgaben={nebenaufgaben}
      />
    </div>
  );
}

/** Der Bildschirm (Zusatzansicht „lernpfad“; der Wert wird nicht gebraucht). */
export function Lernpfad() {
  const index = useDaten(ladeIndex, "index");
  const fortschritt = useSpeicher((z) => z.daten.fortschritt);
  const lernstand = useLernstand();
  const lernziele = useLernzielzahlen();
  const bereit = index.art === "fertig" && lernziele !== null;
  return (
    <div className="bildschirm bildschirm-lernpfad">
      <Kopfzeile titel={t("lernpfad.titel")} zurueckText={t("lernpfad.zurueck")} />
      {index.art !== "fehler" && !bereit && <p className="lade">…</p>}
      {index.art === "fehler" && (
        <p className="fehlertext">{t("buch.ladefehler", { fehler: index.meldung })}</p>
      )}
      {index.art === "fertig" && lernziele !== null && (
        <Pfad index={index.wert} quelle={{ fortschritt, lernstand, lernziele }} />
      )}
    </div>
  );
}
