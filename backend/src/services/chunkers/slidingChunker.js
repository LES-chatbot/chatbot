const ESTRATEGIA = "sliding_window";

function makeChunk(tipo, conteudo, ini, fim) {
  return {
    tipo,
    estrategia: ESTRATEGIA,
    conteudo,
    linha_ini: ini,
    linha_fim: fim
  };
}

/**
 * Sliding window chunker por linhas
 *
 * @param {string} text
 * @param {number} windowSize - tamanho da janela (default 100)
 * @param {number} step - passo do slide (default 20)
 */
export function splitSliding(text, windowSize = 100, step = 20) {
  const lines = text.split("\n");
  const chunks = [];

  // 🔒 proteção
  if (step <= 0) {
    throw new Error("step deve ser maior que 0");
  }

  if (step > windowSize) {
    throw new Error("step não pode ser maior que windowSize");
  }

  let start = 0;

  while (start < lines.length) {
    const end = Math.min(start + windowSize, lines.length);

    const bloco = lines.slice(start, end).join("\n");

    chunks.push(
      makeChunk(
        null,
        bloco,
        start + 1,
        end
      )
    );

    start += step;
  }

  return chunks;
}