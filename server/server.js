/* eslint no-console: "off" */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const highscores = require('./api/highscores');
const env = require('./config.json');
const socketManager = require('./socketManager');


// Socket.io event handlers
io.on('connection', (socket) => {
	socketManager(socket);
});

// Middlewares
app.use(function(req, res, next) { // Set cors header
	if(!env.DEBUG) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	}
	next();
});
app.use(bodyParser.json());
app.use(serveStatic('public'));

// Highscore API
app.use("/api/v1/highscore/", highscores);

// Error handling (404)
app.get("/*", (req, res) => {
	res.status(404).sendFile(__dirname + '/public/error.html');
});

// Start Server
http.listen(env.PORT, env.HOST, function() {
	console.log('Server started: http://' + env.HOST + ':' + env.PORT);
});
