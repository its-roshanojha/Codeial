const passport = require('passport');
const { Strategy } = require('passport-local');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const { use } = require('passport');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: '793413041753-pce1u1n8p9crlcf1ftrk267nou1dn02n.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:8000/users/auth/google/callback',
},
    function(accessToken, refreshToken, profile, done){
        // find the user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){console.log('error in google strategy-passport', err); return;}

            console.log(profile);
            // if found set this user as req.user
            if(user){
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){console.log('error in creating user google strategy-password', err); return;}

                    return done(null, user)
                });
            }
        });
    }


));

module.exports = passport;
