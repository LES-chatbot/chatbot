import { getDB } from "../config/database.js";

export async function cadastrarMensagemProcessada({ conteudo, intencao, entidades, idmensagem }) {
  const db = await getDB();

  const [result] = await db.query(
    `INSERT INTO mensagem_processada 
      (conteudo, intencao, entidades, idmensagem)
     VALUES (?, ?, ?, ?)`,
    [conteudo, intencao, entidades, idmensagem]
  );

  return result.insertId;
}

export async function buscarMensagemProcessadaPorId(idmensagem_processada) {
  const db = await getDB();
  const [rows] = await db.query(
    `SELECT * FROM mensagem_processada WHERE idmensagem_processada = ?`,
    [idmensagem_processada]
  );
  return rows.length > 0 ? rows[0] : null;
}