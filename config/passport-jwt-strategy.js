const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

// defining key for encryption or decryption
let opts = {
    // header is a list of keys, header has key called authorisation that is also a list of keys called Bearer that bearer has a key called token.
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial'
}

// the function reads data from JWT payload 
passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
  // find the user based on the payload
    User.findById(jwtPayLoad._id, function(err, user){
        if (err){console.log('Error in finding user from JWT'); return;}

        if (user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    })

}));

module.exports = passport;
