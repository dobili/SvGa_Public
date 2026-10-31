/**
 * Aufgabenseite des Autors: `docs/AUFGABEN_AUTOR.md` in der App, mit Links, Haken, Notizen und
 * einem Knopf, der den Stand für den Chat in die Zwischenablage legt.
 *
 * Rolle im Gesamtbild: Wunsch des Autors vom 18.10.2026, damit die Nachtests auf dem Handy
 * schneller gehen. Erreichbar über einen langen Druck (drei Sekunden) auf „Profil“ in der Leiste
 * oder über die Adresse /app/#aufgaben; Leser stoßen nicht zufällig darauf. Die Datei kommt beim
 * Bauen als eigener Teil der App mit (nachgeladen, offline vorhanden) und ist damit so neu wie
 * die App. Haken und Notizen liegen als Merker auf dem Gerät.
 * Abhängigkeiten: autor/*, app/merker.ts, app/version.ts, training/trainer.ts, Aufgabenpunkt,
 * Kopfzeile, useDaten, i18n.
 */
import { useEffect, useRef, useState } from "react";
import { liesMerker, schreibeMerker } from "../../app/merker";
import { APP_VERSION } from "../../app/version";
import {
  abhakstandAus,
  alleKennungen,
  LEERER_ABHAKSTAND,
  meldung,
  mitAbschnitt,
  mitHaken,
  mitNotiz,
  type Abhakstand,
} from "../../autor/abhakstand";
import {
  liesAufgabendatei,
  type Aufgabenabschnitt,
  type Aufgabendatei,
} from "../../autor/aufgabendatei";
import type { Trainername } from "../../autor/verweise";
import { t } from "../../i18n/sprache";
import { TRAINER } from "../../training/trainer";
import { Aufgabenpunkt, Aufgabentext } from "../komponenten/rahmen/Aufgabenpunkt";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { AbzeichenProbe } from "../komponenten/fortschritt/AbzeichenProbe";
import { OrdenProbe } from "../komponenten/fortschritt/OrdenProbe";
import { ThemenProbe } from "../komponenten/themen/ThemenProbe";
import { useDaten } from "../komponenten/bausteine/useDaten";

const MERKER = "autorAufgaben";

/** Lädt die Aufgabendatei (eigener Teil der App, erst beim ersten Öffnen geladen). */
async function ladeAufgabendatei(): Promise<Aufgabendatei> {
  const modul = await import("../../../../docs/AUFGABEN_AUTOR.md?raw");
  return liesAufgabendatei(modul.default);
}

const TRAINERNAMEN: readonly Trainername[] = TRAINER.map(({ kennung }) => ({
  kennung,
  name: t(`trainer.${kennung}.name`),
}));

/** Wartezeit bis zum zweiten Scrollen nach der Rückkehr (Safari, siehe Inhalt). */
const NACHSCROLL_MS = 200;

/**
 * Der gemerkte Stand und eine Funktion, die ihn ändert und gleich merkt. Beim allerersten Öffnen
 * (noch nichts gemerkt) ist der neueste Abschnitt aufgeklappt.
 */
function useAbhakstand(
  erster: string | null,
): [Abhakstand, (aendern: (alt: Abhakstand) => Abhakstand) => void] {
  const [stand, setzeStand] = useState(() => {
    const gemerkt = liesMerker(MERKER);
    if (gemerkt === null && erster) return { ...LEERER_ABHAKSTAND, offen: [erster] };
    return abhakstandAus(gemerkt);
  });
  // Gleich merken, nicht erst im Updater: Ein Link baut die Seite ab, bevor React den Updater
  // ausführt; dann ging „zuletzt“ verloren, und „Zurück zu den Aufgaben“ landete oben (N307).
  // Der Stand ändert sich nur hier; die Referenz ist deshalb immer der neueste Stand.
  const aktuell = useRef(stand);
  const aendere = (aendern: (alt: Abhakstand) => Abhakstand) => {
    const neu = aendern(aktuell.current);
    aktuell.current = neu;
    schreibeMerker(MERKER, JSON.stringify(neu));
    setzeStand(neu);
  };
  return [stand, aendere];
}

/** Kopfkarte: Zählung, Kopieren, Filter, Löschen und der Text zum Ansehen. */
function Steuerung({
  datei,
  stand,
  nurOffene,
  setzeNurOffene,
  loesche,
}: {
  datei: Aufgabendatei;
  stand: Abhakstand;
  nurOffene: boolean;
  setzeNurOffene: (an: boolean) => void;
  loesche: () => void;
}) {
  const [kopiert, setzeKopiert] = useState<"ja" | "vonHand" | null>(null);
  const text = meldung(datei, stand, APP_VERSION);
  const kennungen = alleKennungen(datei);
  const erledigt = kennungen.filter((id) => stand.haken.includes(id)).length;
  const kopiere = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setzeKopiert("ja");
    } catch (fehler) {
      console.warn("Zwischenablage nicht erreichbar:", fehler);
      setzeKopiert("vonHand");
    }
  };
  return (
    <section className="karte" data-testid="autor-steuerung">
      <p className="hinweis">
        {t("autor.stand", { datei: datei.version ?? "?", app: APP_VERSION })}{" "}
        {t("autor.zaehlung", { erledigt, gesamt: kennungen.length })}
      </p>
      <button type="button" className="knopf-haupt" onClick={() => void kopiere()}>
        {t("autor.kopieren")}
      </button>
      {kopiert && (
        <p className="meldung" role="status">
          {t(kopiert === "ja" ? "autor.kopiert" : "autor.vonHand")}
        </p>
      )}
      <details open={kopiert === "vonHand"}>
        <summary>{t("autor.textAnsehen")}</summary>
        <pre className="autortext" data-testid="autor-text">
          {text}
        </pre>
      </details>
      <label className="schalterzeile">
        <input
          type="checkbox"
          checked={nurOffene}
          onChange={(e) => setzeNurOffene(e.target.checked)}
        />
        {t("autor.nurOffene")}
      </label>
      <button
        type="button"
        className="knopf-link klein"
        onClick={() => window.confirm(t("autor.loeschenFrage")) && loesche()}
      >
        {t("autor.loeschen")}
      </button>
    </section>
  );
}

/** Ein Abschnitt „###“: aufklappbar, mit Zählung im Titel. */
function Abschnitt({
  abschnitt,
  stand,
  aendere,
  nurOffene,
}: {
  abschnitt: Aufgabenabschnitt;
  stand: Abhakstand;
  aendere: (aendern: (alt: Abhakstand) => Abhakstand) => void;
  nurOffene: boolean;
}) {
  const { titel, punkte } = abschnitt;
  const erledigt = punkte.filter((p) => stand.haken.includes(p.id)).length;
  const sichtbar = nurOffene ? punkte.filter((p) => !stand.haken.includes(p.id)) : punkte;
  return (
    <details
      className="karte aufgabenabschnitt"
      open={stand.offen.includes(titel)}
      onToggle={(e) => {
        const offen = e.currentTarget.open;
        if (offen !== stand.offen.includes(titel))
          aendere((alt) => mitAbschnitt(alt, titel, offen));
      }}
    >
      <summary>
        {titel} ({erledigt}/{punkte.length})
      </summary>
      {abschnitt.absaetze.map((a) => (
        <p key={a} className="hinweis">
          <Aufgabentext text={a} namen={TRAINERNAMEN} />
        </p>
      ))}
      <ul className="aufgabenliste">
        {sichtbar.map((p) => (
          <Aufgabenpunkt
            key={`${titel}-${p.id}`}
            punkt={p}
            namen={TRAINERNAMEN}
            erledigt={stand.haken.includes(p.id)}
            notiz={stand.notizen[p.id] ?? ""}
            setzeHaken={(an) => aendere((alt) => mitHaken(alt, p.id, an))}
            setzeNotiz={(n) => aendere((alt) => mitNotiz(alt, p.id, n))}
            merke={() => aendere((alt) => ({ ...alt, zuletzt: p.id }))}
          />
        ))}
      </ul>
    </details>
  );
}

function Inhalt({ datei }: { datei: Aufgabendatei }) {
  const erster = datei.abschnitte.find((a) => a.ebene === 3)?.titel ?? null;
  const [stand, aendere] = useAbhakstand(erster);
  const [nurOffene, setzeNurOffene] = useState(false);
  // Beim Zurückkommen von einem Link zum zuletzt angetippten Punkt scrollen (nur beim Öffnen).
  // Safari stellt nach der Zurück-Taste die Scrollhöhe des Verlaufseintrags erst nach dem Zeichnen
  // wieder her (meist ganz oben); deshalb kurz danach noch einmal zum Punkt (N307).
  useEffect(() => {
    const zuletzt = stand.zuletzt;
    if (!zuletzt) return;
    const zeige = () =>
      document.getElementById(`aufgabe-${zuletzt}`)?.scrollIntoView({ block: "center" });
    zeige();
    const zeit = window.setTimeout(zeige, NACHSCROLL_MS);
    return () => window.clearTimeout(zeit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <OrdenProbe />
      <AbzeichenProbe />
      <ThemenProbe />
      <Steuerung
        datei={datei}
        stand={stand}
        nurOffene={nurOffene}
        setzeNurOffene={setzeNurOffene}
        loesche={() => aendere(() => LEERER_ABHAKSTAND)}
      />
      {datei.abschnitte.map((a) =>
        a.ebene === 2 ? (
          <h2 key={a.titel} className="abschnitt-titel">
            {a.titel}
          </h2>
        ) : (
          <Abschnitt
            key={a.titel}
            abschnitt={a}
            stand={stand}
            aendere={aendere}
            nurOffene={nurOffene}
          />
        ),
      )}
    </>
  );
}

/**
 * Die Aufgabenseite des Autors (docs/AUFGABEN_AUTOR.md in der App) mit Haken, Notizen und Knopf zum
 * Kopieren des Stands; erreichbar über langen Druck auf „Profil“.
 */
export function AutorAufgaben() {
  const daten = useDaten(ladeAufgabendatei, "autor-aufgaben");
  return (
    <div className="bildschirm bildschirm-autor" data-testid="autor-aufgaben">
      <Kopfzeile titel={t("autor.titel")} zurueckText={t("abbildung.zurueck")} />
      {daten.art === "laedt" && <p className="lade">…</p>}
      {daten.art === "fehler" && (
        <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>
      )}
      {daten.art === "fertig" && <Inhalt datei={daten.wert} />}
    </div>
  );
}
