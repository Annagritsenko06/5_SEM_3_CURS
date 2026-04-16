const net = require('net');

const HOST = '127.0.0.1';
const PORT = Number(process.argv[2] || 40000);
const X = Number(process.argv[3] || 1);

const client = new net.Socket();
const buf = Buffer.alloc(4);

client.connect(PORT, HOST, () => {
    console.log(`Connected to ${HOST}:${PORT}`);

    const timer = setInterval(() => {
        buf.writeInt32LE(X, 0);
        client.write(buf);
    }, 1000);

    setTimeout(() => {
        clearInterval(timer);
        client.end();
    }, 20000);
});

client.on('data', (data) => {
    console.log(`FROM SERVER: ${data.toString()}`);
});

client.on('close', () => {
    console.log('Client closed');
});

client.on('error', (err) => {
    console.log(`Client error: ${err.message}`);
});
