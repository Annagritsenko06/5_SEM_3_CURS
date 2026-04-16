const nodemailer = require('nodemailer');
const http = require('http');
const { parse } = require('querystring');
const fs = require('fs');


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'angritsen@gmail.com', 
        pass: 'edqm hutg ccrj wjgn'   
    }
});

const server = http.createServer((req, res) => {

    if (req.method === 'GET') {
        fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Ошибка при загрузке страницы');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });

    } else if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const postData = parse(body);
            const { sender, receiver, subject, message } = postData;

            if (!sender || !receiver || !subject || !message) {
                res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Ошибка: все поля обязательны для заполнения!');
                return;
            }

            console.log('Попытка отправки письма:', { 
                from: sender, 
                to: receiver, 
                subject: subject 
            });

            const mailOptions = {
                from: sender,
                to: receiver,
                subject: subject,
                html: message,
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Ошибка отправки:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Ошибка при отправке письма: ' + err.message);
                } else {
                    console.log('Email успешно отправлен:', info.response);
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end('<h1>Письмо отправлено успешно!</h1>');
                }
            });
        });
    }
});

server.listen(5000, () => {
    console.log('Сервер запущен на http://localhost:5000');
});