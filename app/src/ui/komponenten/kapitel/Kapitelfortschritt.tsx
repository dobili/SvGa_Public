/**
 * Karte „Dein Fortschritt“ in der Kapitelübersicht: Abbildungen, Übungen, Lernziele, Trainer.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4, Stufe 2 „Fortschritt: je Kapitel angesehene Abbildungen,
 * gelöste Übungen, Stand der Trainer“. Dazu die abgehakten Lernziele der Gesamt-Checkliste, weil
 * sie den Stand des Kapitels aus Sicht des Lesers zeigen. Übungen und Trainer zeigen Zahlen,
 * sobald es die Trainer gibt (AP 13); bis dahin ein ehrlicher Satz statt „0 von 12“.
 * Alles als Kreisanzeigen (Wunsch des Autors, 18.10.2026).
 * Abhängigkeiten: speicher, app/lernstand.ts, daten/laden.ts, Kreisanzeige, i18n.
 */
import type { ReactNode } from "react";
import { abgehakt, useLernstand } from "../../../app/lernstand";
import { useNavigation } from "../../../app/navigationsKontext";
import { fragenJeAbbildung } from "../../../analyse/warumfragen";
import { ladeNachschlagen, type Kapitel } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { kapitelfortschritt, type Anteil } from "../../../speicher/fortschritt";
import { useSpeicher } from "../../../speicher/speicher";
import { Kreisanzeige } from "../bausteine/Kreisanzeige";
import { useDaten } from "../bausteine/useDaten";
import { Titelsymbol } from "../bausteine/Titelsymbol";

interface Zeilenangaben {
  readonly name: string;
  readonly anteil: Anteil;
  readonly testid: string;
  readonly children?: ReactNode;
}

/** Eine Kreisanzeige „Name, x von y“; Zusätze (etwa ein Sprung) stehen darunter. */
export function Fortschrittszeile({ name, anteil, testid, children }: Zeilenangaben) {
  return (
    <Kreisanzeige name={name} anteil={anteil} testid={testid}>
      {children}
    </Kreisanzeige>
  );
}

/** Lernziele des Kapitels aus der Gesamt-Checkliste, mit Sprung dorthin. */
function Lernziele({ kapitel }: { kapitel: number }) {
  const { navigiere } = useNavigation();
  const nachschlagen = useDaten(ladeNachschlagen, "nachschlagen");
  const stand = useLernstand();
  if (nachschlagen.art !== "fertig") return null;
  const ziele = nachschlagen.wert.lernziele.find((eintrag) => eintrag.kapitel === kapitel);
  if (!ziele || ziele.punkte.length === 0) return null;
  const anteil = {
    erreicht: abgehakt(stand, kapitel, ziele.punkte.length),
    gesamt: ziele.punkte.length,
  };
  return (
    <Fortschrittszeile
      name={t("fortschritt.lernziele")}
      anteil={anteil}
      testid="fortschritt-lernziele"
    >
      <button
        type="button"
        className="knopf-link links"
        onClick={() => navigiere({ bildschirm: "checkliste" })}
      >
        {t("fortschritt.zurCheckliste")}
      </button>
    </Fortschrittszeile>
  );
}

/**
 * Fortschritt eines geladenen Kapitels.
 *
 * Beispiel: Kapitel 1 nach dem Öffnen von Abb. 1.26 → „Abbildungen angesehen: 1 von 40“.
 */
export function Kapitelfortschritt({ kapitel }: { kapitel: Kapitel }) {
  const fortschritt = useSpeicher((zustand) => zustand.daten.fortschritt);
  const stand = kapitelfortschritt(
    fortschritt,
    kapitel.kapitel,
    kapitel.abbildungen.map((abbildung) => abbildung.id),
    kapitel.uebungen.map((uebung) => uebung.id),
    fragenJeAbbildung(kapitel.abbildungen),
  );
  const mitStand = stand.trainer.filter((eintrag) => eintrag.stand !== null);
  return (
    <section className="karte" data-testid="kapitelfortschritt" data-tour="kapitel-fortschritt">
      <h2 className="karte-titel">
        <Titelsymbol art="fortschritt" />
        {t("fortschritt.titel")}
      </h2>
      <div className="kreisreihe">
        <Fortschrittszeile
          name={t("fortschritt.abbildungen")}
          anteil={stand.abbildungen}
          testid="fortschritt-abbildungen"
        />
        {stand.uebungen.versucht > 0 && (
          <Fortschrittszeile
            name={t("fortschritt.uebungen")}
            anteil={stand.uebungen}
            testid="fortschritt-uebungen"
          />
        )}
        {stand.warum.gesamt > 0 && (
          <Fortschrittszeile
            name={t("fortschritt.warum")}
            anteil={stand.warum}
            testid="fortschritt-warum"
          />
        )}
        <Lernziele kapitel={kapitel.kapitel} />
      </div>
      {stand.uebungen.gesamt > 0 && stand.uebungen.versucht === 0 && (
        <p className="hinweis">
          {t("fortschritt.uebungenFolgen", { gesamt: stand.uebungen.gesamt })}
        </p>
      )}
      {mitStand.map(({ kennung, stand: trainer }) => (
        <p key={kennung} className="hinweis">
          {t(
            trainer?.durchgaenge === 1
              ? "fortschritt.trainerStandEins"
              : "fortschritt.trainerStand",
            {
              name: t(`trainer.${kennung}.name`),
              durchgaenge: trainer?.durchgaenge ?? 0,
              richtig: trainer?.richtig ?? 0,
              aufgaben: trainer?.aufgaben ?? 0,
            },
          )}
        </p>
      ))}
    </section>
  );
}
