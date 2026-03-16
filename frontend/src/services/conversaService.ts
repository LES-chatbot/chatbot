export interface ConversaResponse {
  idconversa: number;
  titulo: string;
  idusuario: number;
  data_criacao: string;
}

// Criar nova conversa (envia apenas idusuario)
export async function criarConversa(idusuario: number): Promise<ConversaResponse> {
  const response = await fetch("http://localhost:3000/conversas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idusuario }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.erro || "Erro ao criar conversa");
  }

  return responseData;
}

// Listar conversas de um usuário
export async function listarConversas(idusuario: number): Promise<ConversaResponse[]> {
  const response = await fetch(`http://localhost:3000/conversas/${idusuario}`);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.erro || "Erro ao listar conversas");
  }

  return responseData;
}

// Buscar uma conversa específica
export async function buscarConversa(idconversa: number): Promise<ConversaResponse> {
  const response = await fetch(`http://localhost:3000/conversas/conversa/${idconversa}`);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.erro || "Conversa não encontrada");
  }

  return responseData;
}

// Atualizar título da conversa
export async function atualizarConversa(idconversa: number, titulo: string): Promise<{ message: string }> {
  const response = await fetch(`http://localhost:3000/conversas/${idconversa}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.erro || "Erro ao atualizar conversa");
  }

  return responseData;
}

// Deletar conversa
export async function deletarConversa(idconversa: number): Promise<{ message: string }> {
  const response = await fetch(`http://localhost:3000/conversas/${idconversa}`, {
    method: "DELETE",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.erro || "Erro ao deletar conversa");
  }

  return responseData;
}

// Iniciar a conversa "Nova conversa" (cria se não existir ou retorna a existente)
export async function iniciarNovaConversa(idusuario: number): Promise<ConversaResponse> {
  const response = await fetch("http://localhost:3000/conversas/iniciar-nova", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idusuario }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.erro || "Erro ao iniciar nova conversa");
  }

  return responseData;
}