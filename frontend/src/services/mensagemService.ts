const API = "http://localhost:3000/mensagens";

export async function enviarMensagem(idconversa: number, conteudo: string) {

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idconversa,
      conteudo
    })
  });

  if (!res.ok) {
    throw new Error("Erro ao enviar mensagem");
  }

  return await res.json();
}

export async function listarMensagens(idconversa: number) {

  const res = await fetch(`${API}/${idconversa}`);

  if (!res.ok) {
    throw new Error("Erro ao listar mensagens");
  }

  return await res.json();
}

export async function deletarMensagem(id: number) {

  const res = await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar mensagem");
  }

  return await res.json();
}