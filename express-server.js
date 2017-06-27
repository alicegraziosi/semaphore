/*

Express is a minimal and flexible Node.js web application framework that provides a robust set of features
to develop web and mobile applications.

- Allows to set up middlewares to respond to HTTP Requests.
- Defines a routing table which is used to perform different actions based on HTTP Method and URL.

Note:
body-parser − This is a node.js middleware for handling JSON, Raw, Text and URL encoded form data. */


// packages we need
var express    = require('express');  // call express
var app        = express();  // define our app using express
var bodyParser = require('body-parser');  // middleware for handling JSON, Raw, Text and URL encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var http = require('follow-redirects').http;  // follow-redirects npm package 
var https = require('follow-redirects').https;
var fs = require('fs');
var path = require('path');

var port = process.env.NODE_PORT || 8080;  // set our port, 9092
var host = process.env.NODE_HOST || '127.0.0.1';  // set our port, 130.136.131.42

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:8000'
}

app.use(cors(corsOptions));


// ROUTES FOR OUR API
var router = express.Router();  // get an instance of the express Router

// api/label?label=
// http://localhost:8080/api/label?label=http://xmlns.com/foaf/0.1/
router.get('/label', function(request, response) {
    //res.json({ message: 'hooray! welcome to our api!' });
    var prefix = "";
    // request.params only gets the route parameters, not the query string parameters.
    // console.log("request.params.uri: " + request.params.uri);

    // request.query.id get query string parameters
    console.log("\nuri to prefix: "+request.query.label);

    // prima nested http call
    http.get('http://prefix.cc/?q='+request.query.label, 
	  function (res) {

	  	// url al quale si viene ridirezionati 
	  	// http://prefix.cc/foaf
	    console.log("url redirected to: "+res.responseUrl);
	    
	    // seconda nested http call
	    // http://prefix.cc/foaf.file.json
	    http.get(res.responseUrl+".file.json",
	      function (res) {
	      	// if http://prefix.cc/foaf.file.json
	      	if (res.statusCode < 200 || res.statusCode > 299) {
		        console.log("Error, statusCode: ", res.statusCode); // <======= Here's the status code
		    }
		    else {
		    	// if http://prefix.cc/foaf.file.json
		        res.on("data", function(chunk) {
		            const parsedData = JSON.parse(chunk);
	                prefix = Object.keys(parsedData)[0];
		            console.log("prefix: "+prefix);
					
		            response.write(chunk);
		            response.end();

		            /*
					Restituisce:

		            {  
					    "foaf":"http://xmlns.com/foaf/0.1/"
					}
					*/
		        });
		    }

	    }).on('error', function(e) {
		    console.error(e);
		});

	});
});

// Route that receives a POST request to /savetofile
router.post('/savetofile', function(request, response) {
    filename = 'rdfGraphData.json';
    response.send(filename);
	fs.writeFile('rdfGraphData.json', JSON.stringify(request.body), function (err, data) {
	  if (err) {
	    return console.log(err);
	  }
	});
    

});

// Return the generated file for download
router.get("/download", function (req, res) {
    var filename = req.query.filename;
    var path = __dirname + "/" + filename;
    console.log("file richiesto : " + filename + "...");
    res.download(path, filename, function(err){
	  if (err) {
	    console.log("...errore :(");
	  } else {
	    // decrement a download credit, etc.
	    console.log("...file richiesto : " + filename + " in download!");
	  }
	});
});

// more routes for our API will happen here
// Express application uses a callback function whose parameters are 
// request and response objects.

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// The static service directory is in '/public'
app.use('/public', express.static('/public'));  
app.use(express.static('/public')); 


// START THE SERVER
// =============================================================================

var server = app.listen(port, host);
console.log('Express.js server listening on: '+host+":"+port);


/*

run server in windows: 

set NODE_PORT=8080
set NODE_HOST=127.0.0.1
node express-server.js

set NODE_PORT=9092
set NODE_HOST=130.136.131.42
node express-server.js

run server in linux:

NODE_PORT=9092 NODE_HOST=130.136.131.42 node express-server.js

*/