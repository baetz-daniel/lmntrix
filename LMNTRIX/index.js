'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const helpers = require('./lib/helpers')(handlebars);

const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')

const pool = require('./lib/mysql');

const adminCfg = require('./configs/.admin.config.json');

const app = express();


const hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: helpers,
    partialsDir: path.join(__dirname, 'views', 'partials')
});


// view engine setup
app.engine('handlebars', hbs.engine);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
    name: 'dkpadmin',
    keys: ["sEvT4qVZiBQNGPUpHy1wODxsaYaHBgQT", "Le2J0RHlBrlJsLe44BfGudAmVHoOz6aa"],
    //      h   m    s    ms  
    maxAge: 4 * 60 * 60 * 1000  // 4h
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    req.session.userinfo = (req.session.userinfo || {
        'isAdmin': false,
    });
    req.error = {
        'invalidlogin': false
    };

    if (!req.session.userinfo.isAdmin) {
        if ('username' in req.body && 'password' in req.body) {
            for (let admin of adminCfg.admins) {
                if (admin.username == req.body.username && admin.password == req.body.password) {
                    req.session.userinfo.isAdmin = true;
                    req.session.userinfo.name = admin.username;
                    break;
                }
            }
            if (!req.session.userinfo.isAdmin) {
                req.error.invalidlogin = true;
            }
        }
    }

    next();
});

function register(path, router) {
    app.use(path, require('./routes/' + router));
}

register('/', 'index');
register('/admin', 'admin');

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            'showLogin': true,
            message: err.message,
            error: err
        });
    });
}
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        'showLogin': true,
        message: err.message,
        error: {}
    });
});


app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});

process.on('unhandledRejection', function (err) {
    console.error(err.stack)
})
process.on('uncaughtException', function (err) {
    console.error(err.stack)
});

let _disposed = false;
process.on('cleanup', function () {
    if (!_disposed) {
        _disposed = true;
        pool.end(function (err) {
            server.close(function () {
                console.log('server close...');
                process.exit(0);
            });
        });
    }
});

process.on('exit', function (code) {
    console.log(`About to exit with code: ${code}`);
});
process.on('SIGINT', function () {
    if (!_disposed) {
        process.emit('cleanup');
    }
});
process.on('SIGTERM', function () {
    if (!_disposed) {
        process.emit('cleanup');
    }
});
process.on('SIGHUP', function () {
    if (!_disposed) {
        process.emit('cleanup');
    }
});

process.stdin.resume();