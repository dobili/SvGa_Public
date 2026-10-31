/**
 * Glossar: Suche über alle Begriffe, die Begriffe als Lexikonseiten je Anfangsbuchstabe und ein
 * Eintrag mit Definition, Stellen, Diagrammen und Querverweisen.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Glossar: Suche, Kurzdefinition, Querverweise, Sprung zu
 * passenden Abbildungen“. Die Texte kommen eins zu eins aus dem Anhang des Buches (AP 2).
 * Seit 31.10.2026 nach Entwurf I3 „Lexikonseite“ (Wahl des Autors): Buchstaben-Reiter, großer
 * Anfangsbuchstabe, die Begriffe als Fließtext mit Kapitelangabe und kleinem Diagramm
 * (Lexikon.tsx). Die Suche bleibt oben; ein Tipp auf einen Begriff öffnet wie bisher seine Seite.
 * Abhängigkeiten: daten/laden.ts, glossarsuche.ts, lexikon.ts, Lexikon.tsx, Stellungsbild,
 * Navigation, Buchtext, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { suche } from "../../daten/glossarsuche";
import { ladeGlossar, type Abbildung, type Glossareintrag } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { Buchtext } from "../komponenten/abbildung/Unterschrift";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Stellungsbild } from "../komponenten/nachschlagen/Stellungsbild";
import { abbildungMitNummer } from "../komponenten/nachschlagen/steckbriefbild";
import { ladeAlleKapitel } from "../komponenten/nachschlagen/steckbriefdaten";
import { ersteAbbildungDesBegriffs, lexikonseiten } from "../komponenten/nachschlagen/lexikon";
import {
  Buchstabenreiter,
  LexikonseiteAnsicht,
  Lexikonliste,
} from "../komponenten/nachschlagen/Lexikon";

/** Merker für den zuletzt gewählten Buchstaben (nur diese Sitzung, nur dieser Browser). */
const MERKER_BUCHSTABE = "glossar-buchstabe";

function gemerkterBuchstabe(): string | null {
  try {
    return sessionStorage.getItem(MERKER_BUCHSTABE);
  } catch {
    // Ohne Zugriff auf den Sitzungsspeicher (privates Fenster) beginnt das Glossar bei A.
    return null;
  }
}

function merkeBuchstabe(buchstabe: string): void {
  try {
    sessionStorage.setItem(MERKER_BUCHSTABE, buchstabe);
  } catch {
    // Merken ist nur Bequemlichkeit; ohne Speicher beginnt das Glossar beim nächsten Mal bei A.
  }
}

/** Das Diagramm zu einem Begriff (erste Abbildung im Buch), sobald die Kapitel geladen sind. */
function useBildZu(): (eintrag: Glossareintrag) => Abbildung | null {
  const kapitel = useDaten(ladeAlleKapitel, "alle-kapitel");
  return (eintrag) =>
    kapitel.art === "fertig"
      ? abbildungMitNummer(kapitel.wert, ersteAbbildungDesBegriffs(eintrag))
      : null;
}

/** Ohne Suche: die Reiter und die Seite des gewählten Buchstabens. */
function Lexikon({ eintraege }: { eintraege: readonly Glossareintrag[] }) {
  const seiten = lexikonseiten(eintraege);
  const [gewaehlt, setzeGewaehlt] = useState(gemerkterBuchstabe);
  const bildZu = useBildZu();
  const seite = seiten.find((s) => s.buchstabe === gewaehlt) ?? seiten[0];
  if (!seite) return null;
  const waehle = (buchstabe: string) => {
    setzeGewaehlt(buchstabe);
    merkeBuchstabe(buchstabe);
    window.scrollTo({ top: 0 });
  };
  return (
    <>
      <Buchstabenreiter seiten={seiten} aktiv={seite.buchstabe} beiWahl={waehle} />
      <LexikonseiteAnsicht seite={seite} bildZu={bildZu} />
    </>
  );
}

/** Mit Suche: die Treffer als Lexikoneinträge, mit ihrer Anzahl. */
function Suchtreffer({ treffer }: { treffer: readonly Glossareintrag[] }) {
  const bildZu = useBildZu();
  return (
    <section className="lexikon-seite">
      <p className="lexikon-leitwoerter" role="status">
        <span>{t("nachschlagenneu.glossar.treffer", { anzahl: treffer.length })}</span>
      </p>
      <Lexikonliste eintraege={treffer} bildZu={bildZu} />
    </section>
  );
}

/**
 * Das Glossar des Buches: Begriffe suchen oder je Anfangsbuchstabe als Lexikonseite lesen; ein
 * Tipp öffnet den Eintrag mit allen Stellen und Querverweisen.
 */
export function Glossar() {
  const glossar = useDaten(ladeGlossar, "glossar");
  const [suchtext, setzeSuchtext] = useState("");
  const treffer = glossar.art === "fertig" ? suche(glossar.wert.eintraege, suchtext) : [];
  const sucht = suchtext.trim() !== "";
  return (
    <div className="bildschirm glossar">
      <Kopfzeile titel={t("glossar.titel")} zurueckText={t("nachschlagen.titel")} />
      <input
        type="search"
        className="suchfeld"
        data-tour="glossar-suche"
        aria-label={t("glossar.suchen")}
        placeholder={t("nachschlagenneu.glossar.suchbeispiel")}
        value={suchtext}
        onChange={(ereignis) => setzeSuchtext(ereignis.target.value)}
      />
      {glossar.art === "laedt" && <p className="lade">…</p>}
      {glossar.art === "fehler" && <p className="fehlertext">{glossar.meldung}</p>}
      {glossar.art === "fertig" && treffer.length === 0 && (
        <p className="hinweis">{t("glossar.keinTreffer")}</p>
      )}
      {glossar.art === "fertig" &&
        treffer.length > 0 &&
        (sucht ? <Suchtreffer treffer={treffer} /> : <Lexikon eintraege={treffer} />)}
    </div>
  );
}

/** Die Diagramme aller Stellen eines Begriffs, die eine Abbildung haben; ein Tipp öffnet sie. */
function Stellenbilder({ eintrag }: { eintrag: Glossareintrag }) {
  const { navigiere } = useNavigation();
  const kapitel = useDaten(ladeAlleKapitel, "alle-kapitel");
  if (kapitel.art !== "fertig") return null;
  const bilder = eintrag.stellen.flatMap((stelle) => {
    const bild = abbildungMitNummer(kapitel.wert, stelle.abbildung);
    return bild ? [{ bild, abschnitt: stelle.abschnitt }] : [];
  });
  if (bilder.length === 0) return null;
  return (
    <div className="begriff-bilder">
      {bilder.map(({ bild, abschnitt }) => (
        <Stellungsbild
          key={bild.id}
          abbildung={bild}
          text={t("nachschlagenneu.glossar.stellenbild", {
            nummer: bild.id,
            abschnitt: abschnitt ?? "",
          })}
          beiKlick={() => navigiere({ bildschirm: "abbildung", nummer: bild.id })}
        />
      ))}
    </div>
  );
}

function Eintragsinhalt({ eintrag }: { eintrag: Glossareintrag }) {
  const { navigiere } = useNavigation();
  const oeffneAbbildung = (nummer: string) => navigiere({ bildschirm: "abbildung", nummer });
  const zuBegriff = (begriff: string) => navigiere({ bildschirm: "begriff", begriff });
  const beiStelle = (anker: string) => {
    const stelle = eintrag.stellen.find((s) => s.anker === anker);
    if (stelle?.abbildung) oeffneAbbildung(stelle.abbildung);
    else if (stelle) navigiere({ bildschirm: "kapitel", nummer: stelle.kapitel });
  };
  return (
    <section className="karte" data-tour="begriff-karte">
      <h2 className="karte-titel">{eintrag.begriff}</h2>
      <p>
        <Buchtext
          teile={eintrag.text}
          aktionen={{ beiVerweis: oeffneAbbildung, beiBegriff: zuBegriff, beiStelle }}
        />
      </p>
      <Stellenbilder eintrag={eintrag} />
      {eintrag.verweise.length > 0 && (
        <p className="abzweigungen">
          <span>{t("glossar.sieheAuch")}</span>
          {eintrag.verweise.map((verweis) => (
            <button key={verweis} type="button" className="chip" onClick={() => zuBegriff(verweis)}>
              {verweis}
            </button>
          ))}
        </p>
      )}
    </section>
  );
}

/** Ein Glossareintrag. Eingabe: der Begriff genau wie im Glossar, etwa „Abschneiden“. */
export function Begriff({ begriff }: { begriff: string }) {
  const glossar = useDaten(ladeGlossar, "glossar");
  const eintrag =
    glossar.art === "fertig"
      ? glossar.wert.eintraege.find((e) => e.begriff === begriff)
      : undefined;
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("glossar.titel")} zurueckText={t("abbildung.zurueck")} />
      {glossar.art === "laedt" && <p className="lade">…</p>}
      {glossar.art === "fertig" && !eintrag && (
        <p className="fehlertext">{t("glossar.unbekannt", { begriff })}</p>
      )}
      {eintrag && <Eintragsinhalt eintrag={eintrag} />}
    </div>
  );
}
