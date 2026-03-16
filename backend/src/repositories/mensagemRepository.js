import { getDB } from "../config/database.js";

export async function criarMensagem(mensagem) {

  const { conteudo, papel, idconversa } = mensagem;

  const db = await getDB();

  const [result] = await db.query(
    `INSERT INTO mensagem (conteudo, papel, data_envio, idconversa)
     VALUES (?, ?, NOW(), ?)`,
    [conteudo, papel, idconversa]
  );

  return result.insertId;
}

export async function listarMensagensPorConversa(idconversa) {

  const db = await getDB();

  const [rows] = await db.query(
    `SELECT *
     FROM mensagem
     WHERE idconversa = ?
     ORDER BY data_envio ASC`,
    [idconversa]
  );

  return rows;
}

export async function buscarMensagemPorId(idmensagem) {

  const db = await getDB();

  const [rows] = await db.query(
    `SELECT *
     FROM mensagem
     WHERE idmensagem = ?`,
    [idmensagem]
  );

  return rows[0];
}

export async function deletarMensagem(idmensagem) {

  const db = await getDB();

  const [result] = await db.query(
    `DELETE FROM mensagem
     WHERE idmensagem = ?`,
    [idmensagem]
  );

  return result.affectedRows;
}