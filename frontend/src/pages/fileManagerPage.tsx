import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { updatePassword } from "../services/userService"

export default function FileManagerPage() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState<{ nome: string; matricula: string } | null>(null)

  // Checa login
  useEffect(() => {
    const usuarioLogado = localStorage.getItem("usuario")
    if (usuarioLogado) {
      setUsuario(JSON.parse(usuarioLogado))
    } else {
      navigate("/login")
    }
  }, [])

  function toggleTheme() {
    document.documentElement.classList.toggle("dark")
  }

  function handleAddFile() {
    console.log("Adicionar novo arquivo")
  }

  function handleLogout() {
    localStorage.removeItem("usuario")
    navigate("/login")
  }

  const arquivos = [
    { nome: "bhv_passe_profundidade.cpp", atualizado: "08/03/2026" },
    { nome: "planner.cpp", atualizado: "10/03/2026" },
    { nome: "strategy.cpp", atualizado: "09/03/2026" },
    { nome: "bhv_basic_move.cpp", atualizado: "05/03/2026" },
    { nome: "setplay.cpp", atualizado: "07/03/2026" },
    { nome: "setplay.h", atualizado: "07/03/2026" },
  ]

  // Estado do modal de redefinição de senha
  const [showModal, setShowModal] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null)

  return (
    <div className="min-h-screen p-8 bg-white text-black dark:bg-neutral-950 dark:text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center">
          <Link
            to="/chat"
            className="px-3 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800"
          >
            ← Voltar
          </Link>

          <h1 className="text-2xl font-semibold">Gerenciar Arquivos
          {usuario && <span className="font-medium"> de {usuario.nome}</span>}</h1>
        </div>

        <div className="flex gap-3 items-center">

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-400 transition"
          >
            Redefinir Senha
          </button>

          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Dashboard
          </Link>

          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800"
          >
            🌗
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Botão adicionar arquivo */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddFile}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          + Adicionar Arquivo
        </button>
      </div>

      {/* Lista de arquivos */}
      <div className="rounded-xl border bg-neutral-100 border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800 divide-y dark:divide-neutral-800">
        {arquivos.map((file) => (
          <div
            key={file.nome}
            className="flex justify-between items-center p-4 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
          >
            <div className="flex flex-col">
              <span className="font-medium">{file.nome}</span>
              <span className="text-xs text-neutral-500">
                Última modificação: {file.atualizado}
              </span>
            </div>

            <button className="px-3 py-1 rounded-lg bg-neutral-300 dark:bg-neutral-700 text-sm">
              Editar
            </button>
          </div>
        ))}
      </div>

      {/* Modal de redefinição de senha */}
      {showModal && usuario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-sm shadow-lg relative">
            <button
              onClick={() => {
                setShowModal(false)
                setNewPassword("")
                setConfirmPassword("")
                setRecoveryMessage(null)
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">Redefinir senha</h2>

            {recoveryMessage && (
              <div className="mb-4 p-2 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm text-center">
                {recoveryMessage}
              </div>
            )}

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault()
                setRecoveryMessage(null)

                if (!newPassword || !confirmPassword) {
                  setRecoveryMessage("Preencha todos os campos")
                  return
                }

                if (newPassword !== confirmPassword) {
                  setRecoveryMessage("As senhas não coincidem")
                  return
                }

                try {
                  await updatePassword(usuario.matricula, newPassword)
                  setRecoveryMessage("Senha atualizada com sucesso!")

                  // Reset campos e fechar modal
                  setNewPassword("")
                  setConfirmPassword("")
                  setShowModal(false)
                } catch (err: any) {
                  setRecoveryMessage(err.message || "Erro ao atualizar a senha")
                }
              }}
            >
              <input
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-neutral-200 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-green-500 transition-all placeholder:text-neutral-500"
              />
              <input
                type="password"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-neutral-200 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-green-500 transition-all placeholder:text-neutral-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-medium text-white transition-colors"
              >
                Atualizar senha
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}