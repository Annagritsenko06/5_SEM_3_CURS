const http = require('http');
const url = require('url');
const fs = require("fs");

function factorial(n, callback) {
  if (n === 0 || n === 1) {
    process.nextTick(() => callback(1));
    return;
  }
  factorial(n - 1, (res) => {
    process.nextTick(() => callback(n * res));
  });
}

const server = http.createServer((req, res) => {

     const RequestUrl = url.parse(req.url,true);
         if (req.method === 'GET' && RequestUrl.pathname==='/fact') {
           const k = RequestUrl.query.k; 

        if (!isNaN(k) && k >= 0)
        {
           factorial(k, (result) => {
        const response = {
          k: k,
          fact: result
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      });
        }else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Invalid parameter k.');
        }
    }
    else if (req.method==='GET'){
        fs.readFile("03-03.html",(error,data) =>{
             if(error){
                res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end("Error...");}
            else{
           res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
           
            }
        })
    }
   
}).listen(5000);
    console.log(`Сервер запущен на http://localhost:5000`);

