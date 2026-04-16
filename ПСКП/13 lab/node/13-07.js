const net = require('net');

const HOST = '127.0.0.1';
const PORTS = [40000, 50000];

function onConnection(socket) {
    console.log(`CONNECTED: ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data', (data) => {
        const value = data.readInt32LE(0);
        console.log(`DATA from ${socket.remotePort}: ${value}`);

        socket.write(`ECHO: ${value}`);
    });

    socket.on('close', () => {
        console.log(`CLOSED: ${socket.remoteAddress}:${socket.remotePort}`);
    });

    socket.on('error', (err) => {
        console.log(`ERROR: ${err.message}`);
    });
}

PORTS.forEach(port => {
    const server = net.createServer(onConnection);
    server.listen(port, HOST, () => {
        console.log(`Server listening on ${HOST}:${port}`);
    });
});
