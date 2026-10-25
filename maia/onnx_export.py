"""Maia-2 (rapid) nach ONNX exportieren und Fassungen messen.

Zweck: Abschätzen, ob Maia-2 im Browser (onnxruntime-web) tragbar ist: Dateigröße,
Rechenzeit je Stellung, Übereinstimmung mit PyTorch. Nur Messung, nichts für die App.
Aufruf (eigene venv mit torch, maia2, onnx, onnxruntime, onnxconverter-common):
    python maia/onnx_export.py --ziel ~/maia
Modelldateien landen nur im Zielordner, nie im Repository.
"""
import argparse
import json
import random
import time
from pathlib import Path

import chess
import numpy as np
import onnxruntime as ort
import torch
from maia2 import inference, model
from onnxruntime.quantization import QuantType, quantize_dynamic

ANZAHL_STELLUNGEN = 2000
LAEUFE_ZEITMESSUNG = 200
ERSTER_HALBZUG = 10
LETZTER_HALBZUG = 80
ELO_STUFEN = [1100, 1300, 1500, 1700, 1900]


class NurZugLogits(torch.nn.Module):
    """Hülle um Maia-2, gibt nur logits_maia zurück (der Export braucht einen Ausgang)."""

    def __init__(self, netz: torch.nn.Module) -> None:
        super().__init__()
        self.netz = netz

    def forward(self, brett, elo_selbst, elo_gegner):
        return self.netz(brett, elo_selbst, elo_gegner)[0]


def zufallsstellungen(anzahl: int, saat: int = 1) -> list[str]:
    """Erzeugt Stellungen durch Zufallszüge, ab Halbzug 10 (Maia-2 ohne Eröffnung trainiert)."""
    rnd = random.Random(saat)
    fens: list[str] = []
    while len(fens) < anzahl:
        brett = chess.Board()
        ziel = rnd.randint(ERSTER_HALBZUG, LETZTER_HALBZUG)
        for _ in range(ziel):
            zuege = list(brett.legal_moves)
            if not zuege:
                break
            brett.push(rnd.choice(zuege))
        if not brett.is_game_over():
            fens.append(brett.fen())
    return fens


def eingaben(fens, vorbereitet):
    """Tensoren wie inference.preprocessing: Brett, Elo-Kategorien, Maske legaler Züge."""
    zugliste, elo_dict, _ = vorbereitet
    rnd = random.Random(2)
    teile = [inference.preprocessing(f, rnd.choice(ELO_STUFEN), rnd.choice(ELO_STUFEN), elo_dict, zugliste) for f in fens]
    bretter = torch.stack([t[0] for t in teile]).float()
    selbst = torch.tensor([t[1] for t in teile], dtype=torch.long)
    gegner = torch.tensor([t[2] for t in teile], dtype=torch.long)
    masken = torch.stack([t[3] for t in teile]).bool()
    return bretter, selbst, gegner, masken


def softmax_maskiert(logits: np.ndarray, masken: np.ndarray) -> np.ndarray:
    werte = np.where(masken, logits.astype(np.float64), -np.inf)
    werte -= werte.max(axis=1, keepdims=True)
    exp = np.exp(werte)
    return exp / exp.sum(axis=1, keepdims=True)


def sitzung(pfad: Path) -> ort.InferenceSession:
    opt = ort.SessionOptions()
    opt.intra_op_num_threads = 1
    opt.inter_op_num_threads = 1
    return ort.InferenceSession(str(pfad), opt, providers=["CPUExecutionProvider"])


def onnx_logits(sitz, bretter, selbst, gegner) -> np.ndarray:
    namen = [e.name for e in sitz.get_inputs()]
    typ = sitz.get_inputs()[0].type
    b = bretter.numpy().astype(np.float16 if "float16" in typ else np.float32)
    teile = []
    for i in range(0, len(b), 100):
        teile.append(sitz.run(None, {namen[0]: b[i:i + 100], namen[1]: selbst.numpy()[i:i + 100], namen[2]: gegner.numpy()[i:i + 100]})[0])
    return np.concatenate(teile).astype(np.float32)


def zeit_je_stellung(sitz, bretter, selbst, gegner) -> float:
    for i in range(10):
        onnx_logits(sitz, bretter[i:i + 1], selbst[i:i + 1], gegner[i:i + 1])
    start = time.perf_counter()
    for i in range(LAEUFE_ZEITMESSUNG):
        onnx_logits(sitz, bretter[i:i + 1], selbst[i:i + 1], gegner[i:i + 1])
    return (time.perf_counter() - start) / LAEUFE_ZEITMESSUNG * 1000


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ziel", type=Path, default=Path.home() / "maia")
    args = parser.parse_args()
    args.ziel.mkdir(parents=True, exist_ok=True)
    torch.set_num_threads(1)
    netz = model.from_pretrained(type="rapid", device="cpu", save_root=str(args.ziel / "modelle")).eval()
    huelle = NurZugLogits(netz).eval()
    vorbereitet = inference.prepare()
    bretter, selbst, gegner, masken = eingaben(zufallsstellungen(ANZAHL_STELLUNGEN), vorbereitet)

    with torch.no_grad():
        ref = torch.cat([huelle(bretter[i:i + 100], selbst[i:i + 100], gegner[i:i + 100]) for i in range(0, len(bretter), 100)]).numpy()
        start = time.perf_counter()
        for i in range(LAEUFE_ZEITMESSUNG):
            huelle(bretter[i:i + 1], selbst[i:i + 1], gegner[i:i + 1])
        torch_ms = (time.perf_counter() - start) / LAEUFE_ZEITMESSUNG * 1000
    ref_p = softmax_maskiert(ref, masken.numpy())

    fp32 = args.ziel / "maia2_rapid_fp32.onnx"
    torch.onnx.export(huelle, (bretter[:1], selbst[:1], gegner[:1]), str(fp32), dynamo=False,
                      input_names=["brett", "elo_selbst", "elo_gegner"], output_names=["logits_maia"],
                      dynamic_axes={n: {0: "n"} for n in ["brett", "elo_selbst", "elo_gegner", "logits_maia"]}, opset_version=17)
    fassungen = {"fp32": fp32}
    int8 = args.ziel / "maia2_rapid_int8.onnx"
    quantize_dynamic(str(fp32), str(int8), weight_type=QuantType.QInt8)
    fassungen["int8"] = int8
    # onnxruntime-web (WASM) kennt kein ConvInteger: Fassung nur mit quantisierten MatMul/Gemm
    int8_web = args.ziel / "maia2_rapid_int8_web.onnx"
    quantize_dynamic(str(fp32), str(int8_web), weight_type=QuantType.QInt8, op_types_to_quantize=["MatMul", "Gemm"])
    fassungen["int8_web"] = int8_web
    try:
        import onnx
        from onnxconverter_common import float16
        fp16 = args.ziel / "maia2_rapid_fp16.onnx"
        onnx.save(float16.convert_float_to_float16(onnx.load(str(fp32)), keep_io_types=True), str(fp16))
        fassungen["fp16"] = fp16
    except Exception as fehler:  # fp16 ist optional, Grund wird gemeldet
        print("fp16 nicht möglich:", fehler)

    ergebnis = {"torch_ms": torch_ms, "stellungen": len(bretter), "fassungen": {}}
    for name, pfad in fassungen.items():
        sitz = sitzung(pfad)
        p = softmax_maskiert(onnx_logits(sitz, bretter, selbst, gegner), masken.numpy())
        gleich = float((p.argmax(1) == ref_p.argmax(1)).mean())
        abw = float(np.abs(p - ref_p)[masken.numpy()].mean())
        ergebnis["fassungen"][name] = {"mb": pfad.stat().st_size / 1e6, "ms": zeit_je_stellung(sitz, bretter, selbst, gegner),
                                       "gleicher_zug": gleich, "mae_legal": abw}
    np.save(args.ziel / "probe_eingaben.npy", np.concatenate([bretter[:20].reshape(20, -1).numpy(), selbst[:20, None].numpy(), gegner[:20, None].numpy()], 1))
    print(json.dumps(ergebnis, indent=2))
    (args.ziel / "ergebnis.json").write_text(json.dumps(ergebnis, indent=2))


if __name__ == "__main__":
    main()
