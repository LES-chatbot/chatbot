# ================================
# IMPORTS
# ================================

import os
import math
import asyncio
from typing import List, Dict


# ================================
# FUNÇÕES SIMPLES
# ================================

def soma(a: int, b: int) -> int:
    """Retorna a soma de dois números"""
    return a + b


def media(valores: List[float]) -> float:
    """Calcula a média de uma lista"""
    if not valores:
        return 0.0
    return sum(valores) / len(valores)


# ================================
# FUNÇÃO COM FUNÇÃO INTERNA
# ================================

def processar_numeros(numeros: List[int]) -> Dict[str, float]:

    def quadrado(x: int) -> int:
        return x * x

    quadrados = [quadrado(n) for n in numeros]

    return {
        "total": sum(quadrados),
        "media": media(quadrados),
        "quantidade": len(quadrados)
    }


# ================================
# DECORATOR
# ================================

def log_execucao(func):
    def wrapper(*args, **kwargs):
        print(f"Executando {func.__name__}")
        resultado = func(*args, **kwargs)
        print(f"Finalizado {func.__name__}")
        return resultado
    return wrapper


# ================================
# CLASSE
# ================================

class Calculadora:

    def __init__(self):
        self.historico = []

    @log_execucao
    def adicionar(self, a: float, b: float) -> float:
        resultado = a + b
        self.historico.append(resultado)
        return resultado

    def multiplicar(self, a: float, b: float) -> float:
        resultado = a * b
        self.historico.append(resultado)
        return resultado

    def limpar(self):
        self.historico.clear()

    def obter_historico(self) -> List[float]:
        return self.historico


# ================================
# FUNÇÃO ASSÍNCRONA
# ================================

async def buscar_dados(url: str) -> str:
    print(f"Buscando dados de {url}")
    await asyncio.sleep(1)
    return "dados recebidos"


# ================================
# MAIN
# ================================

def main():

    numeros = [1, 2, 3, 4, 5]

    resultado = processar_numeros(numeros)
    print("Resultado:", resultado)

    calc = Calculadora()
    print(calc.adicionar(5, 3))
    print(calc.multiplicar(4, 6))

    print("Histórico:", calc.obter_historico())


if __name__ == "__main__":
    main()