import { getDB } from "../config/database.js";

export async function enviarMensagem(mensagem) {

  const { conteudo, idconversa } = mensagem;

  const db = await getDB();

  const [result] = await db.query(
    `INSERT INTO mensagem (conteudo, data, idconversa)
     VALUES (?, CURDATE(), ?)`,
    [conteudo, idconversa]
  );

  return result.insertId;
}

export async function listarMensagensPorConversa(idconversa) {

  const db = await getDB();

  const [rows] = await db.query(
    `SELECT * 
     FROM mensagem 
     WHERE idconversa = ?
     ORDER BY idmensagem ASC`,
    [idconversa]
  );

  return rows;
}

export async function deletarMensagensPorConversa(idconversa) {
  const db = await getDB();
  const [result] = await db.query(
    "DELETE FROM mensagem WHERE idconversa = ?",
    [idconversa]
  );
  return result.affectedRows;
}