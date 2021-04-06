const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const parseurl = require('parseurl')
const session = require('express-session')
const { v4: uuidv4 } = require('uuid');

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const express_server = express();
// view engine setup
express_server.set('views', path.join(__dirname, 'views'));
express_server.set('view engine', 'pug');

express_server.use(logger('dev'));
express_server.use(express.json());
express_server.use(express.urlencoded({ extended: false }));
express_server.use(cookieParser());
express_server.use(express.static(path.join(__dirname, 'public')));
//**********************************************************************************************************************
//add session middleware
express_server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    genid: function(req) {
        // use UUIDs for session IDs
        return uuidv4();
    },
    name: "__SESSION_NJS_ID__FAMILY_TOGETHER_"
}));

//**********************************************************************************************************************
// add routes here
// express_server.use('/', indexRouter);
// express_server.use('/users', usersRouter);
//**********************************************************************************************************************

//**********************************************************************************************************************

module.exports = express_server;
