const passport = require('passport');
const User = require('../models/user');

// telling passport to use local strategy
const LocalStrategy = require('passport-local').Strategy;

// create authentication function (we need passport to use this local strategy)
passport.use(new LocalStrategy({
    usernameField: 'email',
    // this basically allows us to the first arg as request, so that  if the user is not found instead of showing error in the console we can use our custom middleware to flash our message
    passReqToCallback: true
},
// whenever this local strategy is being called the email and the password will be passed on and a done function will be passed on done is call back function which is reporting to passport.js
function(req, email, password, done){
    // find a user and establish the identity
    User.findOne({email: email}, function(err, user){
        if(err){
            req.flash('error', err);
            // console.log('Error in finding user --> Passport');
            return done('err');
        }

        if(!user || user.password != password){
            req.flash('error', 'Invalid Username/Password');
            // console.log('Invalid Username/Password');
            // there is no error but user is not found since the authentication is not done so false
            return done(null, false);
        }
        // user found
        return done(null, user);
   });
}

));

//  Serializing the user to declare which key is to be kept in the cookies(which property to be sent to the cookie)
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// Deserializing the user from the key in the cookies(picking out id from the session cookie)

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done('err');
        }

        return done(null, user);    
    });
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // this detects whether the user is signed in or not
    // if the user is signed in then pass on the req to the next function(controller's action)
    if(req.isAuthenticated()){
        // if the user is authenticated just return to the next function that is going to be called in line otherwise take it to the sign-in page
        return next();
    }
    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

// to access the authenticated user
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // whenever a user is signed in that user's info is available in req.user
        // req.user contains the current signed in user from the session cookie and we are just sending it to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;