#include <iostream>
#include <cstdlib>
#include <unistd.h>
#include <sys/wait.h>

using namespace std;

int main() {
    pid_t pid1, pid2;
    int status;

    // First child process: pass iterations via command line arguments
    pid1 = fork();
    if (pid1 == 0) {
        // Child process 1
        cout << "Starting the first child process..." << endl;
        execl("./lab_03x", "lab_03x", "3", nullptr);
        // If execl returns control, an error has occurred
        cerr << "Error starting Lab-03x via execl" << endl;
        exit(1);
    }
    else if (pid1 < 0) {
        cerr << "Error creating the first child process" << endl;
        return 1;
    }

    // Second child process: pass iterations via environment variable
    pid2 = fork();
    if (pid2 == 0) {
        // Set the ITER_NUM environment variable
        cout << "Starting the second child process..." << endl;
        setenv("ITER_NUM", "5", 1);
        // Start Lab-03x without arguments
        execl("./lab_03x", "lab_03x", nullptr);
        cerr << "Error starting Lab-03x via execl" << endl;
        exit(1);
    }
    else if (pid2 < 0) {
        cerr << "Error creating the second child process" << endl;
        return 1;
    }

    cout << "Parent process is waiting for child processes to finish..." << endl;

    // Waiting for both child processes to finish
    waitpid(pid1, &status, 0);
    cout << "The first child process has finished" << endl;

    waitpid(pid2, &status, 0);
    cout << "The second child process has finished" << endl;

    cout << "Both child processes have finished." << endl;
    return 0;
}
