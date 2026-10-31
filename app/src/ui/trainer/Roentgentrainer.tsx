/**
 * Aufgabe des Schach-Röntgen-Trainers: in drei Schritten Pfeile setzen, die App gleicht ab.
 *
 * Rolle im Gesamtbild: Trainer „roentgen“ (AP 13). Schritt 1 deine Schachs, Schritt 2 deine
 * Schläge, Schritt 3 Schachs und Schläge des Gegners, als wäre er am Zug (training/
 * roentgentrainer.ts). Pfeil setzen: Figur antippen, dann Zielfeld; derselbe Pfeil nochmals
 * nimmt ihn weg. Nach „Prüfen“: Gold gefunden, Rot übersehen, Grau gehört nicht dazu.
 * Abhängigkeiten: training/roentgentrainer.ts, schach/weiterspielen.ts, Trainerbrett.
 */
import type { Color } from "chessops/types";
import { useMemo, useState } from "react";
import { farbname } from "../../analyse/texte";
import type { Markierung, Markierungsfarbe } from "../../analyse/werkzeug";
import { t, tZahl } from "../../i18n/sprache";
import { stellungAusFen } from "../../schach/stellung";
import { legaleZiele } from "../../schach/weiterspielen";
import {
  fenMitZugrecht,
  SCHRITTE,
  vergleicheSchritt,
  type Pfeil,
  type Roentgenaufgabe,
  type Schrittvergleich,
} from "../../training/roentgentrainer";
import { gegnerdrohungen, roentgenbegruendungen } from "../../training/roentgenbegruendung";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";

/** Der Auftrag je Schritt; Schritt 2 und 3 mit den klareren Texten (Nebenchat, 30.10.2026). */
const AUFTRAG = {
  schachs: "roentgentrainer.schachs",
  schlaege: "roentgentrainer.schlaegeKlar",
  gegner: "roentgentrainer.gegnerKlar",
} as const;

function alsMarkierung(pfeil: Pfeil, farbe: Markierungsfarbe): Markierung {
  const [von = "", nach = ""] = pfeil.split("-");
  return { typ: "pfeil", farbe, von, nach };
}

function abgleichspfeile(vergleich: Schrittvergleich): Markierung[] {
  return [
    ...vergleich.gefunden.map((p) => alsMarkierung(p, "gold")),
    ...vergleich.fehlend.map((p) => alsMarkierung(p, "rot")),
    ...vergleich.falsch.map((p) => alsMarkierung(p, "grau")),
  ];
}

/** Pfeile setzen und wegnehmen: erst die Figur, dann das Zielfeld. */
function usePfeile(fen: string) {
  const [pfeile, setzePfeile] = useState<readonly Pfeil[]>([]);
  const [gewaehlt, setzeGewaehlt] = useState<string | null>(null);
  const ziele = gewaehlt ? legaleZiele(fen, gewaehlt) : [];
  const beiFeld = (feld: string) => {
    if (gewaehlt && ziele.includes(feld)) {
      const pfeil = `${gewaehlt}-${feld}`;
      setzePfeile(pfeile.includes(pfeil) ? pfeile.filter((p) => p !== pfeil) : [...pfeile, pfeil]);
      setzeGewaehlt(null);
      return;
    }
    setzeGewaehlt(legaleZiele(fen, feld).length > 0 && feld !== gewaehlt ? feld : null);
  };
  const leere = () => {
    setzePfeile([]);
    setzeGewaehlt(null);
  };
  return { pfeile, gewaehlt, ziele, beiFeld, leere };
}

/**
 * Eine Röntgen-Aufgabe in drei Schritten.
 *
 * Sonderfall: Gibt es in einem Schritt nichts zu markieren, ist „Prüfen“ ohne Pfeil richtig.
 */
export function Roentgenaufgabe({ aufgabe, runde }: { aufgabe: Roentgenaufgabe; runde: Runde }) {
  const stellung = useMemo(() => {
    const gelesen = stellungAusFen(aufgabe.fen);
    return gelesen.ok ? gelesen.wert : null;
  }, [aufgabe.fen]);
  const [stelle, setzeStelle] = useState(0);
  const [ergebnisse, setzeErgebnisse] = useState<readonly Schrittvergleich[]>([]);
  const schritt = SCHRITTE[stelle] ?? "schachs";
  const loesung = aufgabe.schritte[schritt];
  const fen = stellung ? fenMitZugrecht(stellung, loesung.farbe) : aufgabe.fen;
  const eingabe = usePfeile(fen);
  const vergleich = ergebnisse[stelle] ?? null;
  const pruefe = () => {
    const neu = [...ergebnisse, vergleicheSchritt(loesung, eingabe.pfeile)];
    setzeErgebnisse(neu);
    if (neu.length === SCHRITTE.length) runde.beantworte(neu.every((v) => v.richtig));
  };
  const naechster = () => {
    eingabe.leere();
    setzeStelle(stelle + 1);
  };
  const markierungen = vergleich
    ? abgleichspfeile(vergleich)
    : eingabe.pfeile.map((p) => alsMarkierung(p, "gold"));
  return (
    <>
      <p>{t(AUFTRAG[schritt], { farbe: farbname(loesung.farbe) })}</p>
      <Trainerbrett
        fen={aufgabe.fen}
        markierungen={markierungen}
        {...(vergleich ? {} : { beiFeld: eingabe.beiFeld })}
        ausgewaehlt={eingabe.gewaehlt}
        ziele={eingabe.ziele}
        beschriftung={
          aufgabe.zugfolge
            ? t("roentgentrainer.ausZugfolge", aufgabe.zugfolge)
            : t("trainer.brettAus", { nummer: aufgabe.nummer })
        }
      />
      {!vergleich && (
        <>
          <p className="hinweis">{t("roentgentrainer.bedienung")}</p>
          <button type="button" className="knopf-haupt" onClick={pruefe}>
            {t("trainer.pruefen")}
          </button>
        </>
      )}
      {vergleich && <Schrittergebnis vergleich={vergleich} />}
      {vergleich && <Pfeilgruende aufgabe={aufgabe} farbe={loesung.farbe} vergleich={vergleich} />}
      {vergleich && schritt === "gegner" && <Drohungen aufgabe={aufgabe} />}
      {vergleich && stelle + 1 < SCHRITTE.length && (
        <button type="button" className="knopf-haupt" onClick={naechster}>
          {t("roentgentrainer.naechsterSchritt")}
        </button>
      )}
      {runde.ergebnis !== null && (
        <p className="hinweis">
          {tZahl("roentgentrainer.drohende", aufgabe.drohende.length, {
            anzahl: aufgabe.drohende.length,
          })}
        </p>
      )}
    </>
  );
}

function Schrittergebnis({ vergleich }: { vergleich: Schrittvergleich }) {
  const verlangt = vergleich.gefunden.length + vergleich.fehlend.length;
  return (
    <>
      <Antwortmeldung richtig={vergleich.richtig}>
        {t("roentgentrainer.gefunden", {
          gefunden: vergleich.gefunden.length,
          verlangt,
          falsch: vergleich.falsch.length,
        })}
      </Antwortmeldung>
      <p className="hinweis">{t("trainer.legendePfeile")}</p>
    </>
  );
}

/** Zu jedem übersehenen und zu viel gesetzten Pfeil der Grund (Regel L, Nebenchat). */
function Pfeilgruende({
  aufgabe,
  farbe,
  vergleich,
}: {
  aufgabe: Roentgenaufgabe;
  farbe: Color;
  vergleich: Schrittvergleich;
}) {
  const fehlend = useMemo(
    () => roentgenbegruendungen(aufgabe, farbe, vergleich.fehlend),
    [aufgabe, farbe, vergleich.fehlend],
  );
  const falsch = useMemo(
    () => roentgenbegruendungen(aufgabe, farbe, vergleich.falsch),
    [aufgabe, farbe, vergleich.falsch],
  );
  if (fehlend.length === 0 && falsch.length === 0) return null;
  return (
    <section className="karte" data-testid="roentgen-begruendung">
      {fehlend.length > 0 && <strong>{t("roentgentrainer.grund.uebersehen")}</strong>}
      {fehlend.map((satz) => (
        <p key={satz}>{satz}</p>
      ))}
      {falsch.length > 0 && <strong>{t("roentgentrainer.grund.zuViel")}</strong>}
      {falsch.map((satz) => (
        <p key={satz}>{satz}</p>
      ))}
    </section>
  );
}

/** Nach Schritt 3: die Drohungen der Gegenseite, also ihre Schläge mit Gewinn. */
function Drohungen({ aufgabe }: { aufgabe: Roentgenaufgabe }) {
  const zuege = useMemo(() => gegnerdrohungen(aufgabe), [aufgabe]);
  if (zuege.length === 0) return null;
  return (
    <p className="hinweis" data-testid="roentgen-drohungen">
      {t("roentgentrainer.grund.drohungen", {
        farbe: farbname(aufgabe.schritte.gegner.farbe),
        zuege: zuege.join(", "),
      })}
    </p>
  );
}
