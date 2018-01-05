const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const highscores = require('./api/highscores');


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

// API
app.use("/api/v1/highscore/", highscores);
   
http.listen(3000, function() {
	console.log('Server started: http://localhost:3000');
})


