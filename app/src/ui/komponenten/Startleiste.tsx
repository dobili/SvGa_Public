/**
 * Feste Startleiste unten auf dem Bildschirm Spielen: Bild und Name des Gegners, Farbe, Bedenkzeit
 * und Wertung, daneben „Partie beginnen“ (seit 0.2.129, Vorschlag DS40, vom Autor am 25.10.2026
 * freigegeben).
 *
 * Rolle im Gesamtbild: „Partie beginnen“ stand bis 0.2.128 mitten auf der Seite (über dem Gitter
 * der Bots, über den Reglern der eigenen Stufe, ausgegraut über dem Formular eigener Bots); wer
 * unten etwas einstellte, musste zurückscrollen und sah nicht, was gewählt war. Die Leiste klebt
 * über der Navigation (CSS position: sticky) und gleitet erst über der Partienliste an ihren Platz.
 * Ein Tipp auf die Zusammenfassung springt zur Gegnerwahl. Der Knopf selbst mit der Rückfrage bei
 * laufender Partie bleibt BeginnenKnopf.tsx.
 * Abhängigkeiten: BeginnenKnopf, GegnerBild, Stufenmarke, engine/gegner.ts, engine/gruppe.ts, i18n.
 */
import { UserPen, Users } from "lucide-react";
import type { ReactNode } from "react";
import { gegnerVon, type EigenerGegner } from "../../engine/gegner";
import { gruppenstufe } from "../../engine/gruppe";
import type { Stufennummer } from "../../engine/stufen";
import { t } from "../../i18n/sprache";
import type { Farbe } from "../../schach/stellung";
import { GegnerBild } from "./GegnerBild";
import type { Gegnerkategorie } from "./gegnerkategorie";
import { Stufenmarke } from "./Stufenmarke";

const ZEICHENGROESSE = 24;

/** Was die Leiste über den Gegner zeigt. */
export interface Startangaben {
  readonly gegner: "engine" | "mensch";
  readonly bot: string | null;
  readonly kategorie: Gegnerkategorie;
  readonly stufe: Stufennummer;
  readonly eigene: readonly EigenerGegner[];
  readonly farbe: Farbe;
  /** „10 + 0“ oder „Ohne Uhr“ (kurz seit DS50). */
  readonly uhr: string;
  /** Zählt die Partie wirklich (Haken gesetzt und wertbar)? */
  readonly gewertet: boolean;
}

/** „Eigene Bots“ gewählt, aber noch kein eigener Bot: Dann lässt sich nicht beginnen. */
function ohneEigenenBot(a: Startangaben): boolean {
  return (
    a.gegner === "engine" && a.kategorie === "eigene" && !a.eigene.some((g) => g.kennung === a.bot)
  );
}

/** Bild und Name des Gegners. Beispiel: Bot „tom“ → Porträt und „Tom“. */
function gegnerangabe(a: Startangaben): { bild: ReactNode; name: string } {
  if (ohneEigenenBot(a)) {
    return {
      bild: <UserPen size={ZEICHENGROESSE} aria-hidden="true" />,
      name: t("spielen.startleiste.keinBot"),
    };
  }
  if (a.gegner === "mensch") {
    return {
      bild: <Users size={ZEICHENGROESSE} aria-hidden="true" />,
      name: t("spielen.gegner.mensch"),
    };
  }
  const gruppe = gruppenstufe(a.bot);
  if (gruppe !== null) {
    return {
      bild: <Stufenmarke stufe={gruppe} />,
      name: t("spielen.startleiste.gruppe", { nummer: String(gruppe) }),
    };
  }
  const name = gegnerVon(a.bot)?.name ?? a.eigene.find((g) => g.kennung === a.bot)?.name;
  if (a.kategorie !== "stufe" && a.bot && name) {
    return { bild: <GegnerBild bot={a.bot} eigene={a.eigene} name={name} />, name };
  }
  return { bild: <Stufenmarke stufe={a.stufe} />, name: t("spielen.kategorie.stufe") };
}

/**
 * Die Leiste. `knopf` ist der BeginnenKnopf; `ziel` die Kennung der Gegnerwahl zum Hinspringen.
 * Beispiel: Tom, Weiß, Schnellschach 10 + 0, gewertet.
 */
export function Startleiste({
  angaben,
  ziel,
  knopf,
}: {
  angaben: Startangaben;
  ziel: string;
  knopf: ReactNode;
}) {
  const { bild, name } = gegnerangabe(angaben);
  const zeile = ohneEigenenBot(angaben)
    ? t("spielen.startleiste.keinBotHinweis")
    : [
        angaben.gegner === "engine"
          ? t(
              angaben.farbe === "white"
                ? "spielen.startleiste.farbe.white"
                : "spielen.startleiste.farbe.black",
            )
          : null,
        angaben.uhr,
        t(angaben.gewertet ? "spielen.startleiste.gewertet" : "spielen.startleiste.ungewertet"),
      ]
        .filter((teil) => teil !== null)
        .join(" · ");
  return (
    <div className="startleiste" data-testid="startleiste">
      <button
        type="button"
        className="startleiste-wer"
        aria-label={t("spielen.startleiste.zurWahl", { name })}
        // Kein Link mit „#“: Die Adresse nach „#“ wählt in dieser App den Bildschirm.
        onClick={() => document.getElementById(ziel)?.scrollIntoView({ block: "start" })}
      >
        <span className="startleiste-bild">{bild}</span>
        <span className="startleiste-text">
          <strong>{name}</strong>
          <span>{zeile}</span>
        </span>
      </button>
      {knopf}
    </div>
  );
}
