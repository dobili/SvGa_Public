/**
 * Messfühler der Ausdauerprüfung (abenteuer-ausdauer.spec.ts): was eine lange Sitzung im Browser
 * zurücklässt.
 *
 * Zwei Quellen:
 * - CDP (Chromium): Heap nach Speicherbereinigung, DOM-Knoten (auch abgehängte), Event-Listener,
 *   Dokumente (Performance.getMetrics, HeapProfiler.collectGarbage);
 * - ein Skript, das vor der App läuft und zählt, was die Seite anlegt und wieder freigibt:
 *   WebGL-Kontexte (jede Karte startet ein eigenes Phaser-Spiel) und ihre Texturen, Worker (Engine,
 *   Maia), AudioContexte und dekodierte Tonpuffer. Freigegeben heißt bei Kontexten: von der Speicherbereinigung
 *   eingesammelt (FinalizationRegistry) oder ausdrücklich verloren (WEBGL_lose_context).
 * Dazu die Bildrate: Bilder je Sekunde über zwei Sekunden (requestAnimationFrame).
 */
import type { CDPSession, Page } from "@playwright/test";

/** Ein Messpunkt der Reihe. */
export interface Messpunkt {
  readonly schritt: string;
  readonly kartenwechsel: number;
  readonly heapMB: number;
  readonly knoten: number;
  readonly listener: number;
  readonly dokumente: number;
  readonly kontexte: number;
  readonly texturen: number;
  readonly worker: number;
  readonly workerErzeugt: number;
  readonly audio: number;
  readonly tonMB: number;
  readonly leinwaende: number;
  readonly bilderJeSekunde: number;
}

/** Zähler im Browser (window.__ausdauer). */
interface Zaehler {
  kontexteLebend: number;
  texturenLebend: number;
  workerLebend: number;
  workerErzeugt: number;
  audioLebend: number;
  tonBytes: number;
}

const BYTES_JE_MB = 1024 * 1024;
const MESSDAUER_BILDRATE_MS = 2000;
const MS_JE_SEKUNDE = 1000;

/**
 * Läuft vor jedem Skript der Seite (page.addInitScript). Zählt lebende WebGL-Kontexte mit ihren
 * Texturen, Worker und AudioContexte; ein Kontext gilt als frei, wenn er verloren ist oder die
 * Speicherbereinigung ihn eingesammelt hat.
 */
export function zaehlerSkript(): void {
  const z = {
    kontexteLebend: 0,
    texturenLebend: 0,
    workerLebend: 0,
    workerErzeugt: 0,
    audioLebend: 0,
    tonBytes: 0,
  };
  (window as unknown as { __ausdauer: typeof z }).__ausdauer = z;
  const texturen = new WeakMap<object, { n: number; frei: boolean }>();
  const freigeben = (eintrag: { n: number; frei: boolean }) => {
    if (eintrag.frei) return;
    eintrag.frei = true;
    z.kontexteLebend -= 1;
    z.texturenLebend -= eintrag.n;
  };
  const register = new FinalizationRegistry<{ n: number; frei: boolean }>(freigeben);
  const holeKontext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (
    this: HTMLCanvasElement,
    ...args: Parameters<typeof holeKontext>
  ) {
    const kontext = holeKontext.apply(this, args) as object | null;
    if (kontext && /webgl/.test(String(args[0])) && !texturen.has(kontext)) {
      const eintrag = { n: 0, frei: false };
      texturen.set(kontext, eintrag);
      z.kontexteLebend += 1;
      register.register(kontext, eintrag);
      this.addEventListener("webglcontextlost", () => freigeben(eintrag));
    }
    return kontext;
  } as typeof holeKontext;
  for (const Art of [WebGLRenderingContext, WebGL2RenderingContext]) {
    const lege = Art.prototype.createTexture;
    const loesche = Art.prototype.deleteTexture;
    Art.prototype.createTexture = function (this: WebGLRenderingContext) {
      const e = texturen.get(this);
      if (e && !e.frei) {
        e.n += 1;
        z.texturenLebend += 1;
      }
      return lege.call(this);
    };
    Art.prototype.deleteTexture = function (this: WebGLRenderingContext, t: WebGLTexture | null) {
      const e = texturen.get(this);
      if (t && e && !e.frei) {
        e.n -= 1;
        z.texturenLebend -= 1;
      }
      loesche.call(this, t);
    };
  }
  const EchterWorker = window.Worker;
  window.Worker = class extends EchterWorker {
    constructor(...args: ConstructorParameters<typeof Worker>) {
      super(...args);
      z.workerLebend += 1;
      z.workerErzeugt += 1;
    }
    override terminate(): void {
      z.workerLebend -= 1;
      super.terminate();
    }
  };
  // Dekodierte Tonpuffer (Musik, Geräusche): lebend, bis die Speicherbereinigung sie einsammelt.
  const tonRegister = new FinalizationRegistry<number>((bytes) => {
    z.tonBytes -= bytes;
  });
  const dekodiere = BaseAudioContext.prototype.decodeAudioData;
  BaseAudioContext.prototype.decodeAudioData = function (
    this: BaseAudioContext,
    ...args: Parameters<typeof dekodiere>
  ) {
    return dekodiere.apply(this, args).then((puffer) => {
      const bytes = puffer.length * puffer.numberOfChannels * 4;
      z.tonBytes += bytes;
      tonRegister.register(puffer, bytes);
      return puffer;
    });
  } as typeof dekodiere;
  const EchtesAudio = window.AudioContext;
  if (EchtesAudio) {
    window.AudioContext = class extends EchtesAudio {
      constructor(...args: ConstructorParameters<typeof AudioContext>) {
        super(...args);
        z.audioLebend += 1;
      }
      override close(): Promise<void> {
        z.audioLebend -= 1;
        return super.close();
      }
    };
  }
}

/** Bilder je Sekunde über zwei Sekunden; läuft im Browser. */
function bildrate(dauer: number): Promise<number> {
  return new Promise((fertig) => {
    let bilder = 0;
    const anfang = performance.now();
    const schritt = (jetzt: number) => {
      bilder += 1;
      if (jetzt - anfang < dauer) requestAnimationFrame(schritt);
      else fertig((bilder * 1000) / (jetzt - anfang));
    };
    requestAnimationFrame(schritt);
  });
}

/** Eine CDP-Sitzung für die Seite mit eingeschalteten Leistungsmetriken. */
export async function oeffneMessung(seite: Page): Promise<CDPSession> {
  const cdp = await seite.context().newCDPSession(seite);
  await cdp.send("Performance.enable");
  return cdp;
}

/**
 * Misst nach zweifacher Speicherbereinigung (die zweite sammelt, was die erste nur freigab).
 * Beispiel: { schritt: "Kartenwechsel 40", heapMB: 61.2, knoten: 2140, kontexte: 1, … }.
 */
export async function miss(
  seite: Page,
  cdp: CDPSession,
  schritt: string,
  kartenwechsel: number,
): Promise<Messpunkt> {
  await cdp.send("HeapProfiler.collectGarbage");
  await seite.waitForTimeout(200);
  await cdp.send("HeapProfiler.collectGarbage");
  const { metrics } = await cdp.send("Performance.getMetrics");
  const wert = (name: string) => metrics.find((m) => m.name === name)?.value ?? 0;
  const z = await seite.evaluate(() => (window as unknown as { __ausdauer: Zaehler }).__ausdauer);
  const leinwaende = await seite.locator("canvas").count();
  const bilderJeSekunde = await seite.evaluate(bildrate, MESSDAUER_BILDRATE_MS);
  return {
    schritt,
    kartenwechsel,
    heapMB: Math.round((wert("JSHeapUsedSize") / BYTES_JE_MB) * 10) / 10,
    knoten: wert("Nodes"),
    listener: wert("JSEventListeners"),
    dokumente: wert("Documents"),
    kontexte: z.kontexteLebend,
    texturen: z.texturenLebend,
    worker: z.workerLebend,
    workerErzeugt: z.workerErzeugt,
    audio: z.audioLebend,
    tonMB: Math.round((z.tonBytes / BYTES_JE_MB) * 10) / 10,
    leinwaende,
    bilderJeSekunde: Math.round(bilderJeSekunde * 10) / 10,
  };
}

/** Eine Zeile für das Protokoll. */
export function zeile(p: Messpunkt): string {
  return (
    `${p.schritt.padEnd(22)} Heap ${p.heapMB} MB, Knoten ${p.knoten}, Listener ${p.listener}, ` +
    `Dokumente ${p.dokumente}, WebGL ${p.kontexte} (Texturen ${p.texturen}), Worker ${p.worker}/${p.workerErzeugt}, ` +
    `Audio ${p.audio} (Ton ${p.tonMB} MB), Leinwände ${p.leinwaende}, ${p.bilderJeSekunde} Bilder/s`
  );
}

export { MS_JE_SEKUNDE };
