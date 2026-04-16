const udp = require('dgram');
const HOST = 'localhost';
const PORT = 40000;
let client = udp.createSocket('udp4');


let message = 'Client message\0';

client.on('message', msg => {
    console.log(`${msg.toString()}`);
    client.close();
});

client.send(message, PORT, HOST, error => {
    if (error) {
        console.error(error.message);
        client.close();
    }
    else {
        console.log('Сообщение отправлено серверу.');
    }
});

client.on('error', error => {
    console.error(error.message);
    client.close();
});

client.on('close', () => { console.log('Closed'); });