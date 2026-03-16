// services/mensagemProcessadaService.js
import axios from "axios";
import * as mensagemProcessadaRepository from "../repositories/mensagemProcessadaRepository.js";
import * as respostaService from "./respostaService.js";

function preprocessarMensagem(conteudo) {
  return conteudo
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, " ") // remove múltiplos espaços
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

  // 1️⃣ Pré-processa o conteúdo
  const conteudoProcessado = preprocessarMensagem(conteudo);

  // 2️⃣ Extrai intenção e entidades
  const intencao = extrairIntencao(conteudoProcessado);
  const entidades = extrairEntidades(conteudoProcessado);

  // 3️⃣ Salva no banco
  const idmensagemProcessada = await mensagemProcessadaRepository.cadastrarMensagemProcessada({
    conteudo: conteudoProcessado,
    intencao,
    entidades,
    idmensagem
  });

  // 4️⃣ Envia para o Flask (IA) e passa para o respostaService
  try {
    const respostaFlask = await axios.post("http://localhost:5000/processar_mensagem", {
      idmensagemProcessada,
      conteudo: conteudoProcessado,
      intencao,
      entidades
    });

    // Preenche a data se não veio do Flask
    const respostaParaSalvar = {
      ...respostaFlask.data,
      data: respostaFlask.data.data || new Date().toISOString().split("T")[0]
    };

    // Salva no banco via respostaService
    await respostaService.cadastrarResposta(respostaParaSalvar);

  } catch (error) {
    console.error("Erro ao enviar para Flask:", error.message);
  }

  return idmensagemProcessada;
}