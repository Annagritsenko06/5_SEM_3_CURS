const fs = require("fs");
const http = require('http');

const server = http.createServer((req, res) => {
    if(req.url === '/xmlhttprequest' && req.method === 'GET'){
        fs.readFile("xmlhttprequest.html", function(error,data){
            if(error) {
                res.writeHead(500,{'Content-Type': 'text/html; charset=utf-8'});
                res.end('server error');
            }
            
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
            res.end(data);
        });
    }
    else if(req.url === '/api/name' && req.method === 'GET'){
        res.writeHead(200,{'Content-Type': 'text/plain; charset=utf-8'});
        res.end('Gritsenko Anna Aleksandrovna');
    }
    else
    {
        res.writeHead(404,{'Content-Type': 'text/plain; charset=utf-8'});
        res.end('not found');
    }

}).listen(5000);

    console.log(`Server running at http://localhost:5000/xmlhttprequest`);
