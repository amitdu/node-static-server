const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = 3000;

const express = require('express')
const app = express();
const mimeTypeMap = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
};

app.get('*', (req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = `.${parsedUrl.pathname}`;
    let ext = path.parse(pathname).ext;
    console.log(pathname, ext);
    pathname = pathname.replace('/en', '');
    if (pathname == './') {
        pathname = './index.html'
        ext = '.html';
    } else if (pathname.endsWith('/')) {
        pathname += './index.html'
        ext = '.html';
    } else if (!ext) {
        pathname += '.html';
        ext = '.html';
    }
    const filePath = path.join('www.game.tv', pathname);
    fs.exists(filePath, (exist) => {
        if (!exist) {
            res.statusCode = 404;
            res.setHeader('Content-type', 'text/html');
            var notFoundPage = fs.readFileSync('www.game.tv/404.html');
            res.end(notFoundPage);
            return;
        }
        // read file from file system
        fs.readFile(filePath, function (err, data) {
            if (err) {
                res.statusCode = 404;
                res.setHeader('Content-type', 'text/html');
                var notFoundPage = fs.readFileSync('www.game.tv/404.html');
                res.end(notFoundPage);
            } else {
                res.setHeader('Content-type', mimeTypeMap[ext] || 'text/plain');
                res.end(data);
            }
        });
    });


});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

