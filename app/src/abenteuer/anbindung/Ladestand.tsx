/**
 * Stand des Nachladens von Musik und Geräuschen (paket/aktton.ts): eine kleine Zeile über dem
 * Spiel, solange der Ton lädt, danach kurz „Spiel vollständig geladen“; im Spielmenü dieselbe
 * Angabe dauerhaft.
 *
 * Warum: Seit dem 15.11.2026 startet das Spiel ohne Ton (Messung „zugang“: 25 MB Musik hielten
 * den Start auf). Wer offline spielen will, soll sehen, wann wirklich alles auf dem Gerät liegt.
 * Rolle im Gesamtbild: Ladestand in anbindung/AbenteuerAnsicht.tsx, Ladestandzeile im Spielmenü
 * (anbindung/Tonregler.tsx).
 * Abhängigkeiten: paket/aktton.ts, i18n.
 */
import { useEffect, useState } from "react";
import { t } from "../../i18n/sprache";
import { useTonladestand, type Tonladestand } from "../paket/aktton";

/** So lange bleibt „Spiel vollständig geladen“ über dem Spiel stehen. */
const MELDUNG_MS = 4000;
const PROZENT = 100;

/** Der Text zum Stand; null, wenn nichts zu sagen ist. */
function text(stand: Tonladestand): string | null {
  if (stand.art === "laedt") {
    const anteil = stand.gesamt > 0 ? stand.geladen / stand.gesamt : 1;
    return t("abenteuer.ladestand.laedt", { prozent: Math.round(anteil * PROZENT) });
  }
  if (stand.art === "vollstaendig") return t("abenteuer.ladestand.vollstaendig");
  if (stand.art === "unvollstaendig") return t("abenteuer.ladestand.unvollstaendig");
  return null;
}

/** Über dem Spiel: Fortschritt, dann kurz „vollständig“ (nur wenn in dieser Sitzung geladen). */
export function Ladestand() {
  const stand = useTonladestand();
  // Der Stand, dessen Meldung schon verblasst ist (jeder neue Stand ist ein neues Objekt).
  const [verblasst, setzeVerblasst] = useState<Tonladestand | null>(null);
  const vollFrisch = stand.art === "vollstaendig" && stand.frisch;
  useEffect(() => {
    if (!vollFrisch) return;
    const uhr = setTimeout(() => setzeVerblasst(stand), MELDUNG_MS);
    return () => clearTimeout(uhr);
  }, [vollFrisch, stand]);
  const zeigen = stand.art === "laedt" || (vollFrisch && verblasst !== stand);
  const satz = text(stand);
  if (!zeigen || !satz) return null;
  return (
    <p className="abenteuer-ladestand" role="status" data-testid="abenteuer-ladestand">
      {satz}
    </p>
  );
}

/** Im Spielmenü: der Stand als Satz, solange es einen gibt. */
export function Ladestandzeile() {
  const satz = text(useTonladestand());
  if (!satz) return null;
  return (
    <p className="abenteuer-ton-hinweis" data-testid="abenteuer-ladestand-menue">
      {satz}
    </p>
  );
}
