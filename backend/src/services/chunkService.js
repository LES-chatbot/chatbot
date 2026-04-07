export function splitIntoChunks(text, language) {

  const lines = text.split("\n");
  const chunks = [];

  if (language === "cpp" || language === "h"){
    parseBlock(lines, 0, lines.length, chunks);
  }else if (language === "py"){
    parsePython(lines, 0, lines.length, chunks);
  }else{
    parseDefalt(lines, 0, lines.length, chunks)
  }

  return chunks;
}

function makeChunk(tipo, conteudo, ini, fim) {
  return {
    tipo,
    conteudo,
    linha_ini: ini,
    linha_fim: fim
  };
}

function parseBlock(lines, start, end, chunks) {

  let i = start;

  while (i < end) {

    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    // include
    if (/^#include/.test(line)) {
      chunks.push(makeChunk("include", lines[i], i + 1, i + 1));
      i++;
      continue;
    }

    // macro
    if (/^#define/.test(line)) {
      chunks.push(makeChunk("macro", lines[i], i + 1, i + 1));
      i++;
      continue;
    }

    // typedef
    if (/^typedef/.test(line)) {
      chunks.push(makeChunk("typedef", lines[i], i + 1, i + 1));
      i++;
      continue;
    }

    // namespace
    if (/^namespace\s+/.test(line)) {

      const block = readBlock(lines, i);

      chunks.push(makeChunk(
        "namespace",
        block.code,
        i + 1,
        block.end
      ));

      // parse dentro do namespace
      parseBlock(lines, i + 1, block.end - 1, chunks);

      i = block.end;
      continue;
    }

    // class
    if (/^class\s+/.test(line)) {

      const block = readBlock(lines, i);

      chunks.push(makeChunk(
        "class",
        block.code,
        i + 1,
        block.end
      ));

      // parse dentro da classe
      parseBlock(lines, i + 1, block.end - 1, chunks);

      i = block.end;
      continue;
    }

    // struct
    if (/^struct\s+/.test(line)) {

      const block = readBlock(lines, i);

      chunks.push(makeChunk(
        "struct",
        block.code,
        i + 1,
        block.end
      ));

      parseBlock(lines, i + 1, block.end - 1, chunks);

      i = block.end;
      continue;
    }

    // enum
    if (/^enum\s+/.test(line)) {

      const block = readBlock(lines, i);

      chunks.push(makeChunk(
        "enum",
        block.code,
        i + 1,
        block.end
      ));

      i = block.end;
      continue;
    }

    // função
    if (/^[a-zA-Z0-9_:<>~]+\s+[a-zA-Z0-9_:]+\s*\(.*\)\s*\{/.test(line)) {

      const block = readBlock(lines, i);

      chunks.push(makeChunk(
        "function",
        block.code,
        i + 1,
        block.end
      ));

      i = block.end;
      continue;
    }

    i++;
  }
}
function readBlock(lines, start) {

  let braceCount = 0;
  let foundBrace = false;
  let buffer = [];

  let i = start;

  while (i < lines.length) {

    const l = lines[i];
    buffer.push(l);

    if (l.includes("{")) {
      braceCount += (l.match(/{/g) || []).length;
      foundBrace = true;
    }

    if (l.includes("}")) {
      braceCount -= (l.match(/}/g) || []).length;
    }

    i++;

    if (foundBrace && braceCount === 0)
      break;
  }

  return {
    code: buffer.join("\n"),
    end: i
  };
}

function parsePython(lines, start, end, chunks) {
  let i = start;

  while (i < end) {
    let line = lines[i];
    if (!line.trim()) { i++; continue; }

    // Classes
    if (/^class\s+/.test(line)) {
      const block = readPythonBlock(lines, i);
      chunks.push(makeChunk("class", block.code, i + 1, block.end));
      // Parse interno: funções/métodos dentro da classe
      parsePython(lines, i + 1, block.end, chunks);
      i = block.end;
      continue;
    }

    // Funções / métodos
    if (/^(def|async def)\s+/.test(line)) {
      const block = readPythonBlock(lines, i);
      chunks.push(makeChunk("function", block.code, i + 1, block.end));
      i = block.end;
      continue;
    }

    i++;
  }
}

function readPythonBlock(lines, start) {
  const indentMatch = lines[start].match(/^(\s*)/);
  const baseIndent = indentMatch ? indentMatch[1].length : 0;
  let buffer = [];
  let i = start;

  while (i < lines.length) {
    const line = lines[i];
    const indent = line.match(/^(\s*)/)[1].length;

    // Quando encontra linha fora do bloco (menos indentação) e não vazia, termina
    if (i > start && indent <= baseIndent && line.trim() !== "") break;

    buffer.push(line);
    i++;
  }

  return { code: buffer.join("\n"), end: i };
}

function parseDefalt(lines, start, end, chunks) {
  const chunkSize = 100; // número de linhas por chunk
  let i = start;

  while (i < end) {
    const chunkEnd = Math.min(i + chunkSize, end);
    const blockLines = lines.slice(i, chunkEnd);
    chunks.push(makeChunk("default", blockLines.join("\n"), i + 1, chunkEnd));
    i = chunkEnd;
  }
}