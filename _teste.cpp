#include <iostream>
#include <vector>

#define MAX_PLAYERS 11

typedef std::vector<int> IntVector;

namespace Game {

// Enum de estado
enum GameState {
    START,
    PLAYING,
    FINISHED
};

// Estrutura simples
struct Player {
    int id;
    std::string name;
};

// Classe de exemplo
class GameManager {
public:

    GameManager() {
        state = START;
    }

    void startGame() {
        state = PLAYING;
        std::cout << "Game started" << std::endl;
    }

    void endGame() {
        state = FINISHED;
        std::cout << "Game finished" << std::endl;
    }

private:
    GameState state;
};

}

// Função global
int soma(int a, int b) {
    return a + b;
}

// Função principal
int main() {

    Game::GameManager manager;

    manager.startGame();

    int resultado = soma(5, 3);

    std::cout << "Resultado: " << resultado << std::endl;

    manager.endGame();

    return 0;
}