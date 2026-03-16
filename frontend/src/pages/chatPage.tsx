import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import {criarConversa,listarConversas, deletarConversa, iniciarNovaConversa} from "../services/conversaService"
import type { ConversaResponse } from "../services/conversaService"

import { listarDocumentos } from "../services/documentoService"
import type { DocumentoResponse } from "../services/documentoService"

import {enviarMensagem,listarMensagens} from "../services/mensagemService"
import type { MensagemResponse } from "../services/mensagemService"

export default function ChatPage() {

  const navigate = useNavigate()

  const [usuario, setUsuario] = useState<{ nome:string, id:number } | null>(null)
  const [conversas, setConversas] = useState<ConversaResponse[]>([])
  const [documentos, setDocumentos] = useState<DocumentoResponse[]>([])
  const [documentosSelecionados, setDocumentosSelecionados] = useState<DocumentoResponse[]>([])
  const [mensagens, setMensagens] = useState<MensagemResponse[]>([])
  const [mensagemInput, setMensagemInput] = useState("")
  const [conversaAtiva, setConversaAtiva] = useState<number | null>(null)

  // Carrega usuário
  useEffect(() => {

    const usuarioLogado = localStorage.getItem("usuario")

    if (usuarioLogado) {

      const u = JSON.parse(usuarioLogado)

      setUsuario(u)

      carregarConversas(u.id)
      carregarDocumentos(u.id)
    } else {

      navigate("/login")

    }

  }, [])


  async function carregarMensagens(idconversa:number){
    try{
      const lista = await listarMensagens(idconversa)
      setMensagens(lista)
    }catch(error){
      console.error("Erro ao carregar mensagens", error)
    }
  }
async function handleEnviarMensagem() {
  if (!mensagemInput.trim() || !usuario) {
    console.log("Mensagem vazia ou usuário não definido");
    return;
  }

  try {
    let idConversa = conversaAtiva;
    console.log("Conversa ativa antes de enviar:", idConversa);
    console.log("Mensagem que será enviada:", mensagemInput);

    if (!idConversa) {
      const nova = await iniciarNovaConversa(usuario.id);
      idConversa = nova.idconversa;
      setConversaAtiva(idConversa);
      await carregarConversas(usuario.id);
      await carregarMensagens(idConversa);
    }
    const res = await enviarMensagem({
      conteudo: mensagemInput,
      idconversa: idConversa
    });
    setMensagens(prev => [...prev, res.mensagem]);
    setMensagemInput("");

    await carregarConversas(usuario.id);

  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
}

  function adicionarDocumento(iddocumento: number) {

    const doc = documentos.find(d => d.iddocumento === iddocumento)

    if (!doc) return

    const jaExiste = documentosSelecionados.some(d => d.iddocumento === iddocumento)

    if (jaExiste) return

    setDocumentosSelecionados(prev => [...prev, doc])
  }
  function removerDocumento(iddocumento: number) {

    setDocumentosSelecionados(prev =>
      prev.filter(d => d.iddocumento !== iddocumento)
    )
  }

  async function carregarDocumentos(idusuario:number){

    try{

      const lista = await listarDocumentos(idusuario)

      setDocumentos(lista)

    }catch(error){

      console.error("Erro ao carregar documentos", error)

    }

  }

  async function carregarConversas(idusuario:number){

    try{

      const lista = await listarConversas(idusuario)

      setConversas(lista)

    }catch(error){

      console.error("Erro ao carregar conversas", error)

    }

  }

async function handleNovaConversa(){

  if(!usuario) return

  try{

    await criarConversa(usuario.id)

    await carregarConversas(usuario.id)

  }catch(error){

    console.error("Erro ao criar conversa", error)

  }

}
async function handleDeletarConversa(idconversa: number) {
  if (!usuario) return;

  try {
    // chamar o serviço de deletar conversa
    await deletarConversa(idconversa);

    // atualizar lista de conversas
    await carregarConversas(usuario.id);

    // se a conversa deletada estava ativa, limpar chat
    if (conversaAtiva === idconversa) {
      setConversaAtiva(null);
      setMensagens([]);
    }
  } catch (error) {
    console.error("Erro ao deletar conversa", error);
  }
}

  function handleLogout(){

    localStorage.removeItem("usuario")

    navigate("/login")

  }


  return (

    <div className="h-screen flex
      bg-white text-black
      dark:bg-neutral-950 dark:text-white">

      {/* SIDEBAR ESQUERDA */}
      <aside className="w-60 flex flex-col border-r
        bg-neutral-100 border-neutral-300
        dark:bg-neutral-900 dark:border-neutral-800">

        <div className="p-4 border-b border-neutral-300 dark:border-neutral-800 space-y-2">

          <div className="font-semibold">
            Olá, {usuario?.nome || "Usuário"}
          </div>

          <button
            onClick={handleNovaConversa}
            className="w-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 p-2 rounded-lg transition"
          >
            + Nova conversa
          </button>

          <Link
            to="/files"
            className="block text-center bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 p-2 rounded-lg transition text-sm"
          >
            Configurações
          </Link>

        </div>


        {/* LISTA DE CONVERSAS */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">

          {conversas.length === 0 && (
            <div className="text-sm text-neutral-500">
              Nenhuma conversa ainda
            </div>
          )}

          {conversas.map(conversa => (
            <div
              key={conversa.idconversa}
              className="relative group p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition flex justify-between items-center"
              onClick={() => {
                setConversaAtiva(conversa.idconversa)
                carregarMensagens(conversa.idconversa)
              }}
            >
              <span>{conversa.titulo}</span>

              {/* Botão de deletar */}
              <button
                onClick={(e) => {
                  e.stopPropagation() // evita selecionar a conversa ao deletar
                  handleDeletarConversa(conversa.idconversa)
                }}
                className="text-red-500 text-sm hover:underline hidden group-hover:block"
              >
                Encerrar
              </button>

            </div>
          ))}

        </div>


        <div className="p-4 border-t border-neutral-300 dark:border-neutral-800">

          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Sair
          </button>

        </div>

      </aside>


      {/* CHAT CENTRAL */}
<main className="flex-1 flex flex-col">

  {/* Cabeçalho do chat */}
  <div className="p-4 border-b border-neutral-300 dark:border-neutral-800 font-semibold flex items-center justify-between">
    <span>Chat</span>
    {conversaAtiva !== null && (
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        {conversas.find(c => c.idconversa === conversaAtiva)?.titulo || "Conversa"}
      </span>
    )}
  </div>

  {/* Mensagens */}
  <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
    {mensagens.length === 0 && (
      <div className="text-sm text-neutral-500">
        Nenhuma mensagem ainda
      </div>
    )}

    {mensagens.map(msg => (
      <div
        key={msg.idmensagem}
        className="bg-green-600 text-white p-4 rounded-xl max-w-xl self-end"
      >
        {msg.conteudo}
      </div>
    ))}
  </div>

  {/* Barra de envio */}
  <div className="p-4 border-t border-neutral-300 dark:border-neutral-800">
    <div className="bg-neutral-200 dark:bg-neutral-800 rounded-xl p-3 flex items-center">

      <input
        className="flex-1 bg-transparent outline-none"
        placeholder="Digite sua mensagem..."
        value={mensagemInput}
        onChange={(e) => setMensagemInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleEnviarMensagem();
        }}
      />

      <button
        onClick={handleEnviarMensagem}
        className="ml-3 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg transition text-white"
      >
        Enviar
      </button>

    </div>
  </div>

</main>


      {/* PAINEL DIREITO */}
      <aside className="w-72 flex flex-col border-l
        bg-neutral-100 border-neutral-300
        dark:bg-neutral-900 dark:border-neutral-800">

        <div className="p-4 border-b border-neutral-300 dark:border-neutral-800">

          <label className="text-sm text-neutral-500 dark:text-neutral-400 block">
            Arquivos para pesquisa
          </label>

        </div>

        <div className="flex-1 p-4 space-y-3 overflow-y-auto">

          {documentosSelecionados.length === 0 && (
            <div className="text-sm text-neutral-500">
              Nenhum arquivo selecionado
            </div>
          )}

          {documentosSelecionados.map(doc => (

            <div
              key={doc.iddocumento}
              className="bg-neutral-200 dark:bg-neutral-800 p-3 rounded-lg flex justify-between items-center"
            >
              <span>{doc.titulo}</span>

              <button
                onClick={() => removerDocumento(doc.iddocumento)}
                className="text-red-500 text-sm hover:underline"
              >
                remover
              </button>

            </div>

          ))}

        </div>      
        <div className="p-4 border-t border-neutral-300 dark:border-neutral-800">

          <label className="text-sm text-neutral-500 dark:text-neutral-400 block mb-2">
            Adicionar arquivo
          </label>

          <select
            className="w-full bg-neutral-200 dark:bg-neutral-800 p-2 rounded-lg outline-none"
            onChange={(e) => adicionarDocumento(Number(e.target.value))}
          >

            <option value="">Selecione...</option>

            {documentos.map(doc => (

              <option key={doc.iddocumento} value={doc.iddocumento}>
                {doc.titulo}
              </option>

            ))}

          </select>

        </div>

      </aside>

    </div>

  )
}