# Research

Datensätze für spätere Auswertungen (Wunsch des Autors, 27.10.2026). Nicht Teil der App; die App
liest nur die daraus gemessenen Kennzahlen (`app/src/spiel/plattformvergleich-daten.ts`).

## wertungsvergleich/

999 326 öffentliche Lichess-Profile (Oktober 2026), pseudonymisiert, mit allen
eingetragenen Zahlen. Erzeugt mit `pipeline/wertungsvergleich/` (sammeln, abgleich, chesscom,
veroeffentlichen); das Verfahren steht in den Dateiköpfen dort.

**Herkunft der Namen:** aktive Spieler aus der offenen Partiendatenbank von Lichess (September
2026, database.lichess.org, CC0) und Mitglieder großer Lichess-Teams. Die Profile kamen über die
öffentliche Schnittstelle von Lichess (`POST /api/users`), streng nacheinander.

**Datenschutz:** Statt der Lichess-Kennung steht ein Pseudonym `p` (SHA-256 mit geheimem Salz, nur
lokal gespeichert). Es gibt keine Kennungen, keine Klarnamen, keine Freitexte, keine FIDE-ID und
keinen chess.com-Namen; Zeitpunkte nur als Monat. So lässt sich kein Konto einer Person zuordnen.

**Felder je Zeile** (`profile-NN.ndjson.gz`, eine JSON-Zeile je Profil, je Datei 250 000):

| Feld | Bedeutung |
| --- | --- |
| `p` | Pseudonym (16 Hexzeichen), über spätere Läufe gleich |
| `perfs` | je Wertungsart (ultraBullet, bullet, blitz, rapid, classical, correspondence, puzzle): `rating`, `rd`, `games`, `prog` (Fortschritt), `prov` (vorläufig) |
| `verbaende` | im Profil eingetragene Zahlen: `fideRating`, `uscfRating`, `ecfRating`, `rcfRating`, `cfcRating`, `dsbRating` (Selbstangaben) |
| `land`, `titel` | Landeskennung und Titel wie im Profil |
| `erstellt`, `gesehen` | Konto erstellt, zuletzt gesehen (JJJJ-MM) |
| `spielzeit` | Spielzeit insgesamt in Sekunden |
| `regelverstoss`, `gesperrt` | Merkmale von Lichess |
| `hat_chesscom_link` | true, wenn das Profil ein chess.com-Konto verlinkt |
| `fide_offiziell` | nur bei eindeutigem Treffer in der offiziellen FIDE-Liste (Oktober 2026; Klarname und Zahl ±150): `standard`, `schnell`, `blitz`, `aktiv` |
| `chesscom` | nur bei verlinktem und gefundenem Konto: je `blitz`/`rapid` `rating`, `rd`, `games` (Stand Oktober 2026) |

**Lesen (Python):**

```python
import gzip, json, glob
for datei in sorted(glob.glob("Research/wertungsvergleich/profile-*.ndjson.gz")):
    for zeile in gzip.open(datei, "rt"):
        profil = json.loads(zeile)
```

**Grenzen:** Selbstangaben im Profil können veraltet sein (`fide_offiziell` ist es nicht). Die
Stichprobe besteht aus aktiven Lichess-Spielern, nicht aus allen Schachspielern.
