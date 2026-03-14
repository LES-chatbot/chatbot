import * as documentoRepository from "../repositories/documentoRepository.js";

export async function cadastrarDocumento(documento) {
  const { titulo, linguagem, idusuario } = documento;

  // Verifica se já existe documento com mesmo título e linguagem
  const documentosExistentes = await documentoRepository.listarDocumentosPorUsuario(idusuario);
  const docExistente = documentosExistentes.find(
    (d) => d.titulo === titulo && d.linguagem === linguagem
  );

  if (docExistente) {
    // Substitui o documento existente
    await documentoRepository.atualizarDocumento(docExistente.iddocumento, documento);
    return docExistente.iddocumento;
  } else {
    // Cria um novo documento
    return await documentoRepository.criarDocumento(documento);
  }
}

export async function listarDocumentos(idusuario) {
  return await documentoRepository.listarDocumentosPorUsuario(idusuario);
}

export async function atualizarDocumento(iddocumento, dados) {
  const linhasAfetadas = await documentoRepository.atualizarDocumento(iddocumento, dados);
  if (linhasAfetadas === 0) throw new Error("Documento não encontrado");
  return true;
}

export async function deletarDocumento(iddocumento) {
  const linhasAfetadas = await documentoRepository.deletarDocumento(iddocumento);
  if (linhasAfetadas === 0) throw new Error("Documento não encontrado");
  return true;
}

export async function buscarDocumento(iddocumento) {
  const doc = await documentoRepository.buscarDocumentoPorId(iddocumento);
  if (!doc) throw new Error("Documento não encontrado");
  return doc;
}