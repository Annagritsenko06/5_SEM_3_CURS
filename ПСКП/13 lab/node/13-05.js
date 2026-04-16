let net = require('net');

let HOST = '0.0.0.0';
let PORT = 40000;

let connections = new Map();

let server = net.createServer();

let h = (server) => {
    return (socket) => {
        let serverInterval = null;

        console.log('Server connected:', socket.remoteAddress + ':' + socket.remotePort);

        connections.set(socket, 0);

        server.getConnections((e, c) => {
            if (!e) {
                console.log('connected:', c);
                for (let [sock, value] of connections) {
                    console.log(sock.remoteAddress + ':' + sock.remotePort, value);
                }
            }
        });

        socket.on('data', (data) => {
            let value = data.readInt32LE(0);
            console.log(`data: ${socket.remoteAddress}:${socket.remotePort} ${value}`);

            connections.set(socket, connections.get(socket) + value);

            console.log(`sum: ${connections.get(socket)}`);
        });

        let buf = Buffer.alloc(4);

        serverInterval = setInterval(() => {
            buf.writeInt32LE(connections.get(socket), 0);
            socket.write(buf);
        }, 5000);

        socket.on('error', err => {
            console.log(`ERROR: ${socket.remoteAddress}:${socket.remotePort} ${err.message}`);
            clearInterval(serverInterval);
            connections.delete(socket);
        });

        socket.on('close', () => {
            console.log(`CLOSED: ${socket.remoteAddress}:${socket.remotePort}`);
            clearInterval(serverInterval);
            connections.delete(socket);
        });
    }
}


server.on('connection', h(server));

server.on('listening', () => {console.log('TCP-сервер ', HOST, PORT);});
server.on('error', (e) => {console.log('TCP-сервер error', e);});
server.listen(PORT, HOST);