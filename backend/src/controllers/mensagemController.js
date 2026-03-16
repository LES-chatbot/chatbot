import * as mensagemService from "../services/mensagemService.js";

export async function enviar(req, res) {
  try {

    const { conteudo, papel, idconversa } = req.body;

    const mensagem = await mensagemService.enviarMensagem(
      conteudo,
      papel,
      idconversa
    );

    res.status(201).json(mensagem);

  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

export async function listar(req, res) {
  try {

    const { idconversa } = req.params;

    const mensagens = await mensagemService.obterMensagens(idconversa);

    res.json(mensagens);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function deletar(req, res) {
  try {

    const { id } = req.params;

    await mensagemService.removerMensagem(id);

    res.json({ mensagem: "Mensagem removida" });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}