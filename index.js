var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


var Dataporten = require('passport-dataporten');

var app = express();

var morgan = require('morgan')
var mustacheExpress = require('mustache-express');

var basicauth = require('./lib/basicauth').basicauth;


var config = {
	clientID: "0247e949-b587-47f0-a69b-989c95a2e6b4",
	clientSecret: "f3b22c21-6d4d-44d0-9f1b-9fdf08db3baa",
	callbackURL: 'http://127.0.0.1:3000/auth/dataporten/callback'
};
var dpsetup = new Dataporten.Setup(config);



app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/templates')


// Use public
app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}));

app.use(morgan('combined'))

app.use(dpsetup.passport.initialize());
app.use(dpsetup.passport.session());









var aclnone = (new Dataporten.Authz())
	.allowUsers(['_9f70f418-3a75-4617-8375-883ab6c2b0af', 'solberg'])
	.allowGroups(['fc:org:uninett.no:unit:AVD-U20'])
	.middleware()
	
app.use('/protected/', basicauth);
app.use('/protected/', aclnone);


app.get('/protected/one', function (req, res) {
	res.send('Yay!');
});

app.get('/protected/two', function (req, res) {
	res.send('Yay!');
});


dpsetup.setupAuthenticate(app, '/login');
dpsetup.setupLogout(app, '/logout');

dpsetup.setupCallback(app);


app.get('/', function (req, res) {
	if (!req.session.foo) {
		req.session.foo = 0;
	}
	req.session.counter++;

	var view = {
		"title": "Dataporten demo"
	};
	if (req.user) {
		view.user = req.user;
		view.groups = req.user.getGroups();
	}
	console.log("View", view);

	res.render('index', view);
	// res.send('Hello World! <pre>' + JSON.stringify(view, undefined, 2) + '</pre>');
	// console.log(req);
});

app.get('/auth/', function (req, res) {
	res.redirect('/');
});


// app.get('*', function(req, res){
//   res.send('404 not found', 404);
// });

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});