/**
 * Karte zu einer Zusatzpartie beim „Zug erraten“: Kennzeichnung, Kopf, Kurztext, Quelle, Lizenz.
 *
 * Rolle im Gesamtbild: Zusatzpartien (training/zusatzpartien.ts) sind kein Buchinhalt. Die Karte
 * sagt das deutlich („Zusatzinhalt (nicht aus dem Buch)“) und nennt, woher die Partie kommt: bei
 * Klassikern die zwei geprüften Fundstellen (Partiezüge sind Tatsachen), bei Turnierpartien die
 * Lichess-Übertragung mit Lizenz CC BY-SA 4.0, wie die Lizenz es verlangt (Namensnennung).
 * In der Auswahl steht die Karte offen, während des Ratens zugeklappt über dem Brett.
 * Abhängigkeiten: training/zusatzpartien.ts, i18n.
 */
import { sprache, t } from "../../i18n/sprache";
import { inSprache, type Zusatzpartie } from "../../training/zusatzpartien";

const CC_BY_SA = "https://creativecommons.org/licenses/by-sa/4.0/";

/** Name mit Wertung, falls bekannt: „Caruana, Fabiano (2792)“. */
function spieler(name: string, elo: number | undefined): string {
  return elo ? `${name} (${elo})` : name;
}

/** Kopfzeile: Spieler, Ereignis, Runde, Datum, Ergebnis, Eröffnung. */
function Kopf({ partie }: { partie: Zusatzpartie }) {
  const runde = partie.runde ? `, ${t("zugerraten.zusatzRunde", { runde: partie.runde })}` : "";
  const eroeffnung = inSprache(partie.eroeffnung, sprache());
  return (
    <>
      <p>
        <strong>
          {spieler(partie.weiss, partie.elo?.[0])} – {spieler(partie.schwarz, partie.elo?.[1])}
        </strong>{" "}
        {partie.ergebnis}
      </p>
      <p className="hinweis">
        {inSprache(partie.ereignis, sprache())}
        {runde}, {partie.datum}
      </p>
      {eroeffnung && <p className="hinweis">{t("zugerraten.zusatzEroeffnung", { eroeffnung })}</p>}
    </>
  );
}

/** Quelle und Lizenz; die Adressen als Links. */
function Herkunft({ partie }: { partie: Zusatzpartie }) {
  const turnier = partie.art === "turnier";
  return (
    <p className="hinweis" data-testid="zusatzpartie-quelle">
      {t(turnier ? "zugerraten.lizenzTurnier" : "zugerraten.lizenzKlassiker")}{" "}
      {partie.quelle.map((adresse, i) => (
        <span key={adresse}>
          {i > 0 && " · "}
          <a href={adresse} target="_blank" rel="noreferrer">
            {new URL(adresse).hostname.replace(/^www\./, "")}
          </a>
        </span>
      ))}
      {turnier && (
        <>
          {" · "}
          <a href={CC_BY_SA} target="_blank" rel="noreferrer">
            CC BY-SA 4.0
          </a>
        </>
      )}
    </p>
  );
}

/** Der Inhalt der Karte: Kennzeichnung, Kopf, Kurztext, Herkunft. */
function Inhalt({ partie }: { partie: Zusatzpartie }) {
  const text = inSprache(partie.text, sprache());
  return (
    <>
      <Kopf partie={partie} />
      {text && <p>{text}</p>}
      <Herkunft partie={partie} />
    </>
  );
}

/**
 * Die Karte zu einer Zusatzpartie.
 *
 * Eingaben: die Partie; `zugeklappt` für die Ansicht während des Ratens.
 */
export function Zusatzkarte({
  partie,
  zugeklappt = false,
}: {
  partie: Zusatzpartie;
  zugeklappt?: boolean;
}) {
  if (zugeklappt)
    return (
      <details className="karte" data-testid="zusatzpartie-karte">
        <summary>{t("zugerraten.zusatzinhalt")}</summary>
        <Inhalt partie={partie} />
      </details>
    );
  return (
    <div className="karte" data-testid="zusatzpartie-karte">
      <p className="hinweis">
        <strong>{t("zugerraten.zusatzinhalt")}</strong>
      </p>
      <Inhalt partie={partie} />
    </div>
  );
}
