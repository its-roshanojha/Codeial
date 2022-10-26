 const express = require('express');
 const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const port = 8000;
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal =require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
// since we need a session information to store that is why session argument is used
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
// connecting SASS
const sassMiddleware = require('node-sass-middleware');
// setup connect-flash
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');


// setup the chat server to be used with socket.io
// Import HTTP with the server for the app(which is the express app) 
const chatServer = require('http').Server(app);
// Import chat_sockets
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log ('chat server is listening on port 5000')


app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    // where should my server look out for css file
    prefix: '/css'
}));
// reading through the post request
app.use(express.urlencoded());

// setting up the cookie parser
app.use(cookieParser());

app.use(express.static('./assets'));
// directory of index joined with uploads which means codeial/uploads will be available in this path to th browser
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// Set the template engine ejs
app.set('view engine','ejs');
// set the view directory
app.set('views', path.join(__dirname,'views'));

// Create a session
// mongo store is used to store the session cookie in db
app.use(session ({
    // name of my cookie is codeial
    name: 'codeial',
    // (whenever encryption happens there is a key to encode and decode so to encode it we will use a key secret)
    // Todo change the secret before deployment in poduction mode
    secret: 'blahhhsomething',
    // the user has not logged in, identity is not established, in that case do we need to add extra data to store in session cookies so we set it to false(if no)
    saveUninitialized: false,
    // if already a user_id is stored in the cookie we dont need to save again and again
    resave: false,
    // we need to give an age to the cookie, for how long should this be valid after that the session i.e. the cookie expires
    cookie: {
        maxAge: (1000* 60* 100)
    },
    // used to store the session cookie info into the db even if the server restarts the info doesnot get lost
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/codeial_development',
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )

}));
// to tell the app to use passport
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// we need to use it after the sesson cookie since express session middleware is being used, Flash messages will be setup the cookies which stores the session information
app.use(flash());
app.use(customMiddleware.setFlash);

// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        // console.log('Error: ',err);
        console.log(`Error :  ${err}`)
    }

    console.log(`Server is running on port: ${port}`);

})