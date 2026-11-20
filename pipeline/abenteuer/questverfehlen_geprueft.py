"""Geprüfte Stellen der Prüfung „Quests verfehlen“ (questverfehlen.py): Schlüssel → Grund.

Schlüssel: „quest:start“ oder „quest:n“ (Schritt n ab 1). Jede Ausnahme nennt, warum der Spieler
den Auslöser nicht verlieren kann, obwohl eine Sperre ihn verdecken könnte.
"""

AUSNAHMEN: dict[str, str] = {}
