const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const WebSocket = require('ws');

const STUDENT_LIST = 'StudentList.json';
const BACKUP_DIR = 'backups';

let server = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true);
    let method = req.method;

    if (method === 'GET' && parsedUrl.pathname === '/') {
        if (!fs.existsSync(STUDENT_LIST)) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 1, message: 'ошибка чтения файла StudentList.json' }));
            return;
        }
        let data = fs.readFileSync(STUDENT_LIST);
        let students = JSON.parse(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(students));
    }
    else if (method === 'GET' && /^\/\d+$/.test(parsedUrl.pathname)) {
        let id = parseInt(parsedUrl.pathname.split('/')[1]);
        if (!fs.existsSync(STUDENT_LIST)) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 1, message: 'ошибка чтения файла StudentList.json' }));
            return;
        }
        let data = fs.readFileSync(STUDENT_LIST);
        let students = JSON.parse(data);
        let student = students.find(s => s.id === id);
        if (student) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(student));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 2, message: `студент с id ${id} не найден` }));
        }
    }
    else if (method === 'POST' && parsedUrl.pathname === '/') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            let newStudent;
            try {
                newStudent = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 2, message: 'Недопустимый JSON' }));
                return;
            }
            
            if (!fs.existsSync(STUDENT_LIST)) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 1, message: 'ошибка чтения файла StudentList.json' }));
                return;
            }
            let data = fs.readFileSync(STUDENT_LIST);
            let students = JSON.parse(data);
            
            if (students.some(s => s.id === newStudent.id)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 4, message: `Студент с id ${newStudent.id} уже существует` }));
            } else {
                students.push(newStudent);
                fs.writeFileSync(STUDENT_LIST, JSON.stringify(students, null, 4));
                notifyAll();
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newStudent));
            }
        });
    }
    else if (method === 'PUT' && parsedUrl.pathname === '/') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            let updatedStudent;
            try {
                updatedStudent = JSON.parse(body);
            } catch (e) { 
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 2, message: 'Недопустимый JSON' }));
                return;
            }
            
            if (!fs.existsSync(STUDENT_LIST)) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 1, message: 'ошибка чтения файла StudentList.json' }));
                return;
            }
            let data = fs.readFileSync(STUDENT_LIST);
            let students = JSON.parse(data);
            
            let index = students.findIndex(s => s.id === updatedStudent.id);
            if (index !== -1) {
                students[index] = updatedStudent;
                fs.writeFileSync(STUDENT_LIST, JSON.stringify(students, null, 4));
                notifyAll();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedStudent));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 2, message: `студент с id ${updatedStudent.id} не найден` }));
            }
        });
    }
    else if (method === 'DELETE' && /^\/\d+$/.test(parsedUrl.pathname)) {
        let id = parseInt(parsedUrl.pathname.split('/')[1]);
        if (!fs.existsSync(STUDENT_LIST)) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 1, message: 'ошибка чтения файла StudentList.json' }));
            return;
        }
        let data = fs.readFileSync(STUDENT_LIST);
        let students = JSON.parse(data);
        let index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            let deletedStudent = students.splice(index, 1)[0];
            fs.writeFileSync(STUDENT_LIST, JSON.stringify(students, null, 4));
            notifyAll();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deletedStudent));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 2, message: `студент с id ${id} не найден` }));
        }
    }
    else if (method === 'POST' && parsedUrl.pathname === '/backup') {
        setTimeout(() => {
            let timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
            let backupFile = path.join(BACKUP_DIR, `${timestamp}_StudentList.json`);
            if (!fs.existsSync(BACKUP_DIR)) {
                fs.mkdirSync(BACKUP_DIR);
            }
            fs.copyFileSync(STUDENT_LIST, backupFile);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Backup created', backup_file: backupFile }));
        }, 2000);
    }
    else if (method === 'DELETE' && /^\/backup\/\d{8}$/.test(parsedUrl.pathname)) {
        let dateStr = parsedUrl.pathname.split('/')[2];
        let cutoffDate = new Date(
            parseInt(dateStr.slice(0, 4)),
            parseInt(dateStr.slice(4, 6)) - 1,
            parseInt(dateStr.slice(6, 8))
        );
        fs.readdir(BACKUP_DIR, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 1, message: 'ошибка чтения директории backups' }));
                return;
            }
            files.forEach(file => {
                let filePath = path.join(BACKUP_DIR, file);
                let fileStats = fs.statSync(filePath);
                if (fileStats.mtime < cutoffDate) {
                    fs.unlinkSync(filePath);
                }
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'устаревшие бэкапы были удалены' }));
        });
    }
    else if (method === 'GET' && parsedUrl.pathname === '/backup') {
        fs.readdir(BACKUP_DIR, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 1, message: 'ошибка чтения директории backups' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(files));
            }
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 4, message: 'Недопустимая точка запроса' }));
    }
});

let wss = new WebSocket.Server({ server });

function notifyAll() {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message: 'StudentList.json был обновлён' }));
        }
    });
}

wss.on('connection', (ws) => {
    console.log('подключен новый клиент');
    ws.on('close', () => {
        console.log('клиент отключился');
    });
});

server.listen(5000, () => {
    console.log("http://localhost:5000");
});
