/**
 * Frage und Antwort der Aufgabe „Bilanz zählen“ in knapper Form: „d4: Lohnt sich Schlagen?“ mit
 * ⓘ für die Regel; nach der Antwort ein Banner mit dem richtigen Wert als Chip, die Zählung
 * „⚔ 2 : 🛡 1“ mit Zugfolge und kleine Marken für Verdeckt, Abzug, Fesselung und Batterie.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, P11 (Wahl des Autors, 31.10.2026). Teil des
 * Zähltrainers (Zaehltrainer.tsx). Nichts geht verloren: Die Regel, der Schalter „Genauer üben“,
 * die Rechnung des Werkzeugs „Zählen“ als Satz und jeder Motivsatz mit Buchbezug stehen hinter
 * einem Infoknopf; die eigene Antwort bleibt am gedrückten Ergebnisknopf sichtbar.
 * Abhängigkeiten: analyse/k1-zaehlen.ts, analyse/stellungsprofil.ts, schach/, training/
 * zaehltrainer.ts (Typ), bausteine/InfoKnopf.tsx, lucide-react, i18n.
 * Buchbezug: Kapitel 1, „Werte von Angreifer und Verteidiger zählen“.
 */
import {
  Check,
  EyeOff,
  Layers,
  Link2,
  Shield,
  Swords,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { zaehle } from "../../analyse/k1-zaehlen";
import { profil } from "../../analyse/stellungsprofil";
import { figurenname } from "../../analyse/texte";
import type { Angreifer } from "../../schach/angreifer";
import { sprache, t, figurenbuchstaben } from "../../i18n/sprache";
import { ROLLENBUCHSTABE, feldAusName, feldname, stellungAusFen } from "../../schach/stellung";
import type { Stellung } from "../../schach/stellung";
import type { Zaehlaufgabe } from "../../training/zaehltrainer";
import { MitInfo } from "../komponenten/bausteine/InfoKnopf";
import { bilanztext } from "./zaehltexte";

const SYMBOLGROESSE = 20;
const KLEIN = 16;

/** Kurzname einer Figur wie in der Notation: „Dd1“, beim Bauern nur das Feld („c5“). */
function kurzname(stellung: Stellung | null, feld: string): string {
  const quadrat = feldAusName(feld);
  const figur = quadrat !== null && stellung ? stellung.brett.get(quadrat) : undefined;
  if (!figur || figur.role === "pawn") return feld;
  const buchstabe = ROLLENBUCHSTABE[figur.role].toUpperCase();
  return `${figurenbuchstaben(sprache())[buchstabe] ?? buchstabe}${feld}`;
}

/** Langer Name einer Figur für die Sätze: „Dame d1“, „Bauer c5“. */
function langname(stellung: Stellung | null, feld: string): string {
  const quadrat = feldAusName(feld);
  const figur = quadrat !== null && stellung ? stellung.brett.get(quadrat) : undefined;
  return quadrat !== null && figur ? figurenname({ feld: quadrat, figur }) : feld;
}

/**
 * Die Frage, groß, mit ⓘ: Regel (zu Ende tauschen, billigste Figur zuerst) und, solange nicht
 * beantwortet, der Schalter „Genauer üben“. Beispiel: „d4: Lohnt sich Schlagen?“.
 */
export function Zaehlfrage({
  feld,
  schalter,
}: {
  feld: string;
  /** Der Schalter „Genauer üben“ / „Nur das Ergebnis angeben“, oder null nach der Antwort. */
  schalter: ReactNode;
}) {
  return (
    <MitInfo
      thema={t("wenigertext.werkzeug.zaehlen.regelThema")}
      zeile={<h2 className="trainerfrage">{t("wenigertext.werkzeug.zaehlen.frage", { feld })}</h2>}
      erklaerung={
        <>
          <p>{t("wenigertext.werkzeug.zaehlen.regel", { feld })}</p>
          {schalter}
        </>
      }
    />
  );
}

/**
 * Banner nach der Antwort: ✓ „Richtig!“ oder ✗ „Nicht ganz · richtig:“ mit dem Wert als Chip.
 * Beispiel: Antwort „lohnt nicht“, richtig +1 → „✗ Nicht ganz · richtig: [+1]“.
 */
export function Zaehlbanner({ richtig, loesung }: { richtig: boolean; loesung: number }) {
  const Bild = richtig ? Check : X;
  return (
    <p className={`meldung antwortbanner ${richtig ? "gut" : "schlecht"}`} role="status">
      <Bild size={SYMBOLGROESSE} aria-hidden="true" />
      <span>{t(richtig ? "trainer.richtig" : "wenigertext.werkzeug.zaehlen.nichtGanz")}</span>
      <span className="ergebnischip">{bilanztext(loesung)}</span>
    </p>
  );
}

/** Anzahl und Namen einer Seite aus dem Befund des Werkzeugs „Zählen“. */
function seite(zeilen: readonly string[]): { anzahl: number; namen: string } {
  const keine = zeilen.length === 1 && zeilen[0] === t("zaehlen.keine");
  return { anzahl: keine ? 0 : zeilen.length, namen: zeilen.join(", ") };
}

/** Ein Schlag in Kurzschreibweise wie im Buch: „cxd4“, „Sxd4“. */
function schlagtext(figur: Angreifer, feld: string): string {
  if (figur.rolle === "pawn") return `${feldname(figur.feld).charAt(0)}x${feld}`;
  const buchstabe = ROLLENBUCHSTABE[figur.rolle].toUpperCase();
  return `${figurenbuchstaben(sprache())[buchstabe] ?? buchstabe}x${feld}`;
}

/** Die lohnenden Schläge als Folge: „Sxd4 Sxd4 Dxd4“ (leer, wenn Schlagen nicht lohnt). */
function zugfolge(stellung: Stellung, feld: string): string {
  const ziel = feldAusName(feld);
  if (ziel === null) return "";
  const ergebnis = profil(stellung).abtausch(ziel);
  if (!ergebnis || ergebnis.bilanz <= 0) return "";
  return ergebnis.schlagfolge
    .slice(0, ergebnis.lohnendeSchlaege)
    .map((s) => schlagtext(s.figur, feld))
    .join(" ");
}

/** Ein Zahlzeichen der Zählung: Schwerter für Angreifer, Schild für Verteidiger. */
function Zahl({ Bild, anzahl, name }: { Bild: LucideIcon; anzahl: number; name: string }) {
  return (
    <span className="zaehlzahl" role="img" aria-label={`${name}: ${anzahl}`}>
      <Bild size={SYMBOLGROESSE} aria-hidden="true" />
      <strong aria-hidden="true">{anzahl}</strong>
    </span>
  );
}

/**
 * Die Rechnung der App nach der Antwort: „⚔ 2 : 🛡 1 Sc6, Db6 gegen Sf3“, darunter die Zugfolge;
 * ⓘ zeigt die Rechnung als Sätze wie das Werkzeug „Zählen“.
 */
export function Zaehlrechnung({ fen, feld }: { fen: string; feld: string }) {
  const rechnung = useMemo(() => {
    const gelesen = stellungAusFen(fen);
    const ziel = feldAusName(feld);
    if (!gelesen.ok || ziel === null) return null;
    return { stellung: gelesen.wert, ergebnis: zaehle(gelesen.wert, ziel) };
  }, [fen, feld]);
  if (!rechnung) return null;
  const [angriff, deckung] = rechnung.ergebnis.befunde;
  if (!angriff || !deckung) return null;
  const a = seite(angriff.zeilen);
  const v = seite(deckung.zeilen);
  const folge = zugfolge(rechnung.stellung, feld);
  return (
    <section className="karte zaehlrechnung" data-testid="zaehl-rechnung">
      <MitInfo
        thema={rechnung.ergebnis.ueberschrift}
        zeile={
          <p className="zaehlstand">
            <Zahl Bild={Swords} anzahl={a.anzahl} name={angriff.titel} />
            <span aria-hidden="true">:</span>
            <Zahl Bild={Shield} anzahl={v.anzahl} name={deckung.titel} />
            <span className="zaehlnamen">
              {t("wenigertext.werkzeug.zaehlen.namen", {
                angreifer: a.namen,
                verteidiger: v.namen,
              })}
            </span>
          </p>
        }
        erklaerung={
          <>
            {rechnung.ergebnis.befunde.map((b) => (
              <p key={b.kennung}>
                <strong>{b.titel}:</strong> {b.zeilen.join(", ")}
              </p>
            ))}
            <p>{rechnung.ergebnis.fazit}</p>
          </>
        }
      />
      {folge && <p className="zaehlfolge">{folge}</p>}
    </section>
  );
}

/** Eine kleine Marke mit Zeichen und Stichwort, dahinter der Satz mit Buchbezug. */
function Marke({
  Bild,
  text,
  satz,
  testid,
}: {
  Bild: LucideIcon;
  text: string;
  satz: string;
  testid: string;
}) {
  return (
    <div className="zaehlmarke" data-testid={testid}>
      <MitInfo
        thema={text}
        zeile={
          <span className="statuschip markenchip">
            <Bild size={KLEIN} aria-hidden="true" />
            {text}
          </span>
        }
        erklaerung={<p>{satz}</p>}
      />
    </div>
  );
}

/**
 * Die Motive der Aufgabe als Marken: Fesselung, Batterie, Verdeckt, Abzug; je der ganze Satz mit
 * Buchbezug hinter ⓘ. Beispiel: „👁 Dd1 verdeckt ⓘ“ → „Verdeckt: Dame d1 steht hinter …“.
 */
export function Motivmarken({ aufgabe }: { aufgabe: Zaehlaufgabe }) {
  const stellung = useMemo(() => {
    const gelesen = stellungAusFen(aufgabe.fen);
    return gelesen.ok ? gelesen.wert : null;
  }, [aufgabe.fen]);
  const lang = (feld: string) => langname(stellung, feld);
  const gefesselt = aufgabe.gefesselt;
  return (
    <div className="zaehlmarken">
      {gefesselt.length > 0 && (
        <Marke
          Bild={Link2}
          testid="zaehl-fesselung"
          text={t("wenigertext.werkzeug.zaehlen.gefesselt", {
            figuren: gefesselt.map((f) => kurzname(stellung, f)).join(", "),
          })}
          satz={t("zaehltrainer.fesselung", { figuren: gefesselt.map(lang).join(", ") })}
        />
      )}
      {aufgabe.motive.includes("batterie") && (
        <Marke
          Bild={Layers}
          testid="zaehl-batterie"
          text={t("wenigertext.werkzeug.zaehlen.batterie")}
          satz={t("zaehltrainer.batterie")}
        />
      )}
      {aufgabe.abzug.map((p) => (
        <Marke
          key={`${p.hinten}-${p.vorn}`}
          Bild={p.deckt ? EyeOff : Zap}
          testid="zaehl-abzug"
          text={t(
            p.deckt
              ? "wenigertext.werkzeug.zaehlen.verdeckt"
              : "wenigertext.werkzeug.zaehlen.abzug",
            {
              figur: kurzname(stellung, p.hinten),
            },
          )}
          satz={t(p.deckt ? "zaehltrainer.abzugDeckung" : "zaehltrainer.abzug", {
            hinten: lang(p.hinten),
            vorn: lang(p.vorn),
          })}
        />
      ))}
    </div>
  );
}
