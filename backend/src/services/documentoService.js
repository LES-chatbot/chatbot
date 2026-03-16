import * as documentoRepository from "../repositories/documentoRepository.js";
import { formatCpp } from "./formatterService.js";
import { splitIntoChunks } from "./chunkService.js";
import * as chunkRepository from "../repositories/chunkRepository.js";

// Lista de extensões permitidas
const EXTENSOES_PERMITIDAS = ["cpp", "h", "js", "ts", "py", "java", "txt", "in", "sh"];

export async function cadastrarDocumento(documento) {
  let { titulo, linguagem, conteudo, idusuario } = documento;

  // valida extensão
  if (!EXTENSOES_PERMITIDAS.includes(linguagem.toLowerCase())) {
    throw new Error(
      `Extensão .${linguagem} não permitida. Apenas: ${EXTENSOES_PERMITIDAS.join(", ")}`
    );
  }

  // 1️⃣ formatar código
  if (linguagem === "cpp" || linguagem === "h") {
    conteudo = await formatCpp(conteudo);
    documento.conteudo = conteudo;
  }

  // verifica se documento já existe
  const documentosExistentes =
    await documentoRepository.listarDocumentosPorUsuario(idusuario);

  const docExistente = documentosExistentes.find(
    (d) => d.titulo === titulo && d.linguagem === linguagem
  );

  let iddocumento;

  if (docExistente) {

    // atualizar documento existente
    await documentoRepository.atualizarDocumento(
      docExistente.iddocumento,
      documento
    );

    iddocumento = docExistente.iddocumento;

    // apagar chunks antigos
    await chunkRepository.deletarChunksPorDocumento(iddocumento);

  } else {

    // criar documento novo
    iddocumento = await documentoRepository.criarDocumento(documento);

  }

  const chunks = splitIntoChunks(conteudo, linguagem);

  for (const chunk of chunks) {

    await chunkRepository.criarChunk({
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

  // validar extensão
  if (linguagem &&
      !EXTENSOES_PERMITIDAS.includes(linguagem.toLowerCase())) {

    throw new Error(
      `Extensão .${linguagem} não permitida. Apenas: ${EXTENSOES_PERMITIDAS.join(", ")}`
    );
  }

  // formatar código se necessário
  if (conteudo && linguagem &&
      ["cpp", "h"].includes(linguagem.toLowerCase())) {

    console.log("Formatando código C++ na atualização...");

    conteudo = await formatCpp(conteudo);

    dados.conteudo = conteudo;
  }

  // atualizar documento
  const linhasAfetadas =
    await documentoRepository.atualizarDocumento(iddocumento, dados);

  if (linhasAfetadas === 0)
    throw new Error("Documento não encontrado");

  // recriar chunks
  if (conteudo) {

    await chunkRepository.deletarChunksPorDocumento(iddocumento);

    const chunks = splitIntoChunks(conteudo, linguagem);

    for (const chunk of chunks) {

      await chunkRepository.criarChunk({
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

  // apagar chunks primeiro
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