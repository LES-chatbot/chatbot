const API = "http://localhost:3000/conversas";

export async function criarConversa(idusuario: number) {

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ idusuario })
  });

  if (!res.ok) {
    throw new Error("Erro ao criar conversa");
  }

  return await res.json();
}

export async function listarConversas(idusuario: number) {

  const res = await fetch(`${API}/usuario/${idusuario}`);

  if (!res.ok) {
    throw new Error("Erro ao listar conversas");
  }

  return await res.json();
}

export async function obterConversa(id: number) {

  const res = await fetch(`${API}/${id}`);

  if (!res.ok) {
    throw new Error("Erro ao buscar conversa");
  }

  return await res.json();
}

export async function deletarConversa(id: number) {

  const res = await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar conversa");
  }

  return await res.json();
}