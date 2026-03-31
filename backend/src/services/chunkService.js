import { splitSemantic } from "./chunkers/semanticChunker.js";
import { splitLine } from "./chunkers/lineChunker.js";
import { splitSliding } from "./chunkers/slidingChunker.js";
import { splitBaseline } from "./chunkers/baselineChunker.js";

export function splitAllChunks(conteudo, linguagem) {
  return [
    ...splitSemantic(conteudo, linguagem),
    ...splitLine(conteudo),
    ...splitSliding(conteudo),
    ...splitBaseline(conteudo)
  ];
}