var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var handlebars    = require('express-handlebars');
var responseTime  = require('response-time');

// routes entry
var index         = require('./routes/index');
var events        = require('./routes/events');
var erase         = require('./routes/erase');
var actors        = require('./routes/actors');

// bootstrap application
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', handlebars('main'));
app.set('view engine', 'handlebars');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(function (req, res, next) {
	res.setHeader('Accept', 'application/json');
	res.setHeader('Accept', 'application/x-www-form-urlencoded');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	next()
});

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

// use response-time as a middleware
app.use(responseTime());

app.use('/', index);
app.use('/events', events);
app.use('/erase', erase);
app.use('/actors', actors);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	if(err.status == 404){
		res.status(err.status);
		res.status(err.status).json({status: "error", message: "Endpoint not found!"});
	}

	// render the error message
	res.status(err.status || 500);
	res.status(err.status).json({status: "error", message: "Internal server error!"});
});

module.exports = app;
