/**
 * Reiter „Wiki“ des Dashboards (Paket D): Liste nach Bereich (Projekt, Code), Titelfilter, Suche
 * im ganzen Text mit Ausschnitt, Ansicht einer Seite. Seit 17.11.2026 zwei getrennte Wikis auf
 * derselben Plattform, oben der Umschalter „Schach-App / Spiel“; Wiki und offene Seite stehen in
 * der Adresse (wikiadresse.ts), damit Links und Neuladen genau dorthin führen.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (Ideensammlung 26.10.2026): Code und Projekt
 * aufbereitet nachlesen, auch auf dem Handy, mit Suche. Die Seiten liegen in D1 (worker/wiki.ts);
 * gebaut werden sie im Lauf „Wartung“ (pipeline/wiki.py).
 * Abhängigkeiten: schnittstelle.ts, wikiadresse.ts, Markdown.tsx, texte.ts.
 */
import { useEffect, useState } from "react";
import { Markdown } from "./Markdown";
import {
  ladeWikiliste,
  ladeWikiseite,
  sucheImWiki,
  type Wikieintrag,
  type Wikitreffer,
} from "./schnittstelle";
import { mit, TEXTE, zeitText } from "./texte";
import {
  liesWikiadresse,
  schreibeWikiadresse,
  WIKIS,
  type Wikiadresse,
  type Wikiname,
} from "./wikiadresse";

type Bereich = Wikieintrag["bereich"];

/** Eine geöffnete Seite mit Knopf zurück. */
function Seite({ wiki, pfad, zurueck }: { wiki: Wikiname; pfad: string; zurueck: () => void }) {
  const [seite, setzeSeite] = useState<(Wikieintrag & { inhalt: string }) | null>(null);
  useEffect(() => {
    let aktiv = true;
    ladeWikiseite(wiki, pfad)
      .then((s) => aktiv && setzeSeite(s))
      .catch((grund: unknown) => console.warn("Wiki-Seite nicht geladen:", grund));
    return () => {
      aktiv = false;
    };
  }, [wiki, pfad]);
  return (
    <article className="admin-karte" data-testid="wiki-seite">
      <button type="button" onClick={zurueck}>
        {TEXTE.wiki.zurueck}
      </button>
      {!seite ? (
        <p>{TEXTE.laden}</p>
      ) : (
        <>
          <h2>{seite.titel}</h2>
          <p className="admin-leise">
            {mit(TEXTE.wiki.stand, { quelle: seite.quelle, zeit: zeitText(seite.zeit) })}
          </p>
          <Markdown text={seite.inhalt} />
        </>
      )}
    </article>
  );
}

/** Suchfeld und Treffer mit Ausschnitt. */
function Suche({ wiki, oeffne }: { wiki: Wikiname; oeffne: (pfad: string) => void }) {
  const [begriff, setzeBegriff] = useState("");
  const [treffer, setzeTreffer] = useState<Wikitreffer[] | null>(null);
  const suche = () => {
    sucheImWiki(wiki, begriff)
      .then(setzeTreffer)
      .catch((grund: unknown) => console.warn("Suche gescheitert:", grund));
  };
  return (
    <form
      className="admin-wikisuche"
      onSubmit={(e) => {
        e.preventDefault();
        suche();
      }}
    >
      <input
        type="search"
        aria-label={TEXTE.wiki.suche}
        placeholder={TEXTE.wiki.suche}
        value={begriff}
        onChange={(e) => setzeBegriff(e.target.value)}
      />
      <button type="submit">{TEXTE.wiki.suchen}</button>
      {treffer && treffer.length === 0 && <p className="admin-leise">{TEXTE.wiki.keineTreffer}</p>}
      {treffer && treffer.length > 0 && (
        <ul className="admin-wikiliste">
          {treffer.map((t) => (
            <li key={t.pfad}>
              <button type="button" className="admin-wikilink" onClick={() => oeffne(t.pfad)}>
                <strong>{t.titel}</strong>
                <span className="admin-leise">{t.ausschnitt}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

/** Umschalter „Schach-App / Spiel“ oben im Reiter. */
function Umschalter({ wiki, waehle }: { wiki: Wikiname; waehle: (w: Wikiname) => void }) {
  return (
    <div className="admin-reiter" role="group" aria-label={TEXTE.wiki.umschalter}>
      {WIKIS.map((w) => (
        <button key={w} type="button" aria-pressed={wiki === w} onClick={() => waehle(w)}>
          {TEXTE.wiki.wikis[w]}
        </button>
      ))}
    </div>
  );
}

/** Wiki und offene Seite, gespiegelt in der Adresse; Zurück im Browser stellt sie wieder her. */
function useWikiadresse(): [Wikiadresse, (neu: Wikiadresse) => void] {
  const [adresse, setzeAdresse] = useState<Wikiadresse>(
    () => liesWikiadresse() ?? { wiki: "app", seite: null },
  );
  useEffect(() => {
    const zurueck = () => setzeAdresse(liesWikiadresse() ?? { wiki: "app", seite: null });
    window.addEventListener("popstate", zurueck);
    return () => window.removeEventListener("popstate", zurueck);
  }, []);
  const setze = (neu: Wikiadresse) => {
    schreibeWikiadresse(neu);
    setzeAdresse(neu);
  };
  return [adresse, setze];
}

/** Liste eines Wikis: Bereichswahl, Titelfilter, Einträge. */
function Liste({ wiki, oeffne }: { wiki: Wikiname; oeffne: (pfad: string) => void }) {
  const [seiten, setzeSeiten] = useState<Wikieintrag[] | null>(null);
  const [bereich, setzeBereich] = useState<Bereich>("projekt");
  const [filter, setzeFilter] = useState("");
  useEffect(() => {
    ladeWikiliste(wiki)
      .then(setzeSeiten)
      .catch((grund: unknown) => console.warn("Wiki nicht geladen:", grund));
  }, [wiki]);
  const sichtbar = (seiten ?? []).filter(
    (s) => s.bereich === bereich && s.titel.toLowerCase().includes(filter.toLowerCase()),
  );
  return (
    <>
      <div className="admin-reiter" role="group">
        {(["projekt", "code"] as const).map((b) => (
          <button
            key={b}
            type="button"
            aria-pressed={bereich === b}
            onClick={() => setzeBereich(b)}
          >
            {TEXTE.wiki.bereiche[b]}
          </button>
        ))}
      </div>
      <input
        type="search"
        aria-label={TEXTE.wiki.filter}
        placeholder={TEXTE.wiki.filter}
        value={filter}
        onChange={(e) => setzeFilter(e.target.value)}
      />
      {!seiten && <p>{TEXTE.laden}</p>}
      {seiten && seiten.length === 0 && <p className="admin-leise">{TEXTE.wiki.leer}</p>}
      <ul className="admin-wikiliste">
        {sichtbar.map((s) => (
          <li key={s.pfad}>
            <button type="button" className="admin-wikilink" onClick={() => oeffne(s.pfad)}>
              {s.titel}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Der Reiter: Umschalter der Wikis, Suche, Liste oder Seite. */
export function Wiki() {
  const [{ wiki, seite }, setze] = useWikiadresse();
  const oeffne = (pfad: string) => setze({ wiki, seite: pfad });
  if (seite) return <Seite wiki={wiki} pfad={seite} zurueck={() => setze({ wiki, seite: null })} />;
  return (
    <section className="admin-karte" data-testid="wiki">
      <Umschalter wiki={wiki} waehle={(w) => setze({ wiki: w, seite: null })} />
      <h2>{TEXTE.wiki.titel[wiki]}</h2>
      <p className="admin-leise">{TEXTE.wiki.erklaerung[wiki]}</p>
      <Suche key={wiki} wiki={wiki} oeffne={oeffne} />
      <Liste key={wiki} wiki={wiki} oeffne={oeffne} />
    </section>
  );
}
