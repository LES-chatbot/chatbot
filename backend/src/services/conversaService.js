import * as conversaRepository from "../repositories/conversaRepository.js";

export async function criarConversa(idusuario) {

  if (!idusuario) {
    throw new Error("Usuário é obrigatório");
  }

  const titulo = "Nova conversa";

  const id = await conversaRepository.criarConversa(titulo, idusuario);

  return {
    idconversa: id,
    titulo,
    idusuario
  };
}

export async function listarConversas(idusuario) {
  return await conversaRepository.listarConversasPorUsuario(idusuario);
}

export async function obterConversa(idconversa) {

  const conversa = await conversaRepository.buscarConversaPorId(idconversa);

  if (!conversa) {
    throw new Error("Conversa não encontrada");
  }

  return conversa;
}

export async function removerConversa(idconversa) {
  const deleted = await conversaRepository.deletarConversa(idconversa);

  if (!deleted) {
    throw new Error("Conversa não encontrada");
  }

  return true;
}

export async function atualizarTituloSeNecessario(idconversa, mensagem) {

  const conversa = await conversaRepository.buscarConversaPorId(idconversa);

  if (!conversa) {
    throw new Error("Conversa não encontrada");
  }

  if (conversa.titulo === "Nova conversa") {

    const novoTitulo = mensagem.substring(0, 15);

    await conversaRepository.atualizarTitulo(idconversa, novoTitulo);

    return novoTitulo;
  }

  return conversa.titulo;
}