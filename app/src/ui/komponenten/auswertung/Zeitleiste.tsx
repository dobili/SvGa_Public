/**
 * Zeitleiste der Partie: die Phasen mit ihren Momenten als Karten an einer senkrechten Linie
 * (Entwurf F2 „Die Partie in Momenten“, Wahl des Autors 31.10.2026).
 *
 * Rolle im Gesamtbild: Ersetzt die Listen „Erste klare Abweichung“, „Fehler und Patzer“ und
 * „Absichtliche Fehler der Engine“ der alten Auswertung. Je Phase ein Kopf „Mittelspiel · Zug 10
 * bis 24 · 71 %“ (Genauigkeit der gewählten Seite in der Phase), darunter die Momente: links an der
 * Linie die Marke der Zugklasse (Bedeutung nie nur über Farbe: Zeichen und vorgelesener Name),
 * rechts eine Karte mit Zug, kurzem Text, bei Fehlern dem besseren Zug, einem kleinen Brett und
 * „Zur Stellung“ (springt aufs Brett oben). Die Linie trägt je Phase deren Urteilsfarbe.
 * Ohne klare Abweichung steht oben „Gut gespielt!“.
 * Abhängigkeiten: momente.ts, zeitleiste.ts, momentdarstellung.ts, ui/brett/Brett.tsx, i18n, lucide.
 */
import { Bot, Flag, ThumbsUp } from "lucide-react";
import { t } from "../../../i18n/sprache";
import { phasenurteil, type Seitenbilanz } from "../../../spiel/genauigkeit";
import { stellungen } from "../../../spiel/partie";
import type { Phase } from "../../../spiel/phasen";
import { Brett } from "../../brett/Brett";
import { Klassenmarke } from "./Auswertungssymbole";
import { momentbild, type Darstellungsgrund, type Momentmarke } from "./momentdarstellung";
import type { Moment } from "./momente";
import type { Sprung } from "./sprung";
import type { Phasenabschnitt } from "./zeitleiste";

const SYMBOLGROESSE = 14;
const PROZENT = 100;

/** Marke an der Linie; Zugklassen mit ihrem Zeichen, dazu der Name für Bildschirmleser. */
function Marke({ marke }: { marke: Momentmarke }) {
  const name =
    marke === "engine" || marke === "ende"
      ? t(`auswertungneu.marke.${marke}`)
      : t(`zugklasse.${marke}`);
  return (
    <span className={`zeitleiste-marke zeitleiste-marke-${marke}`}>
      {marke === "engine" && (
        <span className="klassenmarke klassenmarke-engine" aria-hidden="true">
          <Bot size={SYMBOLGROESSE} strokeWidth={2.5} />
        </span>
      )}
      {marke === "ende" && (
        <span className="klassenmarke klassenmarke-ende" aria-hidden="true">
          <Flag size={SYMBOLGROESSE} strokeWidth={2.5} />
        </span>
      )}
      {marke !== "engine" && marke !== "ende" && <Klassenmarke klasse={marke} />}
      <span className="nur-vorlesen">{name}</span>
    </span>
  );
}

/** Eine Karte der Zeitleiste. */
function Momentkarte({
  grund,
  moment,
  gedreht,
  beiSprung,
}: {
  grund: Darstellungsgrund;
  moment: Moment;
  gedreht: boolean;
  beiSprung: (sprung: Sprung) => void;
}) {
  const bild = momentbild(grund, moment);
  const sprung = bild.sprung;
  const fen = sprung ? (stellungen(grund.eintrag.partie)[sprung.stelle] ?? "") : "";
  return (
    <li className="zeitleiste-moment" data-testid={`moment-${moment.art}`}>
      <Marke marke={bild.marke} />
      <div className="zeitleiste-karte">
        <div className="zeitleiste-inhalt">
          <h4 className="zeitleiste-titel">{bild.titel}</h4>
          <p className="zeitleiste-text">{bild.text}</p>
          {bild.besser && (
            <p className="zeitleiste-text">
              {t("auswertungneu.besserWar")} <b className="zeitleiste-besser">{bild.besser}</b>
            </p>
          )}
          {bild.zusatz && <p className="zeitleiste-zusatz">{bild.zusatz}</p>}
          {sprung && (
            <button type="button" className="zeitleiste-sprung" onClick={() => beiSprung(sprung)}>
              {t("auswertung.zurStellung")}
            </button>
          )}
        </div>
        {bild.brett && sprung && fen && (
          <div className="zeitleiste-brett">
            <Brett
              fen={fen}
              markierungen={sprung.marken}
              gedreht={gedreht}
              koordinaten={false}
              beschriftung={t("auswertungneu.brett", { zug: bild.titel })}
            />
          </div>
        )}
      </div>
    </li>
  );
}

/** Kopf einer Phase: Name, Züge, Genauigkeit; Linie in der Farbe des Urteils. */
function Phasenkopf({ a, b }: { a: Phasenabschnitt; b: Seitenbilanz | null }) {
  const prozent = b?.genauigkeit ?? null;
  const zuege =
    a.vonZug === a.bisZug
      ? t("auswertungneu.phase.zug", { zug: a.vonZug })
      : t("auswertungneu.phase.zuege", { von: a.vonZug, bis: a.bisZug });
  return (
    <h3 className="zeitleiste-phase" data-testid={`zeitleiste-phase-${a.phase}`}>
      {t(`phase.name.${a.phase}`)} · {zuege}
      {prozent !== null &&
        ` · ${t("auswertung.prozent", { prozent: Math.round(Math.min(PROZENT, prozent)) })}`}
    </h3>
  );
}

/** Die Urteilsfarbe einer Phase für ihr Stück der Linie; grau ohne Wertung. */
function linienfarbe(b: Seitenbilanz | null): string {
  return b?.innen !== null && b?.innen !== undefined ? phasenurteil(b.innen) : "leer";
}

/**
 * Die ganze Zeitleiste.
 * Eingaben: Abschnitte (zeitleiste.ts), Grund der Darstellung, Bilanz je Phase der gewählten
 * Seite (null vor der Auswertung), Brett gedreht (Leser Schwarz), „Gut gespielt!“, Sprung.
 */
export function Zeitleiste({
  abschnitte,
  grund,
  jePhase,
  gedreht,
  gutGespielt,
  beiSprung,
}: {
  abschnitte: readonly Phasenabschnitt[];
  grund: Darstellungsgrund;
  jePhase: Readonly<Record<Phase, Seitenbilanz>> | null;
  gedreht: boolean;
  gutGespielt: boolean;
  beiSprung: (sprung: Sprung) => void;
}) {
  return (
    <div className="zeitleiste" data-testid="zeitleiste" data-tour="auswertung-momente">
      {gutGespielt && (
        <div className="zeitleiste-gut" data-testid="gut-gespielt">
          <ThumbsUp size={SYMBOLGROESSE + SYMBOLGROESSE / 2} aria-hidden="true" />
          <div>
            <h4 className="zeitleiste-titel">{t("auswertungneu.gut.titel")}</h4>
            <p className="zeitleiste-text">{t("auswertungneu.gut.text")}</p>
          </div>
        </div>
      )}
      {abschnitte.map((a) => {
        const b = jePhase?.[a.phase] ?? null;
        return (
          <section key={a.phase} className={`zeitleiste-abschnitt linie-${linienfarbe(b)}`}>
            <Phasenkopf a={a} b={b} />
            {a.momente.length > 0 && (
              <ol className="zeitleiste-liste">
                {a.momente.map((m) => (
                  <Momentkarte
                    key={`${m.art}-${m.index}`}
                    grund={grund}
                    moment={m}
                    gedreht={gedreht}
                    beiSprung={beiSprung}
                  />
                ))}
              </ol>
            )}
          </section>
        );
      })}
    </div>
  );
}
