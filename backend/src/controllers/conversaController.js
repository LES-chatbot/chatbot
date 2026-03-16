import * as conversaService from "../services/conversaService.js";

export async function criar(req, res) {

  const { idusuario } = req.body;
  const titulo = "Nova conversa";

  try {

    const idconversa = await conversaService.criarConversa(idusuario);

    res.status(201).json({
      idconversa,
      titulo,
      idusuario,
      data_criacao: new Date().toISOString()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar conversa" });
  }
}
export async function listar(req, res) {

  const { idusuario } = req.params;

  try {

    const conversas = await conversaService.listarConversas(idusuario);

    res.json(conversas);

  } catch (error) {

    console.error(error);

    res.status(500).json({ erro: "Erro ao listar conversas" });

  }
}

export async function buscar(req, res) {

  const { idconversa } = req.params;

  try {

    const conversa = await conversaService.buscarConversa(idconversa);

    res.json(conversa);

  } catch (error) {

    console.error(error);

    res.status(404).json({ erro: error.message });

  }
}

export async function atualizar(req, res) {

  const { idconversa } = req.params;

  const { titulo } = req.body;

  try {

    await conversaService.atualizarConversa(idconversa, { titulo });

    res.json({ message: "Conversa atualizada com sucesso" });

  } catch (error) {

    console.error(error);

    res.status(404).json({ erro: error.message });

  }
}

export async function deletar(req, res) {

  const { idconversa } = req.params;

  try {

    await conversaService.deletarConversa(idconversa);

    res.json({ message: "Conversa deletada com sucesso" });

  } catch (error) {

    console.error(error);

    res.status(404).json({ erro: error.message });

  }
}

export async function iniciarNova(req, res) {
  const { idusuario } = req.body;

  if (!idusuario) {
    return res.status(400).json({ erro: "ID do usuário é obrigatório" });
  }

  try {
    const conversa = await conversaService.iniciarNovaConversa(idusuario);

    res.status(201).json({
      idconversa: conversa.idconversa,
      titulo: conversa.titulo,
      idusuario: conversa.idusuario,
      data_criacao: conversa.data_criacao || new Date().toISOString()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao iniciar conversa" });
  }
}