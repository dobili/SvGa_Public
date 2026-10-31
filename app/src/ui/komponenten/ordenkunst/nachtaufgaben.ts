/**
 * Bilder der Kapitelaufgaben auf dem Lernpfad (Übungen, Lernziele und Trainer eines Kapitels) im
 * Nachtstil der Abzeichen, ohne Kranz (Wunsch des Autors, 31.10.2026: Nebenaufgaben neben den
 * Stationen). Dieselben Motive wie die Orden des ganzen Buches (Brett, Haken, Hantel), damit man
 * auf einen Blick sieht, wohin die Aufgabe zählt; Form und Farbe unterscheiden sie von ihnen.
 * Abhängigkeiten: nachtstil.ts (Typ).
 */
import type { Nachtangabe } from "./nachtstil";

/** Je Art der Kapitelaufgabe ein Bild (Kennungen wie lernpfad/kapitelaufgaben.ts). */
export const AUFGABENBILDER: Readonly<Record<string, Nachtangabe>> = {
  uebungen: { form: "rundquadrat", motiv: "brett", akzent: "#ff5a5a" },
  lernziele: { form: "sechseck", motiv: "haken", akzent: "#3ddc84" },
  trainer: { form: "kreis", motiv: "hantel", akzent: "#ff8a2b" },
};
