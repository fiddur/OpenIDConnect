
/**
 * Module dependencies.
 */


var crypto = require('crypto'),
    express = require('express'),
    expressSession = require('express-session'),
    http = require('http'),
    path = require('path'),
    querystring = require('querystring'),
    rs = require('connect-redis')(expressSession),
    extend = require('extend'),
    test = {
        status: 'new'
    },
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override');
