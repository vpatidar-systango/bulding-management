/** 
 * Common Requirements
*/
require('dotenv').config()
var express = require('express');
var path = require('path');
var fs = require('fs');
var https = require('https');
var flash = require('express-flash');
var mongoose = require('mongoose');
var passport = require('passport');
var exphbs = require('express-handlebars');
/** 
 * Middleware Requirement 
*/
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var FacebookStrategy = require('passport-facebook').Strategy;
var cors = require('cors');
/** 
 * Router file Importing in the Server File
*/
var users = require('./router/user');// user Router File
var forgotpassword = require('./router/forgotpassword');// forgotPassword Router File
var socialLogin = require('./router/socialLogin');// social Router File
var admin = require('./router/admin');// Admin Router File
var superadmin = require('./router/superadmin');// SuperAdmin Router File
/** 
 * Some Other like Controller(which contains passport Strategy)
 * database config file
 * helper function file
*/
var controller = require('./controller/Auth');// Controller FIle
var config = require('./config/dbconfig');// Db Configuration file
var helpers = require('./helpers');
/**
 * Providing connection to the mongo Server
 */
var MongoStore = require('connect-mongo')(session);
/**
 *  Open SSl Private Key && certificate Key Providing
 */
const options = {
    key: fs.readFileSync("C:/Users/hp/server.key"),
    cert: fs.readFileSync("C:/Users/hp/server.crt"),
    passphrase: "arpit",
    requestCert: false,
    rejectUnauthorized: false
};
/** 
 * this app Object call express constructer  
*/
var app = express();
/**
 * set Up view directory to public folder
 * Template Engine as a hbs
 */
app.engine("hbs", exphbs({
    // defaultLayout: "signup",
    helpers: {
        checkStatus: helpers.checkStatus,
    }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '/public/')));//join css/js path to public folder

/**
 * user body parser in a Middleware
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//-----------Swagger code-------------
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', users);

/**
 * set Up cookie Parser And Session 
 */
app.use(cookieParser());
app.use(session({
    secret: 'mysecretsessionkey',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(flash());

app.use(passport.initialize());//parsport Initialization 
app.use(passport.session());//getting session in passport
app.use(flash());

/**
 * Providding ROuter files to the Server
 */
app.use(users);
app.use(forgotpassword);
app.use(socialLogin);
app.use(admin);
app.use(superadmin);
/**
 * Creating  https Server 
 * and Listen It on 3000 port No
 */
https.createServer(options, app).listen(3000);
