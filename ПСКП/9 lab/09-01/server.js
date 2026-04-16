const http = require("http");

http.createServer((req, res) => {
    try {
        
      req.on('error', (error) => {
        console.error('Server request error:', error);
        res.statusCode = 400;
        res.end('Bad Request');
      });

      res.on('error', (error) => {
        console.error('Server response error:', error);
      });

      if (req.method !== 'GET') {
        res.statusCode = 405;
        return res.end('Method Not Allowed');
      }

      if (req.url !== '/') {
        res.statusCode = 404;
        return res.end('Not Found');
      }

      res.statusCode = 200;
      res.statusMessage = "all is good";
      res.end("hi!");

    } catch (error) {
      console.error('Server unhandled error:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
  .listen(5000);