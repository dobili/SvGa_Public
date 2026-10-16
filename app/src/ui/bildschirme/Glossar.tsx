/**
 * Glossar: Suche über alle Begriffe und ein Eintrag mit Kurzdefinition, Stellen und Querverweisen.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Glossar: Suche, Kurzdefinition, Querverweise, Sprung zu
 * passenden Abbildungen“. Die Texte kommen eins zu eins aus dem Anhang des Buches (AP 2).
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

export function Glossar() {
  const { navigiere } = useNavigation();
  const glossar = useDaten(ladeGlossar, "glossar");
  const [suchtext, setzeSuchtext] = useState("");
  const treffer = glossar.art === "fertig" ? suche(glossar.wert.eintraege, suchtext) : [];
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("glossar.titel")} zurueckText={t("nachschlagen.titel")} />
      <input
        type="search"
        className="suchfeld"
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
      <ul className="begriffsliste">
        {treffer.map((eintrag) => (
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
    <section className="karte">
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
