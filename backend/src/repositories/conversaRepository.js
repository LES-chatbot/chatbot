import { getDB } from "../config/database.js";

export async function criarConversa(titulo, idusuario) {

  const db = await getDB();

  const [result] = await db.execute(
    `INSERT INTO conversa (titulo, data_criacao, idusuario)
     VALUES (?, CURDATE(), ?)`,
    [titulo, idusuario]
  );

  return result.insertId;
}

export async function listarConversasPorUsuario(idusuario) {

  const db = await getDB();

  const [rows] = await db.execute(
    `SELECT *
     FROM conversa
     WHERE idusuario = ?
     ORDER BY data_criacao DESC`,
    [idusuario]
  );

  return rows;
}

export async function buscarConversaPorId(idconversa) {

  const db = await getDB();

  const [rows] = await db.execute(
    `SELECT *
     FROM conversa
     WHERE idconversa = ?`,
    [idconversa]
  );

  return rows[0];
}

export async function deletarConversa(idconversa) {

  const db = await getDB();

  const [result] = await db.execute(
    `DELETE FROM conversa
     WHERE idconversa = ?`,
    [idconversa]
  );

  return result.affectedRows;
}

export async function atualizarTitulo(idconversa, titulo) {

  const db = await getDB();

  await db.execute(
    `UPDATE conversa
     SET titulo = ?
     WHERE idconversa = ?`,
    [titulo, idconversa]
  );
}