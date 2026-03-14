import mysql from "mysql2/promise";

let db = null; // singleton

export async function getDB() {
  if (db) return db; // retorna conexão existente
  db = await mysql.createPool({
    host: "localhost",
    user: "chatbot",
    password: "chatbot",
    database: "chatbot",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  return db;
}