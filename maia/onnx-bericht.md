# Maia-2 als ONNX im Browser – Messbericht

Stand 25.10.2026. Nur Messung, nichts in der App. Modell: Maia-2 „rapid“ (pip-Paket `maia2`, MIT-Lizenz),
nur Ausgang `logits_maia`. Eingaben: Brett `[N,18,8,8]` float32, `elo_selbst`/`elo_gegner` als
Kategorie-Index (int64) wie `inference.preprocessing`. Export mit `maia/onnx_export.py` (opset 17),
Web-Zeiten mit `maia/web_zeit.mjs`. Modelldateien liegen nicht im Repository.

Prüfstellungen: 2000 Zufallsstellungen (Zufallszüge, Halbzug 10 bis 80, nicht beendet), Elo je
Stellung zufällig aus 1100/1300/1500/1700/1900. Vergleich gegen PyTorch fp32 nach Maskierung
auf legale Züge. Rechenzeit: Stapel 1, Mittel über 200 Läufe, 1 Thread, Cloud-CPU (x86).

| Fassung  | Datei MB | gzip MB | ORT Python ms | ORT-Web WASM ms | gleicher bester Zug | MAE Wahrsch. (legal) |
| -------- | -------: | ------: | ------------: | --------------: | ------------------: | -------------------: |
| PyTorch  |        – |       – |          36,3 |               – |                  –  |                    – |
| fp32     |     84,4 |    78,4 |          19,9 |            71,2 |              100 % |               4e-8   |
| fp16     |     42,3 |    39,1 |          20,0 |           106,6 |             99,9 % |               2,7e-5 |
| int8     |     21,3 |    13,2 |          58,5 |    läuft nicht¹ |             86,5 % |               0,0060 |
| int8_web² |    39,2 |    32,4 |          13,0 |            67,4 |             93,4 % |               0,0025 |

¹ onnxruntime-web 1.20.1 (WASM) hat keine Umsetzung für `ConvInteger`; die voll quantisierte Fassung
lädt dort nicht.
² Nur MatMul/Gemm quantisiert (`op_types_to_quantize=["MatMul","Gemm"]`), Faltungen bleiben fp32.

Einschätzung:

- Im Browser (WASM, 1 Thread) kostet eine Stellung etwa 65 bis 110 ms; auf einem Handy ist mit
  dem Zwei- bis Dreifachen zu rechnen. Für einen Bot-Zug (eine Abfrage je Zug) reicht das.
- Kleinste brauchbare Fassung ist fp16 (42 MB, praktisch identisch zu fp32), aber im WASM langsamer
  als fp32. int8_web spart wenig Größe und weicht in 6,6 % der Stellungen beim besten Zug ab.
- Volle int8-Quantisierung (13 MB gzip) weicht zu stark ab (13,5 % anderer Zug) und läuft im Web nicht.
- Für das Herunterladen in die PWA bedeutet das 40 bis 80 MB zusätzlich.
