const ESTRATEGIA = "baseline";

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
 * Chunking por tamanho fixo de caracteres
 *
 * @param {string} text
 * @param {number} chunkSize - tamanho em caracteres (default 1000)
 * @param {number} overlap - sobreposição em caracteres (default 200)
 */
export function splitBaseline(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];

  // 🔒 proteção
  if (overlap >= chunkSize) {
    throw new Error("overlap deve ser menor que chunkSize");
  }

  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);

    const bloco = text.slice(start, end);

    // calcular linhas (aproximado)
    const linha_ini = text.slice(0, start).split("\n").length;
    const linha_fim = linha_ini + bloco.split("\n").length - 1;

    if (bloco.trim().length > 0) {
      chunks.push(
        makeChunk(
          null,
          bloco,
          linha_ini,
          linha_fim
        )
      );
    }

    start += (chunkSize - overlap);
  }

  return chunks;
}