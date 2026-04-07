from flask import Flask, request, jsonify
from openai import OpenAI
import os

with open("promptIA.txt", "r", encoding="utf-8") as f:
    system_prompt = f.read()

app = Flask(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route("/processar_mensagem", methods=["POST"])
def processar_mensagem():
    data = request.json

    idmensagem_processada = data.get("idmensagemProcessada")
    conteudo = data.get("conteudo")

    if not idmensagem_processada or not conteudo:
        return jsonify({
            "erro": "idmensagemProcessada e conteudo são obrigatórios"
        }), 400

    try:
        response = client.responses.create(
            model="gpt-5-mini",
            instructions= system_prompt,
            input=conteudo
        )

        resposta_texto = ""
        try:
            resposta_texto = response.output_text
        except:
            try:
                resposta_texto = response.output[0].content[0].text
            except:
                resposta_texto = "Erro ao processar resposta da IA"

        return jsonify({
            "idresposta": None,
            "conteudo": resposta_texto,
            "intencao": "resposta_ia",
            "idmensagemProcessada": idmensagem_processada
        })

    except Exception as e:
        return jsonify({
            "erro": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)