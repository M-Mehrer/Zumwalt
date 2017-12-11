var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var http = require('http').Server(app);
var io = require('socket.io')(http);


io.on('connection', function(socket){
	console.log('A user connected.');
});


app.use(function(req, res, next) {
	// TODO: Enable
	//res.header("Access-Control-Allow-Origin", "*");
	//res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(bodyParser.json());
app.use(serveStatic('public'));

//app.get("/api/V1/...")
   
http.listen(3000, function() {
	console.log('Server started: http://localhost:3000');
})


