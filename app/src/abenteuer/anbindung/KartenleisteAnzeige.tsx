/**
 * Die Anzeige der Kartenleiste (Komponente); der Eintrag für die Partie-Erweiterungen steht in
 * Kartenleiste.tsx. Getrennt, damit die Datei nur Komponenten ausgibt (schnelles Neuladen).
 * Abhängigkeiten: i18n.
 */
import { t } from "../../i18n/sprache";

export function KartenleisteAnzeige({ partiekennung }: { readonly partiekennung: string }) {
  const begegnung = partiekennung.split("#")[0] ?? partiekennung;
  return (
    <aside className="abenteuer-kartenleiste" data-testid="abenteuer-kartenleiste">
      <strong>{t("abenteuer.kartenleiste")}</strong>
      <span>{t("abenteuer.kartenleisteHinweis", { begegnung })}</span>
    </aside>
  );
}
