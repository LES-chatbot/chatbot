export function detectLanguage(filename) {

  if (filename.endsWith(".cpp")) return "cpp";
  if (filename.endsWith(".h")) return "cpp";
  if (filename.endsWith(".hpp")) return "cpp";

  if (filename.endsWith(".sh")) return "bash";

  if (filename.endsWith(".js")) return "javascript";
  if (filename.endsWith(".ts")) return "typescript";

  return "text";
}