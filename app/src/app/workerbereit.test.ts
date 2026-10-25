/** Tests für das Warten auf einen wirklich aktiven Service Worker (V1, Nutzungsprüfung 25.10.2026). */
import { describe, expect, it } from "vitest";
import { warteAufAktivenWorker, type WorkerContainer } from "./workerbereit";

/** Ein nachgebildeter Worker, dessen Zustand der Test weiterschaltet. */
function falscherWorker(anfang: ServiceWorkerState) {
  const hoerer = new Set<() => void>();
  const worker = {
    state: anfang,
    addEventListener: (_art: string, hoeren: () => void) => hoerer.add(hoeren),
    removeEventListener: (_art: string, hoeren: () => void) => hoerer.delete(hoeren),
  };
  const wechsle = (zustand: ServiceWorkerState) => {
    worker.state = zustand;
    [...hoerer].forEach((hoeren) => hoeren());
  };
  return { worker: worker as unknown as ServiceWorker, wechsle, hoerer };
}

function container(worker: ServiceWorker | null): WorkerContainer {
  return { ready: Promise.resolve({ active: worker }) };
}

describe("warteAufAktivenWorker", () => {
  it("ist bei einem schon aktivierten Worker sofort fertig", async () => {
    const { worker } = falscherWorker("activated");
    await expect(warteAufAktivenWorker(container(worker))).resolves.toBe(true);
  });

  it("wartet bei „activating“ auf „activated“ und meldet sich danach ab", async () => {
    const { worker, wechsle, hoerer } = falscherWorker("activating");
    let fertig: boolean | null = null;
    const warten = warteAufAktivenWorker(container(worker)).then((wert) => (fertig = wert));
    await Promise.resolve();
    await Promise.resolve();
    expect(fertig).toBeNull();
    wechsle("activated");
    await warten;
    expect(fertig).toBe(true);
    expect(hoerer.size).toBe(0);
  });

  it("meldet false, wenn der Worker unterwegs ersetzt wird", async () => {
    const { worker, wechsle } = falscherWorker("activating");
    const warten = warteAufAktivenWorker(container(worker));
    await Promise.resolve();
    wechsle("redundant");
    await expect(warten).resolves.toBe(false);
  });

  it("meldet false ohne aktiven Worker", async () => {
    await expect(warteAufAktivenWorker(container(null))).resolves.toBe(false);
  });
});
