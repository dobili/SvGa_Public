/**
 * Aufgaben des Trainers „Koordinaten, Notation, Gangarten“ (Kapitel 0).
 *
 * Rolle im Gesamtbild: Trainer „koordinaten“ (AP 13) mit vier Übungsarten (training/
 * koordinatentrainer.ts): Feld finden auf dem leeren Brett ohne Koordinaten, gezeigten Zug
 * aufschreiben, notierten Zug ausführen, alle Zielfelder einer Figur antippen.
 * Abhängigkeiten: training/koordinatentrainer.ts, Trainerbrett, Brettbereich, Rundenrahmen.
 */
import { useMemo, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { sprache, t, tZahl } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { feldAusName, ROLLENBUCHSTABE, stellungAusFen, type Rolle } from "../../schach/stellung";
import { spieleZug } from "../../schach/weiterspielen";
import {
  pruefeAusfuehrung,
  pruefeNotation,
  type Feldaufgabe,
  type Gangartaufgabe,
  type Zugaufgabe,
} from "../../training/koordinatentrainer";
import { pruefeFelder } from "../../training/zaehltrainer";
import { Brettbereich } from "../komponenten/brettbedienung/Brettbereich";
import { useBrettbedienung } from "../komponenten/brettbedienung/useBrettbedienung";
import { gangartbegruendungen } from "../../training/gangartbegruendung";
import { Notationstastatur } from "./Notationstastatur";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";
import { abgleichsfelder, umschalten } from "./abgleich";

const LEERES_BRETT = "8/8/8/8/8/8/8/8 w - - 0 1";
const KEINE_WAHL = () => undefined;

/** Ein Zug in der Schreibweise des Buches („Sf3“). */
function buchzug(san: string): string {
  return sanInSprache(san, sprache());
}

function zugpfeil(aufgabe: Zugaufgabe, farbe: "gold" | "rot"): Markierung {
  return { typ: "pfeil", farbe, von: aufgabe.von, nach: aufgabe.nach };
}

/**
 * Aus welcher Sicht das Brett steht, deutlich unter dem Brett: ein weißer oder schwarzer Kreis
 * wie die Anzeige „am Zug“, dazu der Satz. Nach dem Drehen leuchtet die Anzeige kurz auf und
 * sagt es ausdrücklich (Wunsch des Autors, 30.10.2026: Der Wechsel fiel nicht auf).
 */
function Sichtanzeige({ gedreht, wechsel }: { gedreht: boolean; wechsel: boolean }) {
  return (
    <p
      className={wechsel ? "sichtanzeige sichtwechsel" : "sichtanzeige"}
      data-testid="sichtanzeige"
      aria-live="polite"
    >
      <span
        className={gedreht ? "sichtpunkt sichtpunkt-schwarz" : "sichtpunkt"}
        aria-hidden="true"
      />
      <span>
        {wechsel && <strong>{t("koordinatentrainer.gedrehtHinweis")} </strong>}
        {t(gedreht ? "koordinatentrainer.sichtSchwarz" : "koordinatentrainer.sichtWeiss")}
      </span>
    </p>
  );
}

/** Feld finden: Ein richtiger Tipp führt sofort weiter, ein falscher zeigt das Feld. */
export function Feldaufgabe({ aufgabe, runde }: { aufgabe: Feldaufgabe; runde: Runde }) {
  const [getippt, setzeGetippt] = useState<string | null>(null);
  const beiFeld = (feld: string) => {
    if (runde.ergebnis !== null) return;
    setzeGetippt(feld);
    runde.beantworte(feld === aufgabe.feld);
    if (feld === aufgabe.feld) runde.weiter();
  };
  const markierungen: Markierung[] =
    getippt && getippt !== aufgabe.feld
      ? [
          { typ: "feld", farbe: "grau", feld: getippt },
          { typ: "feld", farbe: "rot", feld: aufgabe.feld, text: aufgabe.feld },
        ]
      : [];
  return (
    <>
      <p className="trainer-auftrag" data-testid="feld-auftrag">
        {t("koordinatentrainer.feldAuftrag", { feld: aufgabe.feld })}
      </p>
      <Trainerbrett
        fen={LEERES_BRETT}
        markierungen={markierungen}
        beiFeld={beiFeld}
        gedreht={aufgabe.gedreht}
        ohneKoordinaten
        zeigeAmZug={false}
        beschriftung={t(
          aufgabe.gedreht ? "koordinatentrainer.sichtSchwarz" : "koordinatentrainer.sichtWeiss",
        )}
      />
      <Sichtanzeige gedreht={aufgabe.gedreht} wechsel={aufgabe.wechsel} />
      {runde.ergebnis === false && (
        <Antwortmeldung richtig={false}>
          {t("koordinatentrainer.feldFalsch", { feld: getippt ?? "" })}
        </Antwortmeldung>
      )}
    </>
  );
}

/** Das Eingabefeld für die Handytastatur (umschaltbar, für alle, die lieber tippen). */
function Tippfeld({
  eingabe,
  setze,
  gesperrt,
}: {
  eingabe: string;
  setze: (text: string) => void;
  gesperrt: boolean;
}) {
  return (
    <input
      type="text"
      aria-label={t("koordinatentrainer.eingabe")}
      placeholder={t("koordinatentrainer.beispiel")}
      value={eingabe}
      autoCapitalize="off"
      autoComplete="off"
      spellCheck={false}
      readOnly={gesperrt}
      onChange={(e) => setze(e.target.value)}
    />
  );
}

/**
 * Gezeigten Zug aufschreiben. Standard ist die Notationstastatur mit Bausteinen (Wunsch des
 * Autors, 30.10.2026); wer lieber tippt, schaltet auf das Eingabefeld um.
 */
export function Notieraufgabe({ aufgabe, runde }: { aufgabe: Zugaufgabe; runde: Runde }) {
  const [eingabe, setzeEingabe] = useState("");
  const [tasten, setzeTasten] = useState(true);
  const [pruefung, setzePruefung] = useState<ReturnType<typeof pruefeNotation> | null>(null);
  const pruefe = (ereignis: React.FormEvent) => {
    ereignis.preventDefault();
    if (pruefung || eingabe.trim() === "") return;
    const neu = pruefeNotation(aufgabe, eingabe);
    setzePruefung(neu);
    runde.beantworte(neu.richtig);
  };
  return (
    <>
      <p>
        {t(tasten ? "koordinatentrainer.notierAuftragTasten" : "koordinatentrainer.notierAuftrag")}
      </p>
      <Trainerbrett
        fen={aufgabe.fen}
        markierungen={[zugpfeil(aufgabe, "gold")]}
        beschriftung={t("koordinatentrainer.brett")}
      />
      <form className={tasten ? "tastenformular" : "eingabezeile"} onSubmit={pruefe}>
        {tasten ? (
          <Notationstastatur text={eingabe} setze={setzeEingabe} gesperrt={pruefung !== null} />
        ) : (
          <Tippfeld eingabe={eingabe} setze={setzeEingabe} gesperrt={pruefung !== null} />
        )}
        {!pruefung && (
          <button type="submit" className="knopf-haupt" disabled={eingabe.trim() === ""}>
            {t("trainer.pruefen")}
          </button>
        )}
      </form>
      {!pruefung && (
        <button type="button" className="knopf-link" onClick={() => setzeTasten(!tasten)}>
          {t(tasten ? "koordinatentrainer.lieberTippen" : "koordinatentrainer.lieberBausteine")}
        </button>
      )}
      {pruefung && (
        <Antwortmeldung richtig={pruefung.richtig}>
          {pruefung.englisch
            ? t("koordinatentrainer.englisch", { zug: buchzug(aufgabe.san) })
            : pruefung.schachVergessen
              ? t("koordinatentrainer.schachVergessen", { zug: buchzug(aufgabe.san) })
              : t("koordinatentrainer.loesung", { zug: buchzug(aufgabe.san) })}
        </Antwortmeldung>
      )}
    </>
  );
}

/** Notierten Zug ausführen (mit Rochade, en passant, Umwandlung). */
export function Ausfuehraufgabe({ aufgabe, runde }: { aufgabe: Zugaufgabe; runde: Runde }) {
  const [gespielt, setzeGespielt] = useState<{ fen: string; san: string } | null>(null);
  const fen = gespielt?.fen ?? aufgabe.fen;
  const stand = {
    fen,
    spiele: (von: string, nach: string, umwandlung?: Rolle) => {
      if (gespielt) return "ungueltig" as const;
      const versuch = spieleZug(aufgabe.fen, von, nach, umwandlung);
      if (versuch.art !== "gespielt") return versuch.art;
      setzeGespielt({ fen: versuch.fen, san: versuch.san });
      runde.beantworte(pruefeAusfuehrung(aufgabe, versuch.san));
      return "gespielt" as const;
    },
  };
  const bedienung = useBrettbedienung(stand, gespielt ? null : "ziehen", KEINE_WAHL);
  const stellung = useMemo(() => stellungAusFen(fen), [fen]);
  const richtig = runde.ergebnis === true;
  return (
    <>
      <p className="trainer-auftrag">
        {t("koordinatentrainer.ausfuehrAuftrag", { zug: buchzug(aufgabe.san) })}
      </p>
      {stellung.ok && (
        <Brettbereich
          stellung={stellung.wert}
          markierungen={gespielt && !richtig ? [zugpfeil(aufgabe, "rot")] : []}
          letzterZug={null}
          bedienung={bedienung}
          beschriftung={t("koordinatentrainer.brett")}
        />
      )}
      {aufgabe.nummer && (
        <p className="hinweis">{t("koordinatentrainer.ausBuch", { nummer: aufgabe.nummer })}</p>
      )}
      {gespielt && (
        <Antwortmeldung richtig={richtig}>
          {richtig ? "" : t("koordinatentrainer.gespielt", { zug: buchzug(gespielt.san) })}
        </Antwortmeldung>
      )}
    </>
  );
}

/** Alle Zielfelder einer Figur antippen. */
export function Gangartaufgabe({ aufgabe, runde }: { aufgabe: Gangartaufgabe; runde: Runde }) {
  const [getippt, setzeGetippt] = useState<readonly string[]>([]);
  const vergleich = pruefeFelder(aufgabe.ziele, getippt);
  const beantwortet = runde.ergebnis !== null;
  const rolle = useMemo(() => figurAuf(aufgabe.fen, aufgabe.feld), [aufgabe]);
  const markierungen: Markierung[] = beantwortet
    ? abgleichsfelder(vergleich)
    : getippt.map((feld) => ({ typ: "feld", farbe: "gold", feld }));
  return (
    <>
      <p>
        {t("koordinatentrainer.gangartAuftrag", {
          figur: rolle ? t(`figur.${ROLLENBUCHSTABE[rolle]}`) : "",
          feld: aufgabe.feld,
        })}
      </p>
      <Trainerbrett
        fen={aufgabe.fen}
        markierungen={markierungen}
        ausgewaehlt={aufgabe.feld}
        {...(beantwortet
          ? {}
          : { beiFeld: (feld: string) => setzeGetippt(umschalten(getippt, feld)) })}
        beschriftung={t("koordinatentrainer.brett")}
      />
      {!beantwortet && (
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => runde.beantworte(vergleich.richtig)}
        >
          {t("trainer.pruefen")}
        </button>
      )}
      {beantwortet && (
        <Antwortmeldung richtig={vergleich.richtig}>
          {tZahl("koordinatentrainer.ziele", aufgabe.ziele.length, {
            anzahl: aufgabe.ziele.length,
          })}
        </Antwortmeldung>
      )}
      {beantwortet && (
        <Gangartgruende aufgabe={aufgabe} fehlend={vergleich.fehlend} falsch={vergleich.falsch} />
      )}
      {beantwortet && <p className="hinweis">{t("trainer.legendeFelder")}</p>}
    </>
  );
}

/** Nach dem Prüfen: je übersehenem und zu viel getipptem Feld der Grund (Regel L, Nebenchat). */
function Gangartgruende({
  aufgabe,
  fehlend,
  falsch,
}: {
  aufgabe: Gangartaufgabe;
  fehlend: readonly string[];
  falsch: readonly string[];
}) {
  const saetze = useMemo(
    () => gangartbegruendungen(aufgabe.fen, aufgabe.feld, fehlend, falsch),
    [aufgabe, fehlend, falsch],
  );
  if (saetze.length === 0) return null;
  return (
    <section className="karte" data-testid="gangart-begruendung">
      {saetze.map((satz) => (
        <p key={satz}>{satz}</p>
      ))}
    </section>
  );
}

function figurAuf(fen: string, feld: string): Rolle | null {
  const gelesen = stellungAusFen(fen);
  const index = feldAusName(feld);
  if (!gelesen.ok || index === null) return null;
  return gelesen.wert.brett.get(index)?.role ?? null;
}
