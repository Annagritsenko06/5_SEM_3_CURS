 const http = require('http');
const readline = require('readline');

const states = ['norm', 'stop', 'test', 'idle'];
let currentState = 'norm';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function updateStatePrompt() {
    rl.setPrompt(`${currentState} --> `);
    rl.prompt();
}

function handleStateChange(newState) {
    if (states.includes(newState)) {
        console.log(`reg = ${currentState} -> ${newState}`);
        currentState = newState;
    } else {
        console.log(newState);
    }
    updateStatePrompt();
}


rl.on('line', (input) => {
    const trimmedInput = input.trim();

    switch (trimmedInput) {
        case 'exit':
             rl.close();
    server.close(() => {
        process.exit();
    });
            break;
        default:
            handleStateChange(trimmedInput);
            break;
    }
});

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(currentState);
});

server.listen(5000, () => {
    console.log('Сервер запущен на http://localhost:5000');
    updateStatePrompt();
});