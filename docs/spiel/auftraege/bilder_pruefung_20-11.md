# Bilder des Abenteuers: Abgleich (20.11.2026)

Erzeugt mit `python -m pipeline.abenteuer.bildpruefung --privat ../schach-abenteuer-inhalte --bericht …`
gegen das private Paket (Stand d06fb2ff). Geprüft werden jedes `#bild:` der Ink-Dialoge, die
Bildpfade in Daten und Code des Abenteuers und die Funde in `funde.json` (ein Fund ohne Feld
`bild` zählt unter `fund-<kennung>`). Nur Namen und Maße, keine Bilder. Die offenen Aufträge mit
Prompts stehen in `gemini_offen_20-11.html`.

Benutzt 149, im privaten Paket 118, fehlend 31, ungenutzt 0.

## Fehlend (bei Gemini offen)

- `einzug-fahrt` (de/maple-falls-aussen.ink:353)
- `einzug-haus` (de/maple-falls-aussen.ink:354)
- `einzug-wohnzimmer` (de/maple-falls-wohnzimmer.ink:97)
- `fund-bauer-z1` (funde.json: bauerZ1)
- `fund-finch-bauer-b` (funde.json: finchBauerB)
- `fund-finch-bauer-e` (funde.json: finchBauerE)
- `fund-finch-bauer-f` (funde.json: finchBauerF)
- `fund-finch-bauer-h` (funde.json: finchBauerH)
- `fund-finch-laeufer-a` (funde.json: finchLaeuferA)
- `fund-finch-springer-b` (funde.json: finchSpringerB)
- `fund-foto-live` (funde.json: fotoLive)
- `fund-foto2001` (funde.json: foto2001)
- `fund-goldkorn` (funde.json: goldkorn)
- `fund-grubenlampe1866` (funde.json: grubenlampe1866)
- `fund-konservendose` (funde.json: konservendose)
- `fund-kreide1` (funde.json: kreide1)
- `fund-kreide2` (funde.json: kreide2)
- `fund-kuerbisschleife` (funde.json: kuerbisschleife)
- `fund-logbuch1866` (funde.json: logbuch1866)
- `fund-muschel-coral` (funde.json: muschelCoral)
- `fund-problemheft` (funde.json: problemheft)
- `fund-seite04` (funde.json: seite04)
- `fund-seite07` (funde.json: seite07)
- `fund-seite11` (funde.json: seite11)
- `fund-spur-p-m1` (funde.json: spurPM1)
- `fund-spur-p-m2` (funde.json: spurPM2)
- `fund-spur-p-m6` (funde.json: spurPM6)
- `fund-treibholz-turm` (funde.json: treibholzTurm)
- `kiste-whitlock` (de/maple-falls-wohnzimmer.ink:109)
- `nova-laechelt` (de/crossroads-raststaette.ink:132)
- `schraege` (de/ironwood-kantine.ink:348)

## Im Paket, aber nirgends benutzt

keine

## Größe und Format

- `fund-formular1857`: 1024 × 768 statt 512 × 512
- `fund-muenzen-flussweg`: 1024 × 768 statt 512 × 512
- `fund-schluessel`: 1024 × 768 statt 512 × 512

## Hinweise

- Drei Fundbilder haben das Format einer Szene (1024 × 768) statt 512 × 512; sie stammen aus der
  ersten Lieferung. Die Fensterbank zeigt sie trotzdem (das Bild passt sich ein). Ob sie neu
  geliefert werden, entscheidet der Autor; das Werkzeug meldet sie, bis sie quadratisch sind.
- In `ki-roh/` des privaten Repositorys liegen 22 unbenannte Gemini-Bilder vom 16.11., die kein
  Werkzeug benutzt. Sie sind älter als die Liste G1 bis G37 (18.11.) und gehören nicht zu den
  offenen Aufträgen; vermutlich Verworfenes oder Vorstufen.
- Neu seit heute: Ein PNG oder JPG mit dem Namen aus der Ablage direkt in `spiel/bilder/`
  hochladen genügt. Der Paketbau macht daraus das Format des Spiels
  (`app/skripte/grossbilder.mjs`, Szene 1024 × 768 auf dem Raster 256 × 192, Fundbild 512 × 512
  auf 128 × 128, verlustfreies WebP). Ein Fund ohne `bild` in `funde.json` zeigt sein Bild nach
  der Regel `bilder/fund-<kennung>.webp` von selbst (`bildDesFundes`). Das Handy lädt beim
  nächsten Stand der App nur die neuen Dateien nach, nicht das ganze Paket.
- Angekommen ist ein Bild mit dem nächsten Bau der App. Ein Hochladen ins private Repository
  allein löst keinen Bau aus; der nächste Stand, den der Hauptchat nach `beta` oder `main` bringt,
  nimmt es mit.
