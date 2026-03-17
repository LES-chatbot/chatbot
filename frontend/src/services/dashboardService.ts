export interface DashboardStats {
  conversas: number
  respostas: number
  arquivos: number
}

export interface PerguntaDia {
  dia: string
  perguntas: number
}

export interface ArquivoUsado {
  name: string
  value: number
}

export interface PerguntaRecente {
  conteudo: string
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.erro || `Erro ao acessar ${url}`)
  }

  return data
}

export async function getDashboardStats(idusuario: number): Promise<DashboardStats> {
  return fetchJson<DashboardStats>(`http://localhost:3000/dashboard/${idusuario}/estatisticas`)
}

export async function getPerguntasPorDia(idusuario: number): Promise<PerguntaDia[]> {
  return fetchJson<PerguntaDia[]>(`http://localhost:3000/dashboard/${idusuario}/perguntas-por-dia`)
}

export async function getArquivosMaisUsados(idusuario: number): Promise<ArquivoUsado[]> {
  return fetchJson<ArquivoUsado[]>(`http://localhost:3000/dashboard/${idusuario}/arquivos-mais-usados`)
}

export async function getPerguntasRecentes(idusuario: number): Promise<PerguntaRecente[]> {
  return fetchJson<PerguntaRecente[]>(`http://localhost:3000/dashboard/${idusuario}/perguntas-recentes`)
}