#include <iostream>
#include <cstdlib>
#include <unistd.h>

using namespace std;

int main(int argc, char* argv[]) {
    int iterations = 0;

    // Попытка получить количество итераций из аргументов командной строки
    if (argc > 1) {
        iterations = atoi(argv[1]);
    }
    else {
        // Попытка получить из переменной окружения
        char* env_iter = getenv("ITER_NUM");
        if (env_iter != nullptr) {
            iterations = atoi(env_iter);
        }
        else {
            cerr << "Ошибка: не задано количество итераций!" << endl;
            return 1;
        }
    }

    cout << "Количество итераций: " << iterations << endl;

    for (int i = 0; i < iterations; ++i) {
        cout << "PID: " << getpid() << ", Итерация: " << i + 1 << endl;
        usleep(500000); // Задержка 500 мс
    }

    return 0;
}
