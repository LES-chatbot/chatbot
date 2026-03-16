import * as conversaService from "../services/conversaService.js";

export async function criar(req, res) {
  try {
    const { titulo, idusuario } = req.body;

    const conversa = await conversaService.criarConversa(titulo, idusuario);

    res.status(201).json(conversa);

  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

export async function listar(req, res) {
  try {
    const { idusuario } = req.params;

    const conversas = await conversaService.listarConversas(idusuario);

    res.json(conversas);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

export async function obter(req, res) {
  try {
    const { id } = req.params;

    const conversa = await conversaService.obterConversa(id);

    res.json(conversa);

  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
}

export async function remover(req, res) {
  try {
    const { id } = req.params;

    await conversaService.removerConversa(id);

    res.json({ mensagem: "Conversa removida" });

  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
}