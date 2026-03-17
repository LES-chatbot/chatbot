import * as conversaRepository from "../repositories/conversaRepository.js";

export async function criarConversa(idusuario) {

  if (!idusuario) {
    throw new Error("Usuário é obrigatório");
  }
  
  const titulo = "Nova conversa";

  const conversaExistente = await conversaRepository.buscarPorTituloUsuario(titulo, idusuario);

  if (conversaExistente) {
    return conversaExistente;
  }
  const idconversa = await conversaRepository.criarConversa(idusuario);

  return {
    idconversa,
    titulo: titulo,
    idusuario
  };
}

export async function listarConversas(idusuario) {

  if (!idusuario) {
    throw new Error("Usuário é obrigatório");
  }

  return await conversaRepository.listarConversasPorUsuario(idusuario);
}

export async function buscarConversa(idconversa) {

  const conversa = await conversaRepository.buscarConversaPorId(idconversa);

  if (!conversa) {
    throw new Error("Conversa não encontrada");
  }

  return conversa;
}

export async function atualizarConversa(idconversa, dados) {

  const { titulo } = dados;

  if (!titulo || titulo.trim() === "") {
    throw new Error("Título é obrigatório");
  }

  const linhasAfetadas =
    await conversaRepository.atualizarConversa(idconversa, dados);

  if (linhasAfetadas === 0) {
    throw new Error("Conversa não encontrada");
  }

  return true;
}

export async function deletarConversa(idconversa) {

  const linhasAfetadas =
    await conversaRepository.deletarConversa(idconversa);

  if (linhasAfetadas === 0) {
    throw new Error("Conversa não encontrada");
  }

  return true;
}

export async function atualizarTituloSeNecessario(idconversa, conteudoMensagem) {
  const conversa = await conversaRepository.buscarConversaPorId(idconversa);

  if (!conversa) {
    throw new Error("Conversa não encontrada");
  }

  if (conversa.titulo === "Nova conversa") {
    const novoTitulo = conteudoMensagem.substring(0, 15);
    await conversaRepository.atualizarConversa(idconversa, { titulo: novoTitulo });
  }
}

export async function iniciarNovaConversa(idusuario) {
  const titulo = "Nova conversa";

  let conversa = await conversaRepository.buscarPorTituloUsuario(titulo, idusuario);

  if (!conversa) {
    const idconversa = await conversaRepository.criarConversa(idusuario);

    conversa = {
      idconversa,
      titulo,
      idusuario,
      data_criacao: new Date().toISOString()
    };
  }

  return conversa;
}