/**
 * Typen für onnxruntime-node (nur Messung, engine/messung/maia-node.testhilfe.ts): Das Paket 1.20.1
 * verweist auf dist/index.d.ts, liefert die Datei aber nicht mit; seine Schnittstelle ist die von
 * onnxruntime-common (Tensor, InferenceSession).
 */
declare module "onnxruntime-node" {
  export * from "onnxruntime-common";
}
