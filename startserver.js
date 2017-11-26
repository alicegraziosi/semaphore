//
// EXPRESS JS SERVER 
//

// module for working with file uploads
var formidable = require('formidable');

// we need the fs module for moving the uploaded files
var fs = require('fs');
// var fs = require('fs-extra');

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var util = require('util');
var app = express();

// CORS is a node.js package for providing a Connect/Express middleware that
// can be used to enable CORS with various options.
var cors = require('cors');
app.use(cors());

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'app')));

// ROUTES FOR OUR API
var router = express.Router();  // get an instance of the express Router
app.use('/', router);

// Upload route.
app.post('/fileUpload',function(req, res){
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file = files.file;
        var tempPath = file.path;
        var targetPath = path.resolve('./app/images/' + file.name);
        fs.rename(tempPath, targetPath, function (err) {
            if (err) {
                throw err
            }
            return res.json({path: file.name})
        })
    });

});


// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/index.html'));
});

//Set Port
const port = process.env.PORT || '4000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));