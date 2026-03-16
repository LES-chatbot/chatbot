import * as mensagemRepository from "../repositories/mensagemRepository.js";

export async function enviarMensagem(conteudo, papel, idconversa) {

  if (!conteudo || !papel || !idconversa) {
    throw new Error("Dados inválidos");
  }

  const id = await mensagemRepository.criarMensagem(
    conteudo,
    papel,
    idconversa
  );

    await conversaService.atualizarTituloSeNecessario(idconversa, conteudo);

  return {
    idmensagem: id,
    conteudo,
    papel,
    idconversa
  };
}

export async function obterMensagens(idconversa) {
  return await mensagemRepository.listarMensagens(idconversa);
}

export async function removerMensagem(idmensagem) {
  await mensagemRepository.deletarMensagem(idmensagem);
}