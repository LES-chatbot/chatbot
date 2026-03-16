from flask import Flask, request, jsonify

app = Flask(__name__)

# Função que simula a IA e gera uma resposta
def gerar_resposta(mensagem_processada):
    conteudo = mensagem_processada.get("conteudo", "")
    intencao = mensagem_processada.get("intencao", "desconhecida")
    entidades = mensagem_processada.get("entidades", "")
    
    # Simulação simples de resposta
    resposta_texto = f"Entendi sua mensagem: '{conteudo}'. Intenção: {intencao}. Entidades: {entidades}"
    return resposta_texto

@app.route("/processar_mensagem", methods=["POST"])
def processar_mensagem():
    data = request.json
    idmensagem_processada = data.get("idmensagemProcessada")
    conteudo = data.get("conteudo")
    intencao = data.get("intencao", "desconhecida")
    entidades = data.get("entidades", "")

    if not idmensagem_processada or not conteudo:
        return jsonify({"erro": "idmensagemProcessada e conteudo são obrigatórios"}), 400

    # Gerar resposta
    resposta_texto = gerar_resposta({
        "conteudo": conteudo,
        "intencao": intencao,
        "entidades": entidades
    })

    # Retornar JSON sem salvar no banco
    return jsonify({
        "idresposta": None,  # será gerado pelo Node
        "conteudo": resposta_texto,
        "data": None,         # será preenchido pelo Node
        "idmensagemProcessada": idmensagem_processada
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)