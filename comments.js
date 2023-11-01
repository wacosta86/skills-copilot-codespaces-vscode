//Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var port = 3000;

//Create server
http.createServer(function(req, res) {
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), uri);

    //Check if file exists
    path.exists(filename, function(exists) {
        if(!exists) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not Found\n');
            res.end();
            return;
        }

        //Check if file or directory
        var stat = fs.statSync(filename);
        if(stat.isDirectory()) {
            filename += '/index.html';
        }

        //Read file
        fs.readFile(filename, 'binary', function(err, file) {
            if(err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write(err + '\n');
                res.end();
                return;
            }

            //Write file
            res.writeHead(200);
            res.write(file, 'binary');
            res.end();
        });
    });
}).listen(port);

console.log('Server running at http://localhost:' + port + '/');

//Create database
var Datastore = require('nedb');
var db = new Datastore({filename: 'comments.db', autoload: true});

//Create router
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//Get all comments
app.get('/api/comments', function(req, res) {
    db.find({}, function(err, docs) {
        res.json(docs);
    });
});

//Create new comment
app.post('/api/comments', function(req, res) {
    var newComment = {
