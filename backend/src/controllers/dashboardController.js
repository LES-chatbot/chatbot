import * as dashboardService from "../services/dashboardService.js"



// ----------------- ESTATÍSTICAS -----------------
export async function getEstatisticas(req, res) {
  const { idusuario } = req.params

  if (!idusuario) {
    return res.status(400).json({ erro: "ID do usuário é obrigatório" })
  }

  try {
    const conversas = await dashboardService.countConversas(idusuario)
    const respostas = await dashboardService.countRespostas(idusuario)
    const arquivos = await dashboardService.countDocumentos(idusuario)

    res.json({ conversas, respostas, arquivos })
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar estatísticas" })
  }
}

// ----------------- GRÁFICOS -----------------
export async function getPerguntasPorDia(req, res) {
  const { idusuario } = req.params
  try {
    const dados = await dashboardService.getPerguntasPorDia(idusuario)
    res.json(dados)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar perguntas por dia" })
  }
}

export async function getArquivosMaisUsados(req, res) {
  const { idusuario } = req.params
  const limit = req.query.limit ? parseInt(req.query.limit) : 5

  try {
    const dados = await dashboardService.getArquivosMaisUsados(idusuario, limit)
    res.json(dados)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar arquivos mais usados" })
  }
}

export async function getPerguntasRecentes(req, res) {
  const { idusuario } = req.params
  const limit = req.query.limit ? parseInt(req.query.limit) : 5

  try {
    const dados = await dashboardService.getPerguntasRecentes(idusuario, limit)
    res.json(dados)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar perguntas recentes" })
  }
}