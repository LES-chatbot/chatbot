import { Link } from "react-router-dom"

export default function FileManagerPage() {
  function toggleTheme() {
    document.documentElement.classList.toggle("dark")
  }

  function handleAddFile() {
    // lógica para adicionar arquivo
    console.log("Adicionar novo arquivo")
  }

  return (
    <div className="min-h-screen p-8
      bg-white text-black
      dark:bg-neutral-950 dark:text-white">

      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center">
          <Link to="/chat" className="px-3 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800">
            ← Voltar
          </Link>

          <h1 className="text-2xl font-semibold">
            Gerenciar Arquivos
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800"
          >
            🌗
          </button>

          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-red-600 text-white"
          >
            Logout
          </Link>
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

      <div className="rounded-xl border
        bg-neutral-100 border-neutral-300
        dark:bg-neutral-900 dark:border-neutral-800 divide-y dark:divide-neutral-800">

        {["bhv_passe_profundidade.cpp", "planner.cpp", "strategy.cpp", "bhv_basic_move.cpp", "setplay.cpp", "setplay.h"].map((file) => (
          <div
            key={file}
            className="flex justify-between p-4 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
          >
            <span>{file}</span>
            <button className="px-3 py-1 rounded-lg bg-neutral-300 dark:bg-neutral-700 text-sm">
              Editar
            </button>
          </div>
        ))}

      </div>
    </div>
  )
}