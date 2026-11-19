/**
 * Das Clubtagebuch: laufende und erledigte Quests, Karten im Besitz, Clubnadeln
 * (Dokument 02, 3.2: das Menü hat mit der besten Freundin einen Erzähler; hier erst die Liste).
 *
 * Rolle im Gesamtbild: React-Overlay über der Welt (Entscheidung C4). Zeigt je Quest den
 * nächsten Schritt aus den Questdaten (regeln/quests.ts, naechsterSchritt). Die Zurück-Taste
 * schließt es.
 * „Meine Partien“ (docs/spiel/18, Abschnitt 8): die beendeten Partien des Abenteuers, knapp, mit
 * „Ansehen“ zum Nachspielen in der Hülle; der Rückruf sichert vorher die Position des Helden.
 * „Gegner“ (N2621): was der Leser über Gegner weiß, die freigeschalteten Steckbriefzeilen je
 * Gegner und „vorbereitet“ für analysierte (oberwelt/steckbrieftext.ts, gegnerakten).
 * Zielpfeil auf Wunsch (Wunsch des Autors, 19.11.2026): Jede laufende Aufgabe mit einem Ziel auf
 * der Karte hat ein kleines goldenes Dreieck wie der Hinweis in der Welt. Antippen verfolgt sie (der
 * Pfeil zeigt auf ihr Ziel), noch einmal Antippen hört auf (regeln/verfolgung.ts).
 * Abhängigkeiten: regeln/quests.ts, texte/texte.ts, app/blattstapel.ts, anbindung/meinePartien.ts,
 * speicher/speicher.ts (Partien der App), regeln/verfolgung.ts, oberwelt/zielsuche.ts.
 */
import { useZurueckSchliesst } from "../../app/blattstapel";
import { useSpeicher } from "../../speicher/speicher";
import { meinePartien } from "../anbindung/meinePartien";
import type { Spieldaten } from "../daten/laden";
import { naechsterSchritt } from "../regeln/quests";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";
import { notizen } from "./notizbuch";
import { finchKarteSichtbar } from "../regeln/finchjagd";
import { FinchKarte } from "./FinchKarte";
import { EigeneSeiten } from "./Tagebuchseite";
import { gegnerakten } from "./steckbrieftext";
import { wasJetzt } from "./wasjetzt";
import { verfolgteLaufendeQuest } from "../regeln/verfolgung";
import { zielangabe } from "./zielsuche";
import "../tagebuch.css";

export function Tagebuch({
  stand,
  daten,
  beiSchliessen,
  beiPartie,
  beiZielpfeil,
}: {
  readonly stand: Abenteuerstand;
  readonly daten: Spieldaten;
  readonly beiSchliessen: () => void;
  /** Öffnet eine beendete Partie zum Nachspielen (Id der Partie in der App). */
  readonly beiPartie: (id: string) => void;
  /** Symbol einer Quest angetippt: verfolgen oder aufhören (regeln/verfolgung.ts). */
  readonly beiZielpfeil: (kennung: string) => void;
}) {
  useZurueckSchliesst(true, beiSchliessen);
  const laufend = stand.quests.filter((q) => !q.erledigt);
  const erledigt = stand.quests.filter((q) => q.erledigt);
  const questdaten = (kennung: string) => daten.quests.find((q) => q.kennung === kennung);
  const verfolgt = verfolgteLaufendeQuest(stand);
  return (
    <section
      className="abenteuer-menue abenteuer-tagebuch"
      role="dialog"
      aria-label={tSpiel("tagebuch.titel")}
      data-testid="abenteuer-tagebuch"
    >
      <h2>{tSpiel("tagebuch.titel")}</h2>
      <h3>{tSpiel("tagebuch.laufend")}</h3>
      {laufend.length === 0 && <Leerlauf variablen={stand.dialogvariablen} />}
      <ul>
        {laufend.map((q) => {
          const quest = questdaten(q.kennung);
          const schritt = quest ? naechsterSchritt(quest, q) : null;
          const datenSchritt = quest?.schritte[q.schritt];
          const hatZiel = datenSchritt ? zielangabe(datenSchritt, daten) !== null : false;
          const titel = tSpiel(quest?.titel ?? q.kennung);
          return (
            <li key={q.kennung}>
              {hatZiel && (
                <Zielpfeilknopf
                  titel={titel}
                  an={verfolgt === q.kennung}
                  kennung={q.kennung}
                  beiKlick={() => beiZielpfeil(q.kennung)}
                />
              )}
              <strong>{titel}</strong>
              {schritt && <span> – {tSpiel(schritt)}</span>}
            </li>
          );
        })}
      </ul>
      {erledigt.length > 0 && (
        <>
          <h3>{tSpiel("tagebuch.erledigt")}</h3>
          <ul>
            {erledigt.map((q) => (
              <li key={q.kennung}>{tSpiel(questdaten(q.kennung)?.titel ?? q.kennung)}</li>
            ))}
          </ul>
        </>
      )}
      {/* Je ein Satz, was die Zahlen bedeuten (Spieltest „einstieg“, R9). */}
      <p className="hinweis">
        {tSpiel("tagebuch.wertung", { wertung: stand.wertung })}
        <br />
        {tSpiel("tagebuch.wertungErklaerung")}
      </p>
      <p className="hinweis">
        {tSpiel("laden.muenzen", { anzahl: stand.muenzen })}
        <br />
        {tSpiel("tagebuch.muenzenErklaerung")}
      </p>
      <h3>{tSpiel("tagebuch.nadeln")}</h3>
      {stand.clubs.filter((c) => c.nadel).length === 0 ? (
        <p>{tSpiel("tagebuch.keineNadeln")}</p>
      ) : (
        <ul>
          {stand.clubs
            .filter((c) => c.nadel)
            .map((c) => {
              const ort = daten.orte.find((o) => o.kennung === c.kennung);
              return (
                <li key={c.kennung}>
                  {tSpiel(ort?.club?.name ?? c.kennung)}: {tSpiel(`nadel.${c.nadel ?? "bronze"}`)}
                </li>
              );
            })}
        </ul>
      )}
      <h3>{tSpiel("tagebuch.karten")}</h3>
      {stand.karten.length === 0 ? (
        <p>{tSpiel("tagebuch.keineKarten")}</p>
      ) : (
        <ul>
          {stand.karten.map((k) => {
            const sorte = daten.karten.find((s) => s.kennung === k.kennung);
            return (
              <li key={k.kennung}>
                {tSpiel(sorte?.name ?? k.kennung)}
                {k.anzahl > 1 && ` × ${k.anzahl}`}
              </li>
            );
          })}
        </ul>
      )}
      <Gegnerliste stand={stand} daten={daten} />
      {finchKarteSichtbar(stand.funde, stand.dialogvariablen) && (
        <FinchKarte gefunden={stand.funde} fundeDaten={daten.funde} />
      )}
      <h3>{tSpiel("tagebuch.funde")}</h3>
      {stand.funde.length === 0 ? (
        <p>{tSpiel("tagebuch.keineFunde")}</p>
      ) : (
        <ul data-testid="abenteuer-funde">
          {stand.funde.map((f) => {
            const fund = daten.funde.find((x) => x.kennung === f.kennung);
            return (
              <li key={f.kennung}>
                <strong>{tSpiel(fund?.name ?? f.kennung)}</strong>
                {fund && <> – {tSpiel(fund.text)}</>}
              </li>
            );
          })}
        </ul>
      )}
      {stand.gegenstaende.includes("notizbuch") && <Turnierheft stand={stand} daten={daten} />}
      <EigeneSeiten eintraege={stand.eintraege ?? []} />
      <MeinePartien beiPartie={beiPartie} />
      <button type="button" className="knopf-haupt" onClick={beiSchliessen}>
        {tSpiel("tagebuch.schliessen")}
      </button>
    </section>
  );
}

/**
 * Keine Quest offen: „Was jetzt?“ mit dem nächsten Ziel (oberwelt/wasjetzt.ts), sonst „Gerade
 * nichts“. Spieltest „einstieg“, 15.11.2026: Ohne Ziel wusste das Kind nicht weiter.
 */
function Leerlauf({ variablen }: { variablen: Abenteuerstand["dialogvariablen"] }) {
  const hinweis = wasJetzt(variablen);
  if (!hinweis) return <p>{tSpiel("tagebuch.nichtsOffen")}</p>;
  return (
    <p data-testid="abenteuer-was-jetzt">
      <strong>{tSpiel("tagebuch.wasJetzt")}</strong> {tSpiel(hinweis)}
    </p>
  );
}

/** Die Gegner, über die der Leser etwas weiß, je mit ihren Steckbriefzeilen. */
function Gegnerliste({ stand, daten }: { stand: Abenteuerstand; daten: Spieldaten }) {
  const akten = gegnerakten(stand, daten.gegner);
  return (
    <>
      <h3>{tSpiel("tagebuch.gegner")}</h3>
      {akten.length === 0 ? (
        <p>{tSpiel("tagebuch.keineGegner")}</p>
      ) : (
        <ul data-testid="abenteuer-gegnerakten">
          {akten.map((a) => (
            <li key={a.kennung}>
              <strong>{a.name}</strong>
              {a.analysiert && <> ({tSpiel("tagebuch.analysiert")})</>}
              {a.zeilen.length > 0 && (
                <ul>
                  {a.zeilen.map((z) => (
                    <li key={z}>{z}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Mamas Turnierheft (Szene 39a): die Momente der letzten Partien, wenn der Leser das Heft hat. */
function Turnierheft({ stand, daten }: { stand: Abenteuerstand; daten: Spieldaten }) {
  const eintraege = notizen(stand, daten.gegner);
  return (
    <>
      <h3>{tSpiel("tagebuch.notizbuch")}</h3>
      {eintraege.length === 0 ? (
        <p>{tSpiel("tagebuch.notizbuchLeer")}</p>
      ) : (
        <ul data-testid="abenteuer-turnierheft">
          {eintraege.map((n, i) => (
            <li key={i}>
              <strong>{n.titel}</strong>
              {n.momente.length > 0 && (
                <ul>
                  {n.momente.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Die beendeten Partien des Abenteuers, neueste zuerst, je mit „Ansehen“. */
function MeinePartien({ beiPartie }: { beiPartie: (id: string) => void }) {
  const spiel = useSpeicher((z) => z.daten.spiel);
  const zeilen = meinePartien(spiel);
  return (
    <>
      <h3>{tSpiel("tagebuch.partien")}</h3>
      {zeilen.length === 0 ? (
        <p>{tSpiel("tagebuch.keinePartien")}</p>
      ) : (
        <ul className="abenteuer-partienliste" data-testid="abenteuer-meine-partien">
          {zeilen.map((z) => (
            <li key={z.id}>
              <span>
                {tSpiel("tagebuch.notizPartie", {
                  gegner: z.gegner,
                  ausgang: tSpiel(`tagebuch.ausgang.${z.ausgang}`),
                })}
                {" · "}
                {tSpiel("tagebuch.partieZuege", { anzahl: z.zuege })}
              </span>
              <button type="button" className="knopf-zweit" onClick={() => beiPartie(z.id)}>
                {tSpiel("tagebuch.partieAnsehen")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * Das Symbol einer laufenden Aufgabe: goldenes Dreieck (wie der Hinweis über dem Ziel in der Welt,
 * oberwelt/zielmarker.ts). Gedrückt zeigt der Pfeil auf dem Spielfeld zu ihrem Ziel.
 */
function Zielpfeilknopf({
  titel,
  an,
  kennung,
  beiKlick,
}: {
  readonly titel: string;
  readonly an: boolean;
  readonly kennung: string;
  readonly beiKlick: () => void;
}) {
  return (
    <button
      type="button"
      className="abenteuer-zielpfeilknopf"
      aria-pressed={an}
      aria-label={tSpiel("tagebuch.zielpfeil", { titel })}
      title={tSpiel(an ? "tagebuch.zielpfeilAus" : "tagebuch.zielpfeilAn")}
      data-testid={`abenteuer-zielpfeil-${kennung}`}
      onClick={beiKlick}
    >
      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
        <polygon points="1,2 11,2 6,11" />
      </svg>
    </button>
  );
}
