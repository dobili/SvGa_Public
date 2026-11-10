// Bedingungen über Dialogvariablen für die Gesamtsimulation: dieselbe Sprache wie
// app/src/abenteuer/regeln/bedingung.ts (Variable, Vergleich mit Zahl, "Text" oder wahr/falsch,
// nicht, und, oder, Klammern; und bindet stärker). Änderungen gehören in alle drei Fassungen
// (auch pipeline/abenteuer/bedingung.py). Beispiel: erfuellt("nadelMapleFalls >= 1", {nadelMapleFalls: 2}) → true.
"use strict";

const ZEICHEN =
  /\s*(\(|\)|==|!=|>=|<=|>|<|"[^"]*"|-?\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_]*)/y;
const VERGLEICHE = ["==", "!=", ">=", "<=", ">", "<"];
const WORTWERTE = { wahr: true, true: true, falsch: false, false: false };

function zerlege(text) {
  const zeichen = [];
  ZEICHEN.lastIndex = 0;
  while (ZEICHEN.lastIndex < text.length) {
    if (text.slice(ZEICHEN.lastIndex).trim() === "") break;
    const t = ZEICHEN.exec(text);
    if (!t) throw new Error(`Bedingung „${text}“: unlesbar`);
    zeichen.push(t[1]);
  }
  return zeichen;
}

function wertAus(z, text) {
  if (z.startsWith('"')) return z.slice(1, -1);
  if (/^-?\d/.test(z)) return Number(z);
  if (z in WORTWERTE) return WORTWERTE[z];
  throw new Error(`Bedingung „${text}“: „${z}“ ist kein Wert`);
}

function vergleiche(links, op, rechts) {
  const leer =
    typeof rechts === "number" ? 0 : typeof rechts === "string" ? "" : false;
  const l = links === undefined || links === null ? leer : links;
  if (op === "==") return l === rechts;
  if (op === "!=") return l !== rechts;
  if (typeof l !== "number" || typeof rechts !== "number") return false;
  if (op === ">=") return l >= rechts;
  if (op === "<=") return l <= rechts;
  return op === ">" ? l > rechts : l < rechts;
}

/** Ob die Bedingung für diese Variablen gilt; wirft bei einer fehlerhaften Bedingung. */
function erfuellt(text, variablen) {
  const z = zerlege(text);
  let i = 0;
  const fehler = (was) => {
    throw new Error(`Bedingung „${text}“: ${was}`);
  };
  function einfach() {
    const t = z[i++];
    if (t === "(") {
      const w = oder();
      if (z[i++] !== ")") fehler("„)“ fehlt");
      return w;
    }
    if (!t || !/^[A-Za-z_]/.test(t) || t in WORTWERTE)
      fehler("Variable erwartet");
    const op = z[i];
    if (!VERGLEICHE.includes(op)) return Boolean(variablen[t]);
    i++;
    const rechts = z[i++];
    if (rechts === undefined) fehler("Wert fehlt");
    return vergleiche(variablen[t], op, wertAus(rechts, text));
  }
  function nicht() {
    if (z[i] !== "nicht") return einfach();
    i++;
    return !nicht();
  }
  function und() {
    let w = nicht();
    while (z[i] === "und") {
      i++;
      const r = nicht();
      w = w && r;
    }
    return w;
  }
  function oder() {
    let w = und();
    while (z[i] === "oder") {
      i++;
      const r = und();
      w = w || r;
    }
    return w;
  }
  const w = oder();
  if (i < z.length) fehler(`unerwartet „${z[i]}“`);
  return w;
}

module.exports = { erfuellt };
