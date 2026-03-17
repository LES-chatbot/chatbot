import { formatCpp } from "../services/formatterService.js";
import { detectLanguage } from "../services/extensaoService.js";
import { splitIntoChunks } from "../services/chunkService.js";
import { db } from "../config/database.js";

export async function uploadFile(req, res) {

  try {

    const { filename, content } = req.body;

    const language = detectLanguage(filename);

    let formattedContent = content;

    if (language === "cpp" || language === "h") {
      formattedContent = await formatCpp(content);
    }

    const chunks = splitIntoChunks(formattedContent);

    await db.query(
      "INSERT INTO documents (title, language, content) VALUES (?, ?, ?)",
      [filename, language, formattedContent]
    );

    res.json({
      success: true,
      chunks: chunks.length
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Erro ao processar arquivo"
    });

  }
}