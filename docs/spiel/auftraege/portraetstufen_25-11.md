# Porträts nach Stufen (25.11.2026, mittel-4)

Befund des Autors: „Häufiger“ fehlt ein Porträt, oder es erscheint ein winziges Ersatzgesicht, das nicht
zur Figur passt (der Wanderer mit gelbem Hut sprach mit einem jungen Kopf mit braunem Haar).

Seit dem 25.11.2026 baut der Paketbau für jede Figur ohne Porträtblatt und ohne Großbild ein
Ersatzporträt aus ihrem Standbild Süd: Kopf und Schultern, ganzzahlig vergrößert auf 64 × 64
(app/skripte/ersatzportraets.mjs, `portraets/ersatz/<name>.png`). Die App sucht es nach Großbild
und Blatt, vor dem alten Ersatzgesicht (dialog/Portraet.tsx). Statisten zeigen in der Sprechblase
das Ersatzporträt des Bildes, das ihre Rolle auf der Karte hat (belebung.ts, statistenbild).

Stand mit privatem Paket (Zeilen mit Sprecher in allen Dialogen):

- Echtes Porträt (Blatt oder Großbild): 42 Sprecher, 2628 Zeilen.
- Ersatzporträt aus der eigenen Figur: 79 Sprecher, 1287 Zeilen.
- Altes Ersatzgesicht (keine eigene Figur in figuren-neu): 4 Sprecher, 8 Zeilen.
- Kein Bild: 0.

## Sprecher ohne echtes Porträtblatt, nach Zeilen (für Gemini-Aufträge, die wichtigsten zuerst)

ward (77), slick (70), bigJoe (65), nova (62), mira (41), lin (41), blaeser (33), odile (31), dot (30), turnierleiterin (30), tamsin (29), odette (27), theo (26), kira (24), albescu (23), haraldsen (23), remy (23), abe (22), bell (22), pops (19), ezra (19), sol (19), mo (19), tomas (17), earl (17), omaRuth (17), batiste (17), greta (17), kiki (16), wanderer (16), annek (16), harlan (15), pruitt (15), rayCastillo (15), celeste (15), teague (15), lou (14), dash (13), buck (13), theron (12), schaffner (12), ray (11), hollis (11), kit (11), okoro (11), henri (11), kapitaen (11), priya (10), joss (10), juniper (10), gus (10), dolores (9), darlene (9), pepe (9), rosie (8), gideon (8), edna (8), hank (7), schiffskoch (6), marcus (5), tobias (5), ngata (5), mags (5), bea (4), arceneaux (4), delphine (4), oldPete (4), coral (4), holloway (3), lucia (3), ruthKeene (3), kowalczyk (3), dale (3), zeitungsjunge (3), guidry (3), empfangsroboter (3), kade (2), kellnerLondon (2), zeitungsleser (2)

## Nur altes Ersatzgesicht (es fehlt die Figur selbst)

wren (3), ike (2), faehrmann (2), greifarm (1)

Fotos vorher und nachher (Wanderer auf der Landstraße, Lkw-Fahrer und Rentnerinnen im Diner) liegen
nur lokal in der Sitzung von mittel-4 (Paketbilder, nicht öffentlich).
