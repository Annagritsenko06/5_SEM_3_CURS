const http = require('http');
const url = require('url');
const fs = require('fs');
const data = require('./DB');
const db = new data.DB();

db.on('GET', (req, res) => {
    console.log('DB.GET');
    res.end(JSON.stringify(db.select()));
});
db.on('POST', (req, res) => {
    console.log('DB.POST');
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        const parsedData = JSON.parse(data);
        const result = db.insert(parsedData);
        if (result.error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: result.error }));
        } else {
            res.end(JSON.stringify(result));
        }
    });
});

db.on('PUT', (req, res) => {
    console.log('DB.PUT');
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        const parsedData = JSON.parse(data);
        const result = db.update(parsedData);
        if (result.error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: result.error }));
        } else {
            res.end(JSON.stringify(result));
        }
    });
});

db.on('DELETE', (req, res) => {
    console.log('DB.DELETE');
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        const parsedData = JSON.parse(data);
        const result = db.delete(parsedData.id);
        if (result.error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: result.error }));
        } else {
            res.end(JSON.stringify(result));
        }
    });
});
http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url);
    if (parsedUrl.pathname === '/api/db') {
        db.emit(request.method, request, response);
    } else if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Server error');
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
            }
        });
    } else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Not Found');
    }
}).listen(5000);
    console.log(`Server running at http://localhost:5000`);
