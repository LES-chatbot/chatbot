export interface RegisterData {
  matricula: string;
  nome: string;
  senha: string;
}

export interface UserResponse {
  id: number;
  matricula: string;
  nome: string;
  token?: string;
}

export async function registerUser(data: RegisterData): Promise<UserResponse> {
  const response = await fetch("http://localhost:3000/usuarios/cadastro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.erro || "Erro ao cadastrar usuário");
  }

  return responseData;
}

export interface LoginData {
  matricula: string;
  senha: string;
}

export async function loginUser(data: LoginData) {
  const response = await fetch("http://localhost:3000/usuarios/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.erro || "Matrícula ou senha inválidos");
  }

  return responseData;
}

export async function updatePassword(matricula: string, novaSenha: string) {
  const response = await fetch(`http://localhost:3000/usuarios/redefinir-senha`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matricula, senha: novaSenha }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Resposta do servidor não é JSON");
  }

  if (!response.ok) {
    throw new Error(data.erro || "Erro ao atualizar a senha");
  }

  return data;
}