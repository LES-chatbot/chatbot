import * as respostaService from "../services/respostaService.js";

export async function listarRespostas(req, res) {
  const { idconversa } = req.params;

  if (!idconversa) {
    return res.status(400).json({ erro: "idconversa é obrigatório" });
  }

  try {
    const respostasPorMensagem = await respostaService.listarRespostasPorConversa(Number(idconversa));
    return res.json(respostasPorMensagem);
  } catch (error) {
    console.error("Erro ao listar respostas:", error);
    return res.status(500).json({ erro: "Erro ao listar respostas" });
  }
}