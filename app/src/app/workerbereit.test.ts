/**
 * Tests für das Warten auf einen wirklich aktiven Service Worker (V1) und den Takt der
 * Update-Suche (V3, beide Nutzungsprüfung 25.10.2026).
 */
import { describe, expect, it } from "vitest";
import { updateFaellig, warteAufAktivenWorker, type WorkerContainer } from "./workerbereit";

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

describe("updateFaellig", () => {
  const NEUN_UHR = Date.UTC(2026, 9, 25, 9, 0);
  const MINUTE = 60_000;

  it("sucht höchstens einmal je Stunde", () => {
    expect(updateFaellig(NEUN_UHR, NEUN_UHR + 40 * MINUTE)).toBe(false);
    expect(updateFaellig(NEUN_UHR, NEUN_UHR + 60 * MINUTE)).toBe(true);
    expect(updateFaellig(NEUN_UHR, NEUN_UHR + 65 * MINUTE)).toBe(true);
  });

  it("zählt eine zurückgestellte Uhr als fällig", () => {
    expect(updateFaellig(NEUN_UHR, NEUN_UHR - MINUTE)).toBe(true);
  });
});
