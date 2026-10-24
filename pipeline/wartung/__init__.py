"""Wartungsprüfungen des Admin-Dashboards (R57, Stufe 1).

Wozu dieses Paket da ist:
    Wöchentlich und nach jedem Push nach main prüft GitHub Actions (.github/workflows/wartung.yml),
    ob draußen noch alles stimmt: Links, Live-Seite, Zertifikat und Domain, CI, Abhängigkeiten,
    Eröffnungsliste von Lichess, offene Punkte des Autors. Jeder Punkt bekommt eine Ampel. Ein
    roter Punkt lässt den Lauf scheitern, dann schickt GitHub dem Autor eine Mail. Der Bericht geht
    zusätzlich an das Dashboard (/api/bericht), sobald BERICHT_SCHLUESSEL gesetzt ist.

Aufruf: ``python -m pipeline.wartung`` (Optionen siehe ``__main__.py``).
"""
