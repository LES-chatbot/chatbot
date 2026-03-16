// services/respostaService.js
import * as respostaRepository from "../repositories/respostaRepository.js";

/**
 * Cadastra uma resposta da IA no banco de dados
 * @param {Object} respostaData - Dados da resposta recebida do Flask
 * @param {number} respostaData.idmensagemProcessada - ID da mensagem processada
 * @param {string} respostaData.conteudo - Conteúdo da resposta
 * @param {string} respostaData.data - Data da resposta (YYYY-MM-DD)
 * @param {number} [respostaData.idresposta] - Opcional: ID da resposta (gerado pelo banco)
 */
export async function cadastrarResposta(respostaData) {
  const { idmensagemProcessada, conteudo, data } = respostaData;

  if (!idmensagemProcessada || !conteudo || !data) {
    throw new Error("idmensagemProcessada, conteudo e data são obrigatórios");
  }

  const idresposta = await respostaRepository.cadastrarResposta({
    idmensagem_processada: idmensagemProcessada,
    conteudo,
    data
  });

  return idresposta;
}

/**
 * Buscar respostas por mensagem processada
 * @param {number} idmensagemProcessada
 * @returns {Array} Lista de respostas
 */
export async function listarRespostasPorMensagemProcessada(idmensagemProcessada) {
  if (!idmensagemProcessada) {
    throw new Error("idmensagemProcessada é obrigatório");
  }

  return await respostaRepository.listarRespostasPorMensagemProcessada(idmensagemProcessada);
}

export async function listarRespostasPorConversa(idconversa) {
  const respostas = await respostaRepository.listarRespostasPorConversa(idconversa);

  // Agrupa respostas por mensagem
  const mapMensagens = {};
  respostas.forEach(r => {
    if (!mapMensagens[r.idmensagem]) {
      mapMensagens[r.idmensagem] = [];
    }
    mapMensagens[r.idmensagem].push({
      idresposta: r.idresposta,
      conteudo: r.resposta
    });
  });

  return mapMensagens; // { idmensagem: [resposta1, resposta2...] }
}