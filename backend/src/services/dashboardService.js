import * as dashboardRepository from "../repositories/dashboardRepository.js"

export async function countConversas(idusuario) {
  if (!idusuario) throw new Error("ID do usuário é obrigatório")
  return await dashboardRepository.countConversasPorUsuario(idusuario)
}

export async function countRespostas(idusuario) {
  if (!idusuario) throw new Error("ID do usuário é obrigatório")
  return await dashboardRepository.countRespostasPorUsuario(idusuario)
}

export async function countDocumentos(idusuario) {
  if (!idusuario) throw new Error("ID do usuário é obrigatório")
  return await dashboardRepository.countDocumentosPorUsuario(idusuario)
}

export async function getPerguntasPorDia(idusuario) {
  if (!idusuario) throw new Error("ID do usuário é obrigatório")
  return await dashboardRepository.getPerguntasPorDia(idusuario)
}

export async function getPerguntasRecentes(idusuario, limit = 5) {
  if (!idusuario) throw new Error("ID do usuário é obrigatório")
  return await dashboardRepository.getPerguntasRecentes(idusuario, limit)
}

export async function getArquivosMaisUsados(idusuario, limit = 5) {
  if (!idusuario) throw new Error("ID do usuário é obrigatório")
  return await dashboardRepository.getArquivosMaisUsados(idusuario, limit)
}