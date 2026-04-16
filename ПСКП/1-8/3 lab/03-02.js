const http = require('http');
const url = require('url');

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

const server = http.createServer((req, res) => {
    const RequestUrl = url.parse(req.url,true);
    if (req.method === 'GET' && RequestUrl.pathname==='/fact') {
      const k = RequestUrl.query.k; 

        if (!isNaN(k) && k >= 0)
        {
            let fact = factorial(k);
            const response = {
                k: k,
                fact: fact
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        }else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid parameter k.');
        }
    }
   
}).listen(5000);
    console.log(`Сервер запущен на http://localhost:5000/fact?k=3`);