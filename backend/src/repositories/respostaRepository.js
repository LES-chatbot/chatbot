import { getDB } from "../config/database.js";

export async function cadastrarResposta({ idmensagem_processada, conteudo, data }) {
  const db = await getDB();
  const [result] = await db.query(
    `INSERT INTO resposta (conteudo, data, idmensagem_processada)
     VALUES (?, ?, ?)`,
    [conteudo, data, idmensagem_processada]
  );
  return result.insertId;
}

export async function listarRespostasPorMensagemProcessada(idmensagem_processada) {
  const db = await getDB();
  const [rows] = await db.query(
    `SELECT * FROM resposta WHERE idmensagem_processada = ? ORDER BY data ASC`,
    [idmensagem_processada]
  );
  return rows;
}

export async function listarRespostasPorConversa(idconversa) {
  const db = await getDB();
  
  const [rows] = await db.query(
    `
    SELECT r.idresposta, r.conteudo AS resposta, mp.idmensagem, mp.conteudo AS mensagem_processada
    FROM resposta r
    JOIN mensagem_processada mp ON r.idmensagem_processada = mp.idmensagem_processada
    JOIN mensagem m ON mp.idmensagem = m.idmensagem
    WHERE m.idconversa = ?
    ORDER BY m.idmensagem ASC, r.idresposta ASC
    `,
    [idconversa]
  );

  return rows;
}

export async function buscarRespostaPorMensagemProcessada(idmensagem_processada) {
  const db = await getDB();

  const [rows] = await db.query(
    `SELECT * FROM resposta WHERE idmensagem_processada = ?`,
    [idmensagem_processada]
  );

  return rows[0];
}