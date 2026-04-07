import * as documentoRepository from "../repositories/documentoRepository.js";
import { formatCpp } from "./formatterService.js";
import { splitAllChunks } from "./chunkService.js";
import * as chunkRepository from "../repositories/chunkRepository.js";

// Lista de extensões permitidas
const EXTENSOES_PERMITIDAS = ["cpp", "h", "js", "ts", "py", "java", "txt", "in", "sh"];

export async function cadastrarDocumento(documento) {
  let { titulo, linguagem, conteudo, idusuario } = documento;

  if (!EXTENSOES_PERMITIDAS.includes(linguagem.toLowerCase())) {
    throw new Error(
      `Extensão .${linguagem} não permitida. Apenas: ${EXTENSOES_PERMITIDAS.join(", ")}`
    );
  }

  if (linguagem === "cpp" || linguagem === "h") {
    conteudo = await formatCpp(conteudo);
    documento.conteudo = conteudo;
  }

  const documentosExistentes =
    await documentoRepository.listarDocumentosPorUsuario(idusuario);

  const docExistente = documentosExistentes.find(
    (d) => d.titulo === titulo && d.linguagem === linguagem
  );

  let iddocumento;

  if (docExistente) {

    await documentoRepository.atualizarDocumento(
      docExistente.iddocumento,
      documento
    );

    iddocumento = docExistente.iddocumento;

    await chunkRepository.deletarChunksPorDocumento(iddocumento);

  } else {
    iddocumento = await documentoRepository.criarDocumento(documento);

  }

  const chunks = splitAllChunks(conteudo, linguagem);

  for (const chunk of chunks) {

    await chunkRepository.criarChunk({
      estrategia: chunk.estrategia,
      tipo: chunk.tipo,
      conteudo: chunk.conteudo,
      linha_ini: chunk.linha_ini,
      linha_fim: chunk.linha_fim,
      iddocumento
    });

  }

  return iddocumento;
}

export async function listarDocumentos(idusuario) {
  return await documentoRepository.listarDocumentosPorUsuario(idusuario);
}
export async function atualizarDocumento(iddocumento, dados) {

  let { linguagem, conteudo } = dados;

  if (linguagem &&
      !EXTENSOES_PERMITIDAS.includes(linguagem.toLowerCase())) {

    throw new Error(
      `Extensão .${linguagem} não permitida. Apenas: ${EXTENSOES_PERMITIDAS.join(", ")}`
    );
  }

  if (conteudo && linguagem &&
      ["cpp", "h"].includes(linguagem.toLowerCase())) {

    console.log("Formatando código C++ na atualização...");

    conteudo = await formatCpp(conteudo);

    dados.conteudo = conteudo;
  }
  const linhasAfetadas =
    await documentoRepository.atualizarDocumento(iddocumento, dados);

  if (linhasAfetadas === 0)
    throw new Error("Documento não encontrado");

  if (conteudo) {

    await chunkRepository.deletarChunksPorDocumento(iddocumento);

    const chunks = splitAllChunks(conteudo, linguagem);

    for (const chunk of chunks) {

      await chunkRepository.criarChunk({
        estrategia: chunk.estrategia,
        tipo: chunk.tipo,
        conteudo: chunk.conteudo,
        linha_ini: chunk.linha_ini,
        linha_fim: chunk.linha_fim,
        iddocumento
      });

    }

  }

  return true;
}

export async function deletarDocumento(iddocumento) {

  await chunkRepository.deletarChunksPorDocumento(iddocumento);

  const linhasAfetadas =
    await documentoRepository.deletarDocumento(iddocumento);

  if (linhasAfetadas === 0)
    throw new Error("Documento não encontrado");

  return true;
}

export async function buscarDocumento(iddocumento) {
  const doc = await documentoRepository.buscarDocumentoPorId(iddocumento);
  if (!doc) throw new Error("Documento não encontrado");
  return doc;
}