// services/respostaService.ts
export interface Resposta {
  idresposta: number;
  conteudo: string;
  data: string;
  idmensagem_processada: number;
}

// Retorna respostas agrupadas por idmensagem
export async function listarRespostas(idconversa: number): Promise<Record<number, Resposta[]>> {
  const response = await fetch(`http://localhost:3000/respostas/${idconversa}`);

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.erro || "Erro ao listar respostas");
  }

  // Espera que o backend retorne algo como:
  // { [idmensagem]: Resposta[] }
  return responseData;
}

// Cadastrar uma resposta (opcional se precisar enviar do frontend)
export async function cadastrarResposta(data: {
  idmensagem_processada: number;
  conteudo: string;
}): Promise<Resposta> {
  const response = await fetch(`http://localhost:3000/respostas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.erro || "Erro ao cadastrar resposta");
  }

  return responseData;
}