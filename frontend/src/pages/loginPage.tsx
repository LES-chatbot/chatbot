import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { loginUser, updatePassword } from "../services/userService"

export default function LoginPage() {
  const navigate = useNavigate()
  const [matricula, setMatricula] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [recoveryMatricula, setRecoveryMatricula] = useState("")
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null)

  // **Estados faltantes do modal**
  const [step, setStep] = useState(1)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  function toggleTheme() {
    document.documentElement.classList.toggle("dark")
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!matricula || !senha) {
      setError("Preencha todos os campos")
      return
    }

    try {
      setLoading(true)
      const user = await loginUser({ matricula, senha })
      localStorage.setItem("usuario", JSON.stringify(user))
      navigate("/chat")
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-neutral-950 dark:text-white transition-colors">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:opacity-80 transition-opacity"
        >
          🌗
        </button>
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl border shadow-lg bg-neutral-100 border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm font-medium border bg-red-100 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-neutral-200 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-green-500 transition-all placeholder:text-neutral-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-neutral-200 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-green-500 transition-all placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-neutral-400 dark:disabled:bg-neutral-700 p-3 rounded-lg font-medium text-white transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:underline font-medium"
          >
            Esqueci a senha
          </button>
        </p>

        <p className="text-sm text-center mt-2 text-neutral-600 dark:text-neutral-400">
          Não possui conta?{" "}
          <Link
            to="/register"
            className="text-green-500 hover:underline font-medium"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
      {/* Modal de redefinição de senha */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-full max-w-sm shadow-lg relative">
            <button
              onClick={() => {
                setShowModal(false)
                setStep(1)
                setRecoveryMatricula("")
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

            {step === 1 && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Digite sua matrícula"
                  value={recoveryMatricula}
                  onChange={(e) => setRecoveryMatricula(e.target.value)}
                  className="w-full p-3 rounded-lg bg-neutral-200 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-green-500 transition-all placeholder:text-neutral-500"
                />
                <button
                  className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-medium text-white transition-colors"
                  onClick={() => {
                    if (recoveryMatricula.trim() === "") {
                      setRecoveryMessage("Digite sua matrícula")
                      return
                    }
                    setStep(2)
                    setRecoveryMessage(null)
                  }}
                >
                  Continuar
                </button>
              </div>
            )}

            {step === 2 && (
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
                    await updatePassword(recoveryMatricula, newPassword)
                    setRecoveryMessage("Senha atualizada com sucesso!")

                    // Resetar campos e fechar modal ✅
                    setStep(1)
                    setRecoveryMatricula("")
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
            )}
          </div>
        </div>
      )}
    </div>
  )
}