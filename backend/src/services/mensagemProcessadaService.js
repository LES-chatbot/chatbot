import axios from "axios";
import * as mensagemProcessadaRepository from "../repositories/mensagemProcessadaRepository.js";
import * as respostaService from "./respostaService.js";

function preprocessarMensagem(conteudo) {
  return conteudo
    .normalize("NFD") // separa acentos
    .replaceAll(/[\u0300-\u036f]/g, "") // remove acentos
    .replaceAll(/\s+/g, " ") // remove múltiplos espaços
    .trim()
    .toLowerCase();
}

function extrairIntencao(conteudo) {
  return "desconhecida"; // Exemplo simples
}

function extrairEntidades(conteudo) {
  return ""; // Exemplo simples
}

export async function cadastrarMensagemProcessada({ conteudo, idmensagem }) {
  if (!conteudo || !idmensagem) {
    throw new Error("Conteúdo e idmensagem são obrigatórios");
  }

  const conteudoProcessado = preprocessarMensagem(conteudo);

  const intencao = extrairIntencao(conteudoProcessado);
  const entidades = extrairEntidades(conteudoProcessado);

  const idmensagemProcessada = await mensagemProcessadaRepository.cadastrarMensagemProcessada({
    conteudo: conteudoProcessado,
    intencao,
    entidades,
    idmensagem
  });

  try {
    const respostaFlask = await axios.post("http://localhost:5000/processar_mensagem", {
      idmensagemProcessada,
      conteudo: conteudoProcessado,
      intencao,
      entidades
    });

    const respostaParaSalvar = {
      ...respostaFlask.data,
      data: respostaFlask.data.data || new Date().toISOString().split("T")[0]
    };

    await respostaService.cadastrarResposta(respostaParaSalvar);

  } catch (error) {
    console.error("Erro ao enviar para Flask:", error.message);
  }

  return idmensagemProcessada;
}