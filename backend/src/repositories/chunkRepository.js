import { getDB } from "../config/database.js";

export async function criarChunk({
  estrategia,
  tipo,
  conteudo,
  linha_ini,
  linha_fim,
  iddocumento
}) {

  const db = await getDB();

  const [result] = await db.query(
    `INSERT INTO chunk (estrategia, tipo, conteudo, linha_ini, linha_fim, iddocumento)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [estrategia, tipo, conteudo, linha_ini, linha_fim, iddocumento]
  );

  return result.insertId;
}

export async function deletarChunksPorDocumento(iddocumento) {

  const db = await getDB();

  const [result] = await db.query(
    "DELETE FROM chunk WHERE iddocumento = ?",
    [iddocumento]
  );

  return result.affectedRows;
}