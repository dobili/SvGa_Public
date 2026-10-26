/**
 * Fehlergrenze um den Inhalt jedes Bildschirms (V7, Nutzungsprüfung 25.10.2026).
 *
 * Rolle im Gesamtbild: App.tsx fängt jeden Bildschirm einzeln; stürzt einer ab, bleiben Leiste
 * und Navigation (mit nur der Grenze um die ganze App, app/Fehlergrenze.tsx, bliebe nur „Neu
 * laden“). Die Seite sagt freundlich, dass der Fortschritt gespeichert ist (er steht nach jeder
 * Antwort in IndexedDB, Konzept 9.4), und bietet „Zurück“ und „Fehler melden“. Die äußere Grenze
 * bleibt als letzte Rettung. Wechselt der Bildschirm (anderer `schluessel`), beginnt die Grenze
 * ohne Fehler. Ein React-`key` täte das auch, würde aber jeden Bildschirm bei jedem Schritt neu
 * aufbauen (etwa beim Wischen von Abb. 1.26 zu 1.27 ginge die Werkzeugwahl verloren); deshalb
 * der Vergleich in getDerivedStateFromProps.
 * Abhängigkeiten: React, app/Absturzbericht.tsx, i18n.
 */
import { Component, type ErrorInfo, type ReactNode } from "react";
import { t } from "../i18n/sprache";
import { Absturzbericht } from "./Absturzbericht";

interface Eigenschaften {
  readonly children: ReactNode;
  /** „Zurück“: eine Ansicht zurück, sonst zum Anfang des Bereichs (App.tsx). */
  readonly beiZurueck: () => void;
  /** Kennzeichen des Bildschirms; ändert es sich, beginnt die Grenze ohne Fehler. */
  readonly schluessel: string;
}

export interface Grenzzustand {
  readonly fehler: Error | null;
  readonly komponenten: string;
  /** Der Schlüssel, zu dem der Zustand gehört. */
  readonly schluessel: string;
}

/** Die freundliche Seite nach einem Absturz; die technische Meldung steht eingeklappt darunter. */
export function Absturzseite({
  fehler,
  bericht,
  beiZurueck,
}: {
  fehler: Error;
  bericht: string;
  beiZurueck: () => void;
}) {
  return (
    <div className="bildschirm" data-testid="absturzseite">
      <section className="karte absturzseite" role="alert">
        <h1 className="karte-titel">{t("absturz.titel")}</h1>
        <p>{t("absturz.gespeichert")}</p>
        <button type="button" className="knopf-haupt" onClick={beiZurueck}>
          {t("absturz.zurueck")}
        </button>
        <Absturzbericht text={bericht} knopfText={t("absturz.melden")} />
        <details className="absturz-technik">
          <summary>{t("absturz.technisch")}</summary>
          <p className="vorformatiert">{fehler.message}</p>
        </details>
      </section>
    </div>
  );
}

/**
 * Zeigt die Kinder; wirft eines beim Zeichnen, zeigt sie stattdessen die Absturzseite.
 *
 * Eingaben: Kinder (der Bildschirm), was „Zurück“ tut, Schlüssel des Bildschirms.
 * Beispiel: Glossar stürzt ab → Absturzseite, Leiste bleibt, „Zurück“ → Nachschlagen.
 * Sonderfälle: Fehler in Ereignissen (Tipp, Zeitgeber) fängt React hier nicht; sie stehen im
 * Protokoll. Ein neuer Schlüssel (anderer Bildschirm) beginnt mit leerem Zustand.
 */
export class Bildschirmgrenze extends Component<Eigenschaften, Grenzzustand> {
  override state: Grenzzustand = {
    fehler: null,
    komponenten: "",
    schluessel: this.props.schluessel,
  };

  static getDerivedStateFromProps(
    eigenschaften: Eigenschaften,
    zustand: Grenzzustand,
  ): Partial<Grenzzustand> | null {
    return eigenschaften.schluessel === zustand.schluessel
      ? null
      : { fehler: null, komponenten: "", schluessel: eigenschaften.schluessel };
  }

  static getDerivedStateFromError(fehler: Error): Partial<Grenzzustand> {
    return { fehler };
  }

  override componentDidCatch(fehler: Error, info: ErrorInfo): void {
    console.error("Fehler in einem Bildschirm:", fehler, info.componentStack);
    this.setState({ komponenten: info.componentStack ?? "" });
  }

  override render(): ReactNode {
    const { fehler, komponenten } = this.state;
    if (!fehler) return this.props.children;
    // Nur Technisches: Abbildung und Stellung gingen sonst ohne Häkchen mit (Datenschutzerklärung).
    const bericht = [fehler.message, fehler.stack ?? "", komponenten].join("\n\n");
    return <Absturzseite fehler={fehler} bericht={bericht} beiZurueck={this.props.beiZurueck} />;
  }
}
