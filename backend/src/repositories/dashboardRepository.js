import { getDB } from "../config/database.js"

export async function countConversasPorUsuario(idusuario) {
  const db = await getDB()
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total FROM conversa WHERE idusuario = ?",
    [idusuario]
  )
  return rows[0].total
}

export async function countRespostasPorUsuario(idusuario) {
  const db = await getDB()
  const [rows] = await db.query(
    `SELECT COUNT(r.idresposta) AS total
     FROM resposta r
     JOIN mensagem_processada mp ON r.idmensagem_processada = mp.idmensagem_processada
     JOIN mensagem m ON mp.idmensagem = m.idmensagem
     JOIN conversa c ON m.idconversa = c.idconversa
     WHERE c.idusuario = ?`,
    [idusuario]
  )
  return rows[0].total
}

export async function countDocumentosPorUsuario(idusuario) {
  const db = await getDB()
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total FROM documento WHERE idusuario = ?",
    [idusuario]
  )
  return rows[0].total
}

export async function getPerguntasPorDia(idusuario) {
  const db = await getDB()
  const [rows] = await db.query(
    `SELECT DATE(m.data) AS dia, COUNT(*) AS perguntas
     FROM mensagem m
     JOIN conversa c ON m.idconversa = c.idconversa
     WHERE c.idusuario = ?
     GROUP BY DATE(m.data)
     ORDER BY DATE(m.data) ASC`,
    [idusuario]
  )
  return rows.map(r => ({ dia: r.dia, perguntas: r.perguntas }))
}

export async function getPerguntasRecentes(idusuario, limit = 5) {
  const db = await getDB()
  const [rows] = await db.query(
    `SELECT m.conteudo
     FROM mensagem m
     JOIN conversa c ON m.idconversa = c.idconversa
     WHERE c.idusuario = ?
     ORDER BY m.data DESC, m.idmensagem DESC
     LIMIT ?`,
    [idusuario, limit]
  )
  return rows.map(r => ({ conteudo: r.conteudo }))
}

export async function getArquivosMaisUsados(idusuario, limit = 5) {
  const db = await getDB()
  const [rows] = await db.query(
    `SELECT d.titulo AS name, COUNT(chr.idchunk) AS value
     FROM documento d
     LEFT JOIN chunk c ON c.iddocumento = d.iddocumento
     LEFT JOIN chunk_has_resposta chr ON chr.idchunk = c.idchunk
     WHERE d.idusuario = ?
     GROUP BY d.iddocumento
     ORDER BY value DESC
     LIMIT ?`,
    [idusuario, limit]
  )
  return rows
}