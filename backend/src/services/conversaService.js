import * as conversaRepository from "../repositories/conversaRepository.js";
import * as mensagemRepository from "../repositories/mensagemRepository.js"



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

  await mensagemRepository.deletarMensagensPorConversa(idconversa);

  const linhasAfetadas =
    await conversaRepository.deletarConversa(idconversa);

  if (linhasAfetadas === 0) {
    throw new Error("Conversa não encontrada");
  }

  return true;
}

export async function atualizarTituloSeNecessario(idconversa, conteudoMensagem) {
  // Busca a conversa
  const conversa = await conversaRepository.buscarConversaPorId(idconversa);

  if (!conversa) {
    throw new Error("Conversa não encontrada");
  }

  // Se o título ainda for "Nova conversa", atualiza
  if (conversa.titulo === "Nova conversa") {
    // Pega os primeiros 15 caracteres da mensagem
    const novoTitulo = conteudoMensagem.substring(0, 15);
    await conversaRepository.atualizarConversa(idconversa, { titulo: novoTitulo });
  }
}

export async function iniciarNovaConversa(idusuario) {
  if (!idusuario) {
    throw new Error("Usuário é obrigatório");
  }

  const titulo = "Nova conversa";

  // 1️⃣ Busca se já existe uma conversa "Nova conversa" para este usuário
  let conversa = await conversaRepository.buscarPorTituloUsuario(titulo, idusuario);

  // 2️⃣ Se não existir, cria uma nova
  if (!conversa) {
    const result = await conversaRepository.criarConversa(idusuario);

    // o ID gerado pelo banco
    const idconversa = result.insertId;

    conversa = {
      idconversa,
      titulo,
      idusuario
    };
  }

  // 3️⃣ Retorna a conversa (existente ou recém-criada)
  return conversa;
}