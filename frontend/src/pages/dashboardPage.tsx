import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import {
  getDashboardStats,
  getPerguntasPorDia,
  getArquivosMaisUsados,
  getPerguntasRecentes
} from "../services/dashboardService"
import type { DashboardStats, PerguntaDia, ArquivoUsado, PerguntaRecente} from "../services/dashboardService"

export default function DashboardPage() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState<{ nome: string; id: number } | null>(null)
  
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [perguntasPorDia, setPerguntasPorDia] = useState<PerguntaDia[]>([])
  const [arquivosUsados, setArquivosUsados] = useState<ArquivoUsado[]>([])
  const [perguntasRecentes, setPerguntasRecentes] = useState<PerguntaRecente[]>([])

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]

  // Carrega usuário do localStorage ao montar
  useEffect(() => {
    const usuarioLogado = localStorage.getItem("usuario")
    if (usuarioLogado) {
      const u = JSON.parse(usuarioLogado)
      setUsuario(u)

      // Buscar dados do dashboard
      fetchDashboard(u.id)
    } else {
      navigate("/login") // redireciona se não estiver logado
    }
  }, [])

  async function fetchDashboard(idusuario: number) {
    try {
      const [statsData, perguntasDiaData, arquivosData, perguntasRecentesData] =
        await Promise.all([
          getDashboardStats(idusuario),
          getPerguntasPorDia(idusuario),
          getArquivosMaisUsados(idusuario),
          getPerguntasRecentes(idusuario),
        ])

      setStats(statsData)
      setPerguntasPorDia(perguntasDiaData)
      setArquivosUsados(arquivosData)
      setPerguntasRecentes(perguntasRecentesData)
    } catch (err: any) {
      console.error("Erro ao carregar dashboard:", err)
      alert("Erro ao carregar dashboard: " + err.message)
    }
  }

  function handleLogout() {
    localStorage.removeItem("usuario")
    navigate("/login")
  }

  return (
    <div className="min-h-screen p-8
      bg-white text-black
      dark:bg-neutral-950 dark:text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          Dashboard
          {usuario && <span className="font-medium"> de {usuario.nome}</span>}
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition"
          >
            Sair
          </button>
          <Link
            to="/chat"
            className="bg-neutral-200 dark:bg-neutral-800 px-4 py-2 rounded-lg"
          >
            Voltar ao Chat
          </Link>
        </div>
      </div>

      {/* CARDS DE ESTATÍSTICA */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500">Conversas iniciadas</p>
          <p className="text-3xl font-semibold mt-2">{stats?.conversas ?? 0}</p>
        </div>

        <div className="p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500">Respostas geradas</p>
          <p className="text-3xl font-semibold mt-2">{stats?.respostas ?? 0}</p>
        </div>

        <div className="p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500">Arquivos para busca</p>
          <p className="text-3xl font-semibold mt-2">{stats?.arquivos ?? 0}</p>
        </div>

      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-2 gap-8">

        {/* GRÁFICO DE PERGUNTAS */}
        <div className="p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold mb-4">Perguntas por dia</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={perguntasPorDia}>
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="perguntas" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* GRÁFICO DE ARQUIVOS MAIS USADOS */}
        <div className="p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold mb-4">Arquivos mais utilizados para respostas</h2>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="60%" height={300}>
              <PieChart>
                <Pie data={arquivosUsados} dataKey="value" nameKey="name" outerRadius={100}>
                  {arquivosUsados.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Legenda */}
            <div className="flex flex-col gap-3 text-sm">
              {arquivosUsados.map((arquivo, index) => (
                <div key={arquivo.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="flex-1">{arquivo.name}</span>
                  <span className="text-neutral-500">{arquivo.value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* PERGUNTAS RECENTES */}
      <div className="mt-10 p-6 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-semibold mb-4">Perguntas recentes</h2>
        <div className="space-y-3 text-sm">
          {perguntasRecentes.map((p, index) => (
            <div key={index} className="p-3 rounded-lg bg-neutral-200 dark:bg-neutral-800">
              {p.conteudo}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}