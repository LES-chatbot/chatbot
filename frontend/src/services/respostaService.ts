export interface Resposta {
  idresposta: number;
  conteudo: string;
  data: string;
  idmensagem_processada: number;
}
export async function listarRespostas(idconversa: number): Promise<Record<number, Resposta[]>> {
  const response = await fetch(`http://localhost:3000/respostas/${idconversa}`);

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.erro || "Erro ao listar respostas");
  }

  return responseData;
}

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