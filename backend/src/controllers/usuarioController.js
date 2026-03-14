import { getDB } from "../config/database.js";
import bcrypt from "bcryptjs";

export async function cadastrar(req, res) {
  const { matricula, nome, senha } = req.body;

  if (!matricula || !nome || !senha) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  try {
    const db = await getDB();
    const senhaHash = await bcrypt.hash(senha, 10);

    const [result] = await db.query(
      "INSERT INTO usuario (matricula, nome, senha) VALUES (?, ?, ?)",
      [matricula, nome, senhaHash]
    );

    res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      id: result.insertId,
      matricula,
      nome
    });

  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ erro: "Essa matrícula já está cadastrada" });
    }
    res.status(500).json({ erro: "Não foi possível cadastrar usuário. Tente novamente mais tarde." });
  }
}

export async function login(req, res) {
  const { matricula, senha } = req.body;

  if (!matricula || !senha) {
    return res.status(400).json({ erro: "Matrícula e senha são obrigatórios" });
  }

  try {
    const db = await getDB();
    const [rows] = await db.query(
      "SELECT * FROM usuario WHERE matricula = ?",
      [matricula]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado. Verifique a matrícula." });
    }

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta. Tente novamente." });
    }

    res.json({
      id: usuario.idusuario,
      matricula: usuario.matricula,
      nome: usuario.nome,
      message: "Login realizado com sucesso"
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ erro: "Ocorreu um erro ao tentar realizar login. Tente novamente mais tarde." });
  }
}

export async function redefinirSenha(req, res) {
  const { matricula, senha } = req.body;
  if (!matricula || !senha) {
    return res.status(400).json({ erro: "Matrícula e senha são obrigatórios" });
  }

  try {
    const db = await getDB();
    const senhaHash = await bcrypt.hash(senha, 10);

    const [result] = await db.query(
      "UPDATE usuario SET senha = ? WHERE matricula = ?",
      [senhaHash, matricula]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Matrícula não encontrada" });
    }

    res.json({ message: "Senha atualizada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar a senha" });
  }
}