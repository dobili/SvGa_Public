/**
 * Fängt unerwartete Fehler der Oberfläche ab und zeigt eine verständliche Meldung statt einer
 * leeren Seite (Konzept 12: Fehler werden nie verschluckt).
 * Abhängigkeiten: React, i18n.
 */
import { Component, type ErrorInfo, type ReactNode } from "react";
import { t } from "../i18n/sprache";

interface Zustand {
  readonly fehler: Error | null;
}

export class Fehlergrenze extends Component<{ children: ReactNode }, Zustand> {
  override state: Zustand = { fehler: null };

  static getDerivedStateFromError(fehler: Error): Zustand {
    return { fehler };
  }

  override componentDidCatch(fehler: Error, info: ErrorInfo): void {
    console.error("Fehler in der Oberfläche:", fehler, info.componentStack);
  }

  override render(): ReactNode {
    if (!this.state.fehler) {
      return this.props.children;
    }
    return (
      <div className="bildschirm">
        <section className="karte" role="alert">
          <h1 className="karte-titel">{t("fehler.titel")}</h1>
          <p className="vorformatiert">{this.state.fehler.message}</p>
          <button type="button" className="knopf-haupt" onClick={() => window.location.reload()}>
            {t("fehler.neuLaden")}
          </button>
        </section>
      </div>
    );
  }
}
