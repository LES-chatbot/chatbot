import * as mensagemRepository from "../repositories/mensagemRepository.js";
import * as conversaService from "./conversaService.js";

export async function enviarMensagem(mensagem) {

  const { conteudo, idconversa } = mensagem;

  if (!conteudo || conteudo.trim() === "") {
    throw new Error("Conteúdo da mensagem é obrigatório");
  }

  if (!idconversa) {
    throw new Error("Conversa é obrigatória");
  }

  const idmensagem = await mensagemRepository.enviarMensagem({
    conteudo,
    idconversa
  });
  
  await conversaService.atualizarTituloSeNecessario(idconversa, conteudo);

  return {
    idmensagem,
    conteudo,
    idconversa,
    data: new Date().toISOString()
  };
}


export async function listarMensagens(idconversa) {

  if (!idconversa) {
    throw new Error("Conversa é obrigatória");
  }

  const mensagens =
    await mensagemRepository.listarMensagensPorConversa(idconversa);

  return mensagens;
}