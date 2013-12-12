
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var _ = require('underscore');
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

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var existingArticles = [];

io.sockets.on('connection', function(socket) {
	setInterval(function() {
		request('http://api.snd.no/apiconverter/healthyFrontPage/auto', 
			function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			  	var articles = JSON.parse(body);
			  	var content = articles.map(checkNew).map(waitingListArticle).join("");
			  	existingArticles = articles;
			    socket.emit("news", "<ul>" + content + "</ul>");
			}
		})
	}, 10000);
});

	function checkNew(json) {
		var article = _.find(existingArticles, function(e, i){ return e.id == json.id; })
		if(!article) {
			var cloned = cloneObj(json);
			cloned.isNew = true;
			return cloned;
		}
		return json;
	}

function waitingListArticle(json) {
	return "<li class=\""+ (json.isNew ? 'new' : '') +"\" data-id=\""+json.id+"\">" + 
	img(json.image) + 
	div(json.published) + 
	div(json.title)  +"</li>";
}

function div(str) {
	return "<div>" + str + "</div>";
}

function img(str) {
	if(str) {
		return "<img src=\""+str+"\"/>";	
	} else {
		return "";
	}
}

function cloneObj(obj) {
    var clone = {};

    for (var i in obj) {
        if (obj[i] && typeof obj[i] == 'object') {
            clone[i] = cloneObj(obj[i]);
        } else {
            clone[i] = obj[i];
        }
    }
    return clone;
}


