const ESTRATEGIA = "linha";

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
 * Divide o texto em chunks por linhas com overlap
 *
 * @param {string} text
 * @param {number} chunkSize - número de linhas por chunk (default 100)
 * @param {number} overlap - linhas sobrepostas entre chunks (default 20)
 */
export function splitLine(text, chunkSize = 100, overlap = 20) {
  const lines = text.split("\n");
  const chunks = [];

  // 🔒 Proteção contra configuração inválida
  if (overlap >= chunkSize) {
    throw new Error("overlap deve ser menor que chunkSize");
  }

  let i = 0;

  while (i < lines.length) {
    const end = Math.min(i + chunkSize, lines.length);

    const bloco = lines.slice(i, end).join("\n");

    chunks.push(
      makeChunk(
        null,
        bloco,
        i + 1,
        end
      )
    );

    // avanço com overlap
    i += (chunkSize - overlap);
  }

  return chunks;
}