
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
var io = require('socket.io').listen(server, { log: false });
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



app.get('/article/:id', function(req, res) {
	var artId = req.params.id;
	var json = _.find(existingArticles, function(e, i) { return e.id == artId; });
	if(json) res.send(article(json));
	else return res.send("nothing here");
});

app.get('/articles', function(req, res) {
	res.send(existingArticles);
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var existingArticles = [];
var webhits = [];

setInterval(function() {
	request('https://webhit.snd.no/webhit/php/getwidgetdata.php?widget=hackday2013&site=ap', 
			function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			  	webhits = JSON.parse(body).last5;
			}
		});
	
}, 5000);

io.sockets.on('connection', function(socket) {
    socket.on('preview', function(data) {
        //console.log("preview data: ");
        //console.log(data);
        socket.broadcast.emit('refresh', data);
    });
    setTimeout(function() {
		request('http://api.snd.no/apiconverter/healthyFrontPage/auto', 
			function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			  	var articles = JSON.parse(body);
			  	var content = articles.map(checkNew).map(webhit).map(waitingListArticle).join("");
			  	existingArticles = articles;
			    socket.emit("news", content);
			}
		});
	}, 1000);
	setInterval(function() {
		request('http://api.snd.no/apiconverter/healthyFrontPage/auto', 
			function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			  	var articles = JSON.parse(body);
			  	var content = articles.map(checkNew).map(webhit).map(waitingListArticle).join("");
			  	existingArticles = articles;
			    socket.emit("news", content);
			}
		});
	}, 5000);
});


	function webhit(json) {


		var wh = _.find(webhits, function(e, i) { 
			return e.url == json.url; 
		});

	
		var cloned = cloneObj(json);
		if(wh) {
			cloned.score = Math.ceil(wh.clicks / 10) * 10;;
			return cloned;
		} else {
			cloned.score = 0;
			return cloned;
		}
	}

	function checkNew(json) {
		var article = _.find(existingArticles, function(e, i){ return e.id == json.id; });
		if(!article) {
			var cloned = cloneObj(json);
			cloned.isNew = true;
			return cloned;
		}
		return json;
	}

function waitingListArticle(json) {
	return "<li class=\""+ (json.isNew ? 'new' : '') +"\" data-id=\""+json.id+"\">"+article(json)+"</li>";
}

function article(json) {
	return "<article data-id=\""+json.id+"\" class=\"article-list-container\">" + 
	img(json.image) + 
	time(json.published) + 
	p(json.title) +
	addButton() + 
	trendingButton(json.score) + 
	"</article>";
}

function addButton() {
	return "<button class=\"article-add btn btn-sm\" type=\"button\"><i class=\"glyphicon \"></i><span class=\"sr-only\">Add</span></button>";
}

function trendingButton(score) {
	return "<div class=\"progress-radial\" data-popularity=\""+score+"\"> <div class=\"overlay\">"+score+"</div> </div>";
}

function div(str) {
	return "<div>" + str + "</div>";
}

function p(str) {
	return "<p class=\"title\">" + str + "</p>";
}

function time(str) {
	return "<time>" + str + "</time>";
}

function img(str) {
	if(str) {
		return "<img  class=\"article-image\" src=\""+str+"\"/>";	
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


