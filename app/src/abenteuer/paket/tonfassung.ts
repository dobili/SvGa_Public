/**
 * Welche Fassung des Tons dieses Gerät lädt: Opus (WebM) oder AAC (m4a). Entscheidung des Autors
 * RO41, 26.11.2026.
 *
 * Rolle im Gesamtbild: Der Paketbau legt neben jede AAC-Datei (musik/weg.m4a) eine Opus-Fassung
 * (musik/weg.webm, 20 bis 30 % kleiner; skripte/opusfassungen.mjs). Beide stehen im Verzeichnis
 * des Pakets, das Gerät lädt und behält nur eine: Der Paketlader setzt den Namen um (`tonpfad`)
 * und lässt beim Nachladen die andere Fassung aus (`passtZurFassung`). Aufrufer (Tonspieler,
 * Spuren, Vorabladen) nennen weiter den m4a-Namen.
 * Warum eine Probe: Safari dekodiert Opus in WebM über decodeAudioData erst ab iOS 17.4; ältere
 * iPhones blieben sonst stumm. `canPlayType` allein ist dort nicht verlässlich (es kann „maybe“
 * sagen, obwohl decodeAudioData scheitert). Deshalb beim ersten Bedarf einmal je Sitzung: Kennt
 * das Gerät den Typ, und dekodiert es eine winzige Opus-Datei (60 ms Stille, 526 Bytes)? Nur dann
 * Opus, sonst AAC. Ogg/Opus wäre die andere Wahl, Safari kann es aber erst ab iOS 18.4.
 * Sonderfälle: ohne Web Audio oder ohne Dokument (Tests, Server) AAC; hängt die Probe, gilt nach
 * PROBE_ZEITLIMIT_MS AAC. Wechselt ein Gerät später die Fassung (neues iOS), lädt es den Ton neu;
 * die alte Fassung bleibt bis zur nächsten Paketversion im Cache.
 * Abhängigkeiten: Browser-Schnittstellen HTMLAudioElement und OfflineAudioContext.
 */

/** Die zwei Fassungen des Tons. */
export type Tonfassung = "opus" | "aac";

/** MIME-Typ der Opus-Fassung (WebM-Container). */
export const OPUS_TYP = 'audio/webm; codecs="opus"';
/** So lange darf die Probe dauern; danach AAC (manche Safari antworten nie auf Fehler). */
export const PROBE_ZEITLIMIT_MS = 2000;
const AAC_ENDUNG = /\.m4a$/;
const OPUS_ENDUNG = /\.webm$/;
/** Abtastrate der Probe (Opus dekodiert immer mit 48 kHz). */
const PROBE_RATE = 48000;

/**
 * 60 ms Stille, Opus in WebM (ffmpeg, libopus 6 kbit/s Mono, ohne Metadaten), Base64 in Stücken.
 * Erzeugt mit: ffmpeg -f lavfi -i anullsrc=r=48000:cl=mono -t 0.06 -c:a libopus -b:a 6k
 * -map_metadata -1 -fflags +bitexact -flags:a +bitexact -f webm probe.webm
 */
const OPUS_PROBE = [
  "GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwEAAAAAAAHeEU2bdLpNu4tTq4QVSalmU6yBoU27i1Or",
  "hBZUrmtTrIHGTbuMU6uEElTDZ1OsggEwTbuMU6uEHFO7a1OsggHI7AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrX",
  "sYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBRAAAAAAAAFlSua+WuAQAAAAAAAFzXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCG",
  "hkFfT1BVU1aqg2MuoFa7hATEtACDgQLhkZ+BAbWIQOdwAAAAAABiZIEQY6KTT3B1c0hlYWQBATgBgLsAAAAAABJUw2fRc3PO",
  "Y8CLY8WIAAAAAAAAAAFnyJlFo4dFTkNPREVSRIeMTGF2YyBsaWJvcHVzZ8ihRaOIRFVSQVRJT05Eh5MwMDowMDowMC4wNjgw",
  "MDAwMDAAH0O2db3ngQCji4EAAIAIC+Y7I6tgo4qBABWACAissw7Go4qBACmACAissw7GoJOhioEAPQAICKyzDsZ1ooQAzf5g",
  "HFO7a5G7j7OBALeK94EB8YIBhvCBAw==",
].join("");

/** Was die Probe vom Browser braucht (in Tests eine Attrappe). */
export interface Opusumgebung {
  /** Wie HTMLMediaElement.canPlayType: "", "maybe" oder "probably". */
  canPlayType(typ: string): string;
  /** Dekodiert Bytes wie decodeAudioData; Ausgabe: Zahl der Abtastwerte. */
  dekodiere(bytes: ArrayBuffer): Promise<number>;
}

/** Die Probedatei als Bytes. */
export function opusProbe(): ArrayBuffer {
  const text = atob(OPUS_PROBE);
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
  return bytes.buffer;
}

/** Wartet höchstens `ms` auf ein Versprechen; danach `ersatz`. */
function hoechstens<T>(versprechen: Promise<T>, ms: number, ersatz: T): Promise<T> {
  return new Promise((fertig) => {
    const wecker = setTimeout(() => fertig(ersatz), ms);
    versprechen.then(
      (wert) => {
        clearTimeout(wecker);
        fertig(wert);
      },
      () => {
        clearTimeout(wecker);
        fertig(ersatz);
      },
    );
  });
}

/**
 * Wählt die Fassung für eine Umgebung: Opus nur, wenn der Typ bekannt ist und die Probe mit
 * Abtastwerten dekodiert. Beispiele: Chrome → „opus“; Safari auf iOS 16 (canPlayType "") → „aac“;
 * Safari, das „maybe“ sagt, aber nicht dekodiert → „aac“; ohne Umgebung → „aac“.
 */
export async function waehleTonfassung(
  umgebung: Opusumgebung | null,
  zeitlimitMs = PROBE_ZEITLIMIT_MS,
): Promise<Tonfassung> {
  if (!umgebung || umgebung.canPlayType(OPUS_TYP) === "") return "aac";
  const proben = await hoechstens(umgebung.dekodiere(opusProbe()), zeitlimitMs, 0);
  return proben > 0 ? "opus" : "aac";
}

type OfflineKonstruktor = new (
  kanaele: number,
  laenge: number,
  rate: number,
) => OfflineAudioContext;

/** Die Umgebung des Browsers, oder null ohne Dokument oder ohne Web Audio. */
export function browserumgebung(): Opusumgebung | null {
  if (typeof document === "undefined" || typeof window === "undefined") return null;
  const fenster = window as unknown as { webkitOfflineAudioContext?: OfflineKonstruktor };
  const Offline: OfflineKonstruktor | undefined =
    typeof OfflineAudioContext === "undefined"
      ? fenster.webkitOfflineAudioContext
      : OfflineAudioContext;
  if (!Offline) return null;
  const audio = document.createElement("audio");
  return {
    canPlayType: (typ) => audio.canPlayType(typ),
    // Rückruf-Form: Ältere Safari geben bei decodeAudioData kein Versprechen zurück.
    dekodiere: (bytes) =>
      new Promise((fertig, fehler) => {
        const ctx = new Offline(1, 1, PROBE_RATE);
        const ergebnis: Promise<AudioBuffer> | undefined = ctx.decodeAudioData(
          bytes,
          (puffer) => fertig(puffer.length),
          fehler,
        );
        void ergebnis?.catch(fehler);
      }),
  };
}

let gewaehlt: Promise<Tonfassung> | null = null;

/** Die Fassung dieses Geräts, einmal je Sitzung geprüft. */
export function tonfassung(): Promise<Tonfassung> {
  gewaehlt ??= waehleTonfassung(browserumgebung());
  return gewaehlt;
}

/** Nur für Tests: legt die Fassung fest (null: beim nächsten Aufruf neu prüfen). */
export function setzeTonfassung(fassung: Tonfassung | null): void {
  gewaehlt = fassung ? Promise.resolve(fassung) : null;
}

/** Die Opus-Fassung zu einem AAC-Pfad. Beispiel: „musik/weg.m4a“ → „musik/weg.webm“. */
export function opuspfad(pfad: string): string {
  return pfad.replace(AAC_ENDUNG, ".webm");
}

/**
 * Der Pfad, den das Gerät lädt: bei Opus die WebM-Fassung, wenn das Paket sie hat, sonst der
 * Name selbst. Ohne bekanntes Verzeichnis (Entwicklung) bleibt der m4a-Name.
 * Beispiel: („klang/fluss.m4a“, „opus“, {…, „klang/fluss.webm“}) → „klang/fluss.webm“.
 */
export function tonpfad(
  pfad: string,
  fassung: Tonfassung,
  pfade: ReadonlySet<string> | null | undefined,
): string {
  if (fassung !== "opus" || !pfade || !AAC_ENDUNG.test(pfad)) return pfad;
  const opus = opuspfad(pfad);
  return pfade.has(opus) ? opus : pfad;
}

/**
 * Auswahl beim Nachladen: Von zwei Fassungen einer Datei nur die des Geräts; Dateien ohne
 * zweite Fassung (Bilder, ogg, m4a ohne webm) immer. Beispiel bei „aac“: weg.m4a ja, weg.webm nein.
 */
export function passtZurFassung(
  fassung: Tonfassung,
  pfade: ReadonlySet<string>,
): (datei: { readonly pfad: string }) => boolean {
  return ({ pfad }) => {
    if (OPUS_ENDUNG.test(pfad)) return fassung === "opus";
    if (AAC_ENDUNG.test(pfad) && pfade.has(opuspfad(pfad))) return fassung === "aac";
    return true;
  };
}
