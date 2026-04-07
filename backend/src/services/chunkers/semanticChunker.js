const ESTRATEGIA = "semantico";

export function splitSemantic(text, language) {

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

function makeChunk(tipo, conteudo, ini, fim, estrategia) {
  return {
    tipo,
    estrategia: ESTRATEGIA,
    conteudo,
    linha_ini: ini,
    linha_fim: fim
  };
}
function handleSimpleMatch(type, regex, line, lines, i, chunks) {
  if (!regex.test(line)) return false;

  chunks.push(makeChunk(type, lines[i], i + 1, i + 1));
  return true;
}

function handleBlock(type, regex, line, lines, i, chunks, recursive = true) {
  if (!regex.test(line)) return null;

  const block = readBlock(lines, i);

  chunks.push(makeChunk(
    type,
    block.code,
    i + 1,
    block.end
  ));

  if (recursive) {
    parseBlock(lines, i + 1, block.end - 1, chunks);
  }

  return block.end;
}

function parseBlock(lines, start, end, chunks) {
  let i = start;

  while (i < end) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    // simples
    if (
      handleSimpleMatch("include", /^#include/, line, lines, i, chunks) ||
      handleSimpleMatch("macro", /^#define/, line, lines, i, chunks) ||
      handleSimpleMatch("typedef", /^typedef/, line, lines, i, chunks)
    ) {
      i++;
      continue;
    }

    // blocos com recursão
    let newIndex =
      handleBlock("namespace", /^namespace\s+/, line, lines, i, chunks) ??
      handleBlock("class", /^class\s+/, line, lines, i, chunks) ??
      handleBlock("struct", /^struct\s+/, line, lines, i, chunks);

    if (newIndex !== null) {
      i = newIndex;
      continue;
    }

    // enum (sem recursão)
    newIndex = handleBlock("enum", /^enum\s+/, line, lines, i, chunks, false);

    if (newIndex !== null) {
      i = newIndex;
      continue;
    }

    // função
    newIndex = handleBlock(
      "function",
      /^[a-zA-Z0-9_:<>~]+\s+[a-zA-Z0-9_:]+\s*\(.*\)\s*\{/,
      line,
      lines,
      i,
      chunks,
      false
    );

    if (newIndex !== null) {
      i = newIndex;
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
    chunks.push(makeChunk(null, blockLines.join("\n"), i + 1, chunkEnd));
    i = chunkEnd;
  }
}