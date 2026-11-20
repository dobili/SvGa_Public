/**
 * Eine Datei des Abenteuerpakets geprüft in den Cache laden (paket/paketlader.ts: Grundpaket,
 * Nachladen, Musik beim Abspielen). Ausgelagert aus dem Paketlader (Codepflege 20.11.2026, Regel 4:
 * Dateien unter 400 Zeilen).
 * Abhängigkeiten: paket/paketadresse.ts, paket/ladehilfen.ts (Prüfsumme), schnittstelle/paket.ts.
 */
import type { Paketverzeichnis } from "../schnittstelle/paket";
import { Spielfehler } from "../schnittstelle/spielfehler";
import { pruefsumme } from "./ladehilfen";
import { adresse } from "./paketadresse";

type Paketdatei = Paketverzeichnis["dateien"][number];

/**
 * Übernimmt eine Datei aus einer älteren Fassung des Pakets, wenn sie dort gleich ist (gleiche
 * Prüfsumme). Warum: Jede neue Fassung (etwa vier neue Bilder vom Autor, 20.11.2026) bekommt einen
 * eigenen Cache; ohne Übernahme lud das Handy jedes Mal das ganze Paket neu (rund 16 MB), jetzt nur
 * die geänderten Dateien. Ausgabe: true, wenn übernommen; eine geänderte Datei lädt dann neu.
 */
export async function uebernimmAusAlterFassung(
  speicher: Cache,
  datei: Paketdatei,
): Promise<boolean> {
  const alt = await caches.match(adresse(datei.pfad));
  if (!alt) return false;
  const bytes = await alt.arrayBuffer();
  if ((await pruefsumme(bytes)) !== datei.sha256) return false;
  const typ = alt.headers.get("content-type") ?? "application/octet-stream";
  await speicher.put(
    adresse(datei.pfad),
    new Response(bytes, { headers: { "content-type": typ } }),
  );
  return true;
}

/**
 * Lädt eine Datei mit Fortschritt, prüft sie und legt sie in den Cache. Liegt sie schon dort oder
 * gleich in einer älteren Fassung, kommt sie ohne Netz. Wirft bei Netzfehler oder falscher Prüfsumme.
 */
export async function ladeDatei(
  speicher: Cache,
  datei: Paketdatei,
  weiter: (bytes: number) => void,
): Promise<void> {
  if (
    (await speicher.match(adresse(datei.pfad))) ||
    (await uebernimmAusAlterFassung(speicher, datei))
  ) {
    weiter(datei.bytes);
    return;
  }
  const antwort = await fetch(adresse(datei.pfad), { cache: "no-cache" });
  if (!antwort.ok || !antwort.body)
    throw new Spielfehler("fehler.paket.laden", { pfad: datei.pfad, status: antwort.status });
  const teile: Uint8Array<ArrayBuffer>[] = [];
  const leser = antwort.body.getReader();
  for (;;) {
    const { done, value } = await leser.read();
    if (done) break;
    teile.push(value);
    weiter(value.byteLength);
  }
  const blob = new Blob(teile);
  if ((await pruefsumme(await blob.arrayBuffer())) !== datei.sha256) {
    throw new Spielfehler("fehler.paket.pruefsumme", { pfad: datei.pfad });
  }
  const typ = antwort.headers.get("content-type") ?? "application/octet-stream";
  await speicher.put(adresse(datei.pfad), new Response(blob, { headers: { "content-type": typ } }));
}
