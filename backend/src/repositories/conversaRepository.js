import { getDB } from "../config/database.js";

export async function criarConversa(idusuario) {

  const db = await getDB();

  const titulo = "Nova conversa";

  const [result] = await db.query(
    `INSERT INTO conversa (titulo, data_criacao, idusuario)
     VALUES (?, CURDATE(), ?)`,
    [titulo, idusuario]
  );

  return result.insertId;
}

export async function listarConversasPorUsuario(idusuario) {

  const db = await getDB();

  const [rows] = await db.query(
    `SELECT * FROM conversa
     WHERE idusuario = ?
     ORDER BY data_criacao DESC`,
    [idusuario]
  );

  return rows;
}

export async function buscarConversaPorId(idconversa) {

  const db = await getDB();

  const [rows] = await db.query(
    `SELECT * FROM conversa
     WHERE idconversa = ?`,
    [idconversa]
  );

  return rows[0];
}

export async function atualizarConversa(idconversa, dados) {

  const db = await getDB();

  const { titulo } = dados;

  const [result] = await db.query(
    `UPDATE conversa
     SET titulo = ?
     WHERE idconversa = ?`,
    [titulo, idconversa]
  );

  return result.affectedRows;
}

export async function deletarConversa(idconversa) {

  const db = await getDB();

  const [result] = await db.query(
    `DELETE FROM conversa
     WHERE idconversa = ?`,
    [idconversa]
  );

  return result.affectedRows;
}

export async function buscarPorTituloUsuario(titulo, idusuario) {
  const db = await getDB();

  const [rows] = await db.query(
    `SELECT * FROM conversa 
     WHERE titulo = ? AND idusuario = ? 
     LIMIT 1`,
    [titulo, idusuario]
  );

  return rows[0] || null;
}