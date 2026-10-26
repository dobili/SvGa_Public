/**
 * Bildschirm „Übung“: eine Übung des Buches auf dem Brett lösen (AP 13).
 *
 * Rolle im Gesamtbild: Konzept 9.2, Eingabeart „Zug ziehen“ für die Übungen. Die Aufgabe steht im
 * Buch (keine Buchtexte in der App, Entscheidung vom 15.10.2026); hier stehen Diagramm, Seite am
 * Zug, Rückmeldung, Hinweise in drei Stufen (Motiv, Figur, Zug als Pfeil), „Lösung zeigen“ und
 * danach die freigegebene knappe Erklärung (inhalte/de/texte/). Denkaufgaben ohne Zug auf dem
 * Brett: erst selbst denken, dann Erklärung lesen und sich einschätzen.
 * Eine Reihe von Übungen (Kapitel oder fällige Wiederholungen) geht mit „Nächste Übung“ weiter.
 * Abhängigkeiten: useUebung.ts, training/uebungsaufgabe.ts, Brettbereich, Navigation, i18n.
 */
import { useMemo } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import type { Uebungsverweis } from "../../app/stapel";
import { ladeKapitel, type Kapitel } from "../../daten/laden";
import type { Uebung as UebungDaten } from "../../daten/generiert/uebung";
import { t } from "../../i18n/sprache";
import { ROLLENBUCHSTABE, stellungAusFen } from "../../schach/stellung";
import { aufgabeZu, zusaetzlichAkzeptiert } from "../../training/uebungsaufgabe";
import { Brettbereich } from "../komponenten/brettbedienung/Brettbereich";
import { EinzigerZug } from "../komponenten/kapitel/EinzigerZug";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { useBrettbedienung } from "../komponenten/brettbedienung/useBrettbedienung";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { HOECHSTE_STUFE, useUebung, type Uebungssteuerung } from "../komponenten/kapitel/useUebung";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";

const OHNE_WAHL = () => undefined;

/** Hinweise in drei Stufen und „Lösung zeigen“, nach „Erst selbst denken“. */
function Hilfe({ s, uebung }: { s: Uebungssteuerung; uebung: UebungDaten }) {
  if (s.status !== "offen") return null;
  if (!s.hilfeFrei) {
    return (
      <div className="uebung-hilfe" data-tour="uebung-hilfe">
        <p className="hinweis">{t("uebung.erstDenken")}</p>
        <button type="button" className="knopf-zweit" onClick={s.nachgedacht}>
          {t("uebung.nachgedacht")}
        </button>
      </div>
    );
  }
  return (
    <div className="uebung-hilfe" data-tour="uebung-hilfe">
      {s.stufe >= 1 && uebung.erklaerung && (
        <p data-testid="hinweis-motiv">
          {t("uebung.hinweisMotiv", { motiv: uebung.erklaerung.motiv })}
        </p>
      )}
      {s.stufe >= 2 && s.naechsteFigur && (
        <p>{t("uebung.hinweisFigur", { figur: t(`figur.${ROLLENBUCHSTABE[s.naechsteFigur]}`) })}</p>
      )}
      {s.stufe >= HOECHSTE_STUFE && <p>{t("uebung.hinweisZug")}</p>}
      <div className="knopfzeile">
        {s.stufe < HOECHSTE_STUFE && (
          <button type="button" className="knopf-zweit" onClick={s.hinweis}>
            <Knopfsymbol art="hinweis" />
            {t("uebung.hinweis", { stufe: s.stufe + 1 })}
          </button>
        )}
        <button type="button" className="knopf-link" onClick={s.zeigeLoesung}>
          <Knopfsymbol art="loesung" />
          {t("uebung.loesungZeigen")}
        </button>
      </div>
    </div>
  );
}

/** Die freigegebene Erklärung nach dem Lösen oder nach „Lösung zeigen“. */
function Erklaerung({ uebung }: { uebung: UebungDaten }) {
  const e = uebung.erklaerung;
  if (!e) return <p className="hinweis">{t("uebung.ohneErklaerung")}</p>;
  return (
    <section className="karte uebung-erklaerung" data-testid="uebung-erklaerung">
      {e.loesung && <p className="uebung-loesung">{e.loesung}</p>}
      <p>
        <strong>{e.motiv}.</strong> {e.text}
      </p>
      <EinzigerZug uebung={uebung.id} />
    </section>
  );
}

function Rueckmeldung({ s }: { s: Uebungssteuerung }) {
  if (s.status === "geloest")
    return (
      <p className="meldung gut" role="status">
        {t(s.meldung === "anders" ? "uebung.geloestAnders" : "uebung.geloest")}
      </p>
    );
  if (s.status === "gezeigt")
    return (
      <p className="meldung" role="status">
        {t("uebung.gezeigt")}
      </p>
    );
  if (s.meldung === "falsch")
    return (
      <p className="meldung schlecht" role="status">
        {t("uebung.falsch")}
      </p>
    );
  if (s.meldung === "weiter")
    return (
      <p className="meldung gut" role="status">
        {t("uebung.weiter")}
      </p>
    );
  return null;
}

/** Selbsteinschätzung bei Denkaufgaben. */
function Einschaetzung({ s }: { s: Uebungssteuerung }) {
  if (s.eingeschaetzt) return <p className="hinweis">{t("uebung.eingeschaetzt")}</p>;
  return (
    <div
      className="knopfzeile"
      role="group"
      aria-label={t("uebung.einschaetzen")}
      data-tour="uebung-einschaetzen"
    >
      <button type="button" className="knopf-zweit" onClick={() => s.schaetzeEin("richtig")}>
        {t("uebung.selbstRichtig")}
      </button>
      <button type="button" className="knopf-zweit" onClick={() => s.schaetzeEin("mitHilfe")}>
        {t("uebung.selbstTeils")}
      </button>
      <button type="button" className="knopf-zweit" onClick={() => s.schaetzeEin("falsch")}>
        {t("uebung.selbstFalsch")}
      </button>
    </div>
  );
}

function Weiter({ reihe, hier }: { reihe: readonly Uebungsverweis[]; hier: string }) {
  const { ersetze, zurueck } = useNavigation();
  const index = reihe.findIndex((v) => v.id === hier);
  const naechste = index >= 0 ? reihe[index + 1] : undefined;
  return (
    <div className="knopfzeile" data-tour="uebung-weiter">
      {naechste ? (
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => ersetze({ bildschirm: "uebung", ...naechste, reihe })}
        >
          {t("uebung.naechste")}
        </button>
      ) : (
        <button type="button" className="knopf-zweit" onClick={zurueck}>
          {t("uebung.fertig")}
        </button>
      )}
    </div>
  );
}

/** Inhalt, sobald Kapitel und Übung da sind. */
function Inhalt({
  kapitel,
  uebung,
  reihe,
}: {
  kapitel: Kapitel;
  uebung: UebungDaten;
  reihe: readonly Uebungsverweis[];
}) {
  const { navigiere } = useNavigation();
  const erste = uebung.abbildungen[0];
  const startFen = kapitel.abbildungen.find((a) => a.id === erste)?.fen ?? null;
  const aufgabe = useMemo(
    () =>
      aufgabeZu(startFen, uebung.erklaerung?.loesung ?? null, [
        ...(uebung.erklaerung?.akzeptiert ?? []),
        ...zusaetzlichAkzeptiert(uebung.id),
      ]),
    [startFen, uebung],
  );
  const s = useUebung(uebung, aufgabe, startFen ?? "");
  const bedienung = useBrettbedienung(s, aufgabe.art === "zug" ? "ziehen" : null, OHNE_WAHL);
  const stellung = useMemo(() => (startFen ? stellungAusFen(s.fen) : null), [startFen, s.fen]);
  const fertig = s.status !== "offen" || (aufgabe.art === "denken" && s.hilfeFrei);
  return (
    <div className="uebung" data-testid="uebung">
      <p className="hinweis" data-tour="uebung-auftrag">
        {aufgabe.art === "zug" ? t("uebung.auftragZug") : t("uebung.auftragDenken")}
        {erste && (
          <>
            {" "}
            <button
              type="button"
              className="verweis"
              onClick={() => navigiere({ bildschirm: "abbildung", nummer: erste })}
            >
              {t("abbildung.titel", { nummer: erste })}
            </button>
          </>
        )}
      </p>
      {stellung?.ok && (
        <Brettbereich
          stellung={stellung.wert}
          markierungen={s.markierungen}
          letzterZug={null}
          bedienung={bedienung}
          beschriftung={t("uebung.titel", { nummer: uebung.nummer })}
        />
      )}
      <Rueckmeldung s={s} />
      {aufgabe.art === "zug" && <Hilfe s={s} uebung={uebung} />}
      {aufgabe.art === "denken" && !s.hilfeFrei && (
        <button type="button" className="knopf-zweit" onClick={s.nachgedacht}>
          {t("uebung.nachgedacht")}
        </button>
      )}
      {fertig && <Erklaerung uebung={uebung} />}
      {aufgabe.art === "denken" && s.hilfeFrei && <Einschaetzung s={s} />}
      {(s.status !== "offen" || s.eingeschaetzt) && <Weiter reihe={reihe} hier={uebung.id} />}
    </div>
  );
}

/**
 * Der Bildschirm einer Übung des Buches: den Zug auf dem Brett finden, mit Hinweisen in drei
 * Stufen, Lösung und Erklärung; „Nächste Übung“ führt durch eine Reihe.
 */
export function Uebung({
  kapitel,
  id,
  reihe = [],
}: Uebungsverweis & { reihe?: readonly Uebungsverweis[] }) {
  const daten = useDaten(() => ladeKapitel(kapitel), `kapitel-${kapitel}`);
  const uebung = daten.art === "fertig" ? daten.wert.uebungen.find((u) => u.id === id) : undefined;
  return (
    <div className="bildschirm bildschirm-uebung">
      <Kopfzeile
        titel={uebung ? t("uebung.titel", { nummer: uebung.nummer }) : t("uebung.titelOhne")}
        zurueckText={t("uebung.zurueck")}
      />
      {daten.art === "laedt" && <p className="lade">…</p>}
      {daten.art === "fehler" && (
        <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>
      )}
      {daten.art === "fertig" && uebung && (
        <Inhalt key={uebung.id} kapitel={daten.wert} uebung={uebung} reihe={reihe} />
      )}
    </div>
  );
}
