/**
 * Fängt unerwartete Fehler der Oberfläche ab und zeigt eine verständliche Meldung statt einer
 * leeren Seite (Konzept 12: Fehler werden nie verschluckt). Sie bietet an, die technische
 * Fehlermeldung an den Autor zu schicken (freiwilliger Absturzbericht, nur auf Tipp, R57;
 * Datenschutzerklärung „Meldungen aus der App“).
 * Zuerst fängt die Grenze um jeden Bildschirm (app/Bildschirmgrenze.tsx, V7); diese äußere Grenze
 * um die ganze App ist die letzte Rettung, etwa wenn die Leiste selbst abstürzt. Geräteangaben
 * gehen nur mit Häkchen mit (app/Absturzbericht.tsx).
 * Abhängigkeiten: React, app/Absturzbericht.tsx, i18n.
 */
import { Component, type ErrorInfo, type ReactNode } from "react";
import { t } from "../i18n/sprache";
import { Absturzbericht } from "./Absturzbericht";

interface Zustand {
  readonly fehler: Error | null;
  readonly komponenten: string;
}

/**
 * Äußerste Schutzschicht um die ganze App: Stürzt die Oberfläche ab, erscheint statt einer leeren
 * Seite eine verständliche Meldung, auf Wunsch mit Fehlerbericht an den Autor.
 */
export class Fehlergrenze extends Component<{ children: ReactNode }, Zustand> {
  override state: Zustand = { fehler: null, komponenten: "" };

  static getDerivedStateFromError(fehler: Error): Partial<Zustand> {
    return { fehler };
  }

  override componentDidCatch(fehler: Error, info: ErrorInfo): void {
    console.error("Fehler in der Oberfläche:", fehler, info.componentStack);
    this.setState({ komponenten: info.componentStack ?? "" });
  }

  override render(): ReactNode {
    const { fehler, komponenten } = this.state;
    if (!fehler) {
      return this.props.children;
    }
    const bericht = [fehler.message, fehler.stack ?? "", komponenten].join("\n\n");
    return (
      <div className="bildschirm">
        <section className="karte" role="alert">
          <h1 className="karte-titel">{t("fehler.titel")}</h1>
          <p className="vorformatiert">{fehler.message}</p>
          <button type="button" className="knopf-haupt" onClick={() => window.location.reload()}>
            {t("fehler.neuLaden")}
          </button>
          <Absturzbericht text={bericht} knopfText={t("fehler.berichtSenden")} />
        </section>
      </div>
    );
  }
}
