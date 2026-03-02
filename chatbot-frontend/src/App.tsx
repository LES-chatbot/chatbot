import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

export default function App() {
  return (
    <div className="h-screen bg-neutral-950 text-white flex">

      {/* SIDEBAR ESQUERDA */}
      <aside className="w-60 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-4 border-b border-neutral-800">
          <button className="w-full bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg transition">
            + Nova conversa
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="p-2 rounded-lg hover:bg-neutral-800 cursor-pointer">
            Melhora de passes
          </div>
          <div className="p-2 rounded-lg hover:bg-neutral-800 cursor-pointer">
            Criação de jogadas
          </div>
        </div>
      </aside>


      {/* CHAT */}
      <main className="flex-1 flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-neutral-800">
          <h1 className="font-semibold">Chat 2D</h1>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
          <div className="bg-neutral-800 p-4 rounded-xl max-w-xl">
            Olá 👋
          </div>

          <div className="bg-green-600 p-4 rounded-xl max-w-xl self-end">
            Quero que me explique como funciona a decisão de passes.
          </div>
          
          <div className="bg-neutral-800 p-4 rounded-xl max-w-xl">
            Ok ___ __ _____ _____ ____ _________ __ __ _____ ___ ___ _ ______ ____ _ _ __ ___ _________ ______ ___ ____ _____ _____ _____ ____
          </div>
        </div>

        {/* Barra de perguntas */}
        <div className="p-4 border-t border-neutral-800">
          <div className="bg-neutral-800 rounded-xl p-3 flex items-center">
            <input
              className="flex-1 bg-transparent outline-none"
              placeholder="Digite sua mensagem..."
            />
            <button className="ml-3 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg transition">
              Enviar
            </button>
          </div>
        </div>
      </main>


      {/* FILES */}
      <aside className="w-72 bg-neutral-900 border-l border-neutral-800 flex flex-col">

        {/* Seleção de Projeto */}
        <div className="p-4 border-b border-neutral-800">
          <label className="text-sm text-neutral-400 block mb-2">
            Arquivos para pesquisa
          </label>
        </div>

        {/* Arquivos Selecionados */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">

          <div className="bg-neutral-800 p-3 rounded-lg flex items-center justify-between">
            <span>📄 bhv_passe_profundidade.cpp</span>
          </div>

          <div className="bg-neutral-800 p-3 rounded-lg flex items-center justify-between">
            <span>📄 planner.cpp</span>
          </div>

          <div className="bg-neutral-800 p-3 rounded-lg flex items-center justify-between">
            <span>📄 strategy.cpp</span>
          </div>

        </div>

        {/* Combobox para adicionar mais arquivos */}
        <div className="p-4 border-t border-neutral-800">
          <label className="text-sm text-neutral-400 block mb-2">
            Adicionar arquivo
          </label>
          <select className="w-full bg-neutral-800 p-2 rounded-lg outline-none">
            <option>Selecione...</option>
            <option>bhv_basic_move.cpp</option>
            <option>setplay.cpp</option>
            <option>setplay.h</option>
          </select>
        </div>

      </aside>

    </div>
  )
}