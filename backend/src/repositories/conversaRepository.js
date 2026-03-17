import { getDB } from "../config/database.js";

export async function criarConversa(idusuario) {
  const db = await getDB();
  const titulo = "Nova conversa";

  const [result] = await db.query(
    `INSERT INTO conversa (titulo, data_criacao, idusuario, ativo)
     VALUES (?, CURDATE(), ?, 1)`,
    [titulo, idusuario]
  );

  return result.insertId;
}

export async function listarConversasPorUsuario(idusuario) {
  const db = await getDB();

  const [rows] = await db.query(
    `SELECT * FROM conversa
     WHERE idusuario = ? AND ativo = 1
     ORDER BY data_criacao DESC`,
    [idusuario]
  );

  return rows;
}

export async function buscarConversaPorId(idconversa) {
  const db = await getDB();

  const [rows] = await db.query(
    `SELECT * FROM conversa
     WHERE idconversa = ? AND ativo = 1`,
    [idconversa]
  );

  return rows[0] || null;
}

export async function atualizarConversa(idconversa, dados) {
  const db = await getDB();
  const { titulo } = dados;

  const [result] = await db.query(
    `UPDATE conversa
     SET titulo = ?
     WHERE idconversa = ? AND ativo = 1`,
    [titulo, idconversa]
  );

  return result.affectedRows;
}

export async function deletarConversa(idconversa) {
  const db = await getDB();

  const [result] = await db.query(
    `UPDATE conversa
     SET ativo = 0
     WHERE idconversa = ?`,
    [idconversa]
  );

  return result.affectedRows;
}

export async function buscarPorTituloUsuario(titulo, idusuario) {
  const db = await getDB();

  const [rows] = await db.query(
    `SELECT * FROM conversa 
     WHERE titulo = ? AND idusuario = ? AND ativo = 1
     LIMIT 1`,
    [titulo, idusuario]
  );

  return rows[0] || null;
}