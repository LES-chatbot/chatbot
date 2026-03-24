import { spawn } from "node:child_process";

function preprocessCodeCpp(code) {

  // normalizar quebra de linha
  code = code.replaceAll("\r\n", "\n");

  // remover comentários de linha
  code = code.replace(/\/\/.*$/gm, "");

  // remover comentários de bloco
  code = code.replace(/\/\*[\s\S]*?\*\//g, "");

  // remover using namespace
  code = code.replace(/^\s*using\s+namespace\s+.*;/gm, "");

  // substituir tabs
  code = code.replaceAll("\t", " ");

  // remover espaços duplicados
  code = code.replace(/ {2,}/g, " ");

  // remover espaços nas bordas
  code = code
    .split("\n")
    .map(l => l.trim())
    .join("\n");

  // juntar ";" quebrado
  code = code.replace(/\n\s*;/g, ";");

  // remover linhas vazias duplicadas
  code = code.replace(/\n\s*\n+/g, "\n\n");

  return code.trim();
}

export function formatCpp(code) {
  return new Promise((resolve, reject) => {

    const cleaned = preprocessCodeCpp(code);

    const clang = spawn("clang-format", [
      "--style={BasedOnStyle: Google, IndentWidth: 4, ColumnLimit: 120}"
    ]);

    let output = "";
    let error = "";

    clang.stdout.on("data", data => {
      output += data.toString();
    });

    clang.stderr.on("data", data => {
      error += data.toString();
    });

    clang.on("close", exitCode => {
      if (exitCode === 0) {
        resolve(output);
      } else {
        reject(new Error(error));
      }
    });

    clang.stdin.write(cleaned);
    clang.stdin.end();
  });
}