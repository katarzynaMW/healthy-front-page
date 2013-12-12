
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var request = require('request');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/sockets', function(req, res) {
	res.render('socket', { title: 'Express WebSockets' });
});

app.get('/articles',function(req, res) {
    res.render('articles', { title: 'Front page articles' });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



var existingArticles = [];

io.sockets.on('connection', function(socket) {
	setInterval(function() {
		request('http://api.snd.no/apiconverter/healthyFrontPage/auto', 
			function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			  	var content = JSON.parse(body).map(waitingListArticle).join("")
			    socket.emit("news", "<ul>" + content + "</ul>");
			}
		})
	}, 10000);
});

function waitingListArticle(json) {
	return "<li>" + json.title + "</li>";
}


