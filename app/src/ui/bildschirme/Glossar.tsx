/**
 * Glossar: Suche über alle Begriffe und ein Eintrag mit Kurzdefinition, Stellen und Querverweisen.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Glossar: Suche, Kurzdefinition, Querverweise, Sprung zu
 * passenden Abbildungen“. Die Texte kommen eins zu eins aus dem Anhang des Buches (AP 2).
 * Seit 0.2.101 (Symbolsprache DS29) ohne Suche nach Anfangsbuchstaben gegliedert.
 * Abhängigkeiten: daten/laden.ts, Navigation, Buchtext, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { suche } from "../../daten/glossarsuche";
import { ladeGlossar, type Glossareintrag } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { Kopfzeile } from "../komponenten/Kopfzeile";
import { Buchtext } from "../komponenten/Unterschrift";
import { useDaten } from "../komponenten/useDaten";

/**
 * Das Glossar des Buches: Begriffe suchen und einen Eintrag mit Kurzdefinition, Stellen und
 * Querverweisen lesen.
 */
export function Glossar() {
  const glossar = useDaten(ladeGlossar, "glossar");
  const [suchtext, setzeSuchtext] = useState("");
  const treffer = glossar.art === "fertig" ? suche(glossar.wert.eintraege, suchtext) : [];
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("glossar.titel")} zurueckText={t("nachschlagen.titel")} />
      <input
        type="search"
        className="suchfeld"
        data-tour="glossar-suche"
        aria-label={t("glossar.suchen")}
        placeholder={t("glossar.suchen")}
        value={suchtext}
        onChange={(ereignis) => setzeSuchtext(ereignis.target.value)}
      />
      {glossar.art === "laedt" && <p className="lade">…</p>}
      {glossar.art === "fehler" && <p className="fehlertext">{glossar.meldung}</p>}
      {glossar.art === "fertig" && treffer.length === 0 && (
        <p className="hinweis">{t("glossar.keinTreffer")}</p>
      )}
      {suchtext.trim() === "" ? (
        <NachBuchstaben eintraege={treffer} />
      ) : (
        <Begriffe eintraege={treffer} />
      )}
    </div>
  );
}

/** Die Begriffe als Liste von Knöpfen. */
function Begriffe({ eintraege }: { eintraege: readonly Glossareintrag[] }) {
  const { navigiere } = useNavigation();
  return (
    <ul className="begriffsliste" data-tour="glossar-liste">
      {eintraege.map((eintrag) => (
        <li key={eintrag.begriff}>
          <button
            type="button"
            className="begriff-knopf"
            onClick={() => navigiere({ bildschirm: "begriff", begriff: eintrag.begriff })}
          >
            {eintrag.begriff}
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * Anfangsbuchstabe für die Gruppen: Umlaute wie der Grundbuchstabe (Ä bei A), Ziffern unter „#“.
 * Beispiel: "50-Züge-Regel" → "#"; "Ablenkung" → "A"; "Überlastung" → "U".
 */
function anfangsbuchstabe(begriff: string): string {
  const erster = begriff
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .slice(0, 1)
    .toUpperCase();
  return /[A-Z]/.test(erster) ? erster : "#";
}

/**
 * Ohne Suche (DS29): Begriffe unter Buchstaben-Trennern, oben eine Leiste zum Springen, wie im
 * Adressbuch des Telefons. Der Trenner bleibt beim Scrollen oben stehen.
 */
function NachBuchstaben({ eintraege }: { eintraege: readonly Glossareintrag[] }) {
  const gruppen = new Map<string, Glossareintrag[]>();
  for (const eintrag of eintraege) {
    const buchstabe = anfangsbuchstabe(eintrag.begriff);
    gruppen.set(buchstabe, [...(gruppen.get(buchstabe) ?? []), eintrag]);
  }
  const springe = (buchstabe: string) =>
    document.getElementById(`buchstabe-${buchstabe}`)?.scrollIntoView({ block: "start" });
  return (
    <>
      <nav
        className="buchstabenleiste"
        aria-label={t("glossar.buchstaben")}
        data-tour="glossar-buchstaben"
      >
        {[...gruppen.keys()].map((buchstabe) => (
          <button key={buchstabe} type="button" onClick={() => springe(buchstabe)}>
            {buchstabe}
          </button>
        ))}
      </nav>
      {[...gruppen.entries()].map(([buchstabe, liste]) => (
        <section
          key={buchstabe}
          className="buchstabengruppe"
          aria-labelledby={`buchstabe-${buchstabe}`}
        >
          <h2 id={`buchstabe-${buchstabe}`} className="buchstabe">
            {buchstabe}
          </h2>
          <Begriffe eintraege={liste} />
        </section>
      ))}
    </>
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
