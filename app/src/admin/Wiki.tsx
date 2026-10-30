/**
 * Reiter „Wiki“ des Dashboards (Paket D): Liste nach Bereich (Projekt, Code), Titelfilter, Suche
 * im ganzen Text mit Ausschnitt, Ansicht einer Seite.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (Ideensammlung 26.10.2026): Code und Projekt
 * aufbereitet nachlesen, auch auf dem Handy, mit Suche. Die Seiten liegen in D1 (worker/wiki.ts);
 * gebaut werden sie im Lauf „Wartung“ (pipeline/wiki.py).
 * Abhängigkeiten: schnittstelle.ts, Markdown.tsx, texte.ts.
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

type Bereich = Wikieintrag["bereich"];

/** Eine geöffnete Seite mit Knopf zurück. */
function Seite({ pfad, zurueck }: { pfad: string; zurueck: () => void }) {
  const [seite, setzeSeite] = useState<(Wikieintrag & { inhalt: string }) | null>(null);
  useEffect(() => {
    let aktiv = true;
    ladeWikiseite(pfad)
      .then((s) => aktiv && setzeSeite(s))
      .catch((grund: unknown) => console.warn("Wiki-Seite nicht geladen:", grund));
    return () => {
      aktiv = false;
    };
  }, [pfad]);
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
function Suche({ oeffne }: { oeffne: (pfad: string) => void }) {
  const [begriff, setzeBegriff] = useState("");
  const [treffer, setzeTreffer] = useState<Wikitreffer[] | null>(null);
  const suche = () => {
    sucheImWiki(begriff)
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

/** Der Reiter: Bereichswahl, Filter, Suche, Liste oder Seite. */
export function Wiki() {
  const [seiten, setzeSeiten] = useState<Wikieintrag[] | null>(null);
  const [bereich, setzeBereich] = useState<Bereich>("projekt");
  const [filter, setzeFilter] = useState("");
  const [offen, setzeOffen] = useState<string | null>(null);
  useEffect(() => {
    ladeWikiliste()
      .then(setzeSeiten)
      .catch((grund: unknown) => console.warn("Wiki nicht geladen:", grund));
  }, []);
  if (offen) return <Seite pfad={offen} zurueck={() => setzeOffen(null)} />;
  const sichtbar = (seiten ?? []).filter(
    (s) => s.bereich === bereich && s.titel.toLowerCase().includes(filter.toLowerCase()),
  );
  return (
    <section className="admin-karte" data-testid="wiki">
      <h2>{TEXTE.wiki.titel}</h2>
      <p className="admin-leise">{TEXTE.wiki.erklaerung}</p>
      <Suche oeffne={setzeOffen} />
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
            <button type="button" className="admin-wikilink" onClick={() => setzeOffen(s.pfad)}>
              {s.titel}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
