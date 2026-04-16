const nodemailer = require('nodemailer');

const EMAIL = 'angritsen@gmail.com';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: EMAIL,
        pass: 'edqm hutg ccrj wjgn'
    }
});


function send(message) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: EMAIL,
            to: EMAIL,
            subject: 'Сообщение от gritsenkomoduleLab6',
            html: `<p>${message}</p>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Ошибка отправки письма:', err);
                reject(err);
            } else {
                console.log('Письмо отправлено:', info.response);
                resolve(info);
            }
        });
    });
}

module.exports = { send, transporter };