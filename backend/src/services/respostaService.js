import * as respostaRepository from "../repositories/respostaRepository.js";

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

export async function listarRespostasPorMensagemProcessada(idmensagemProcessada) {
  if (!idmensagemProcessada) {
    throw new Error("idmensagemProcessada é obrigatório");
  }

  return await respostaRepository.listarRespostasPorMensagemProcessada(idmensagemProcessada);
}

export async function listarRespostasPorConversa(idconversa) {
  const respostas = await respostaRepository.listarRespostasPorConversa(idconversa);

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

  return mapMensagens; 
}