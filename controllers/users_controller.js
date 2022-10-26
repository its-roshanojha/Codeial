const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// export a function which is publically available to route's file that should return something
module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err, user){
        console.log(user);
        return res.render('user_profile', {
            title: 'profile',
            profile_user: user
        });

    });
}


module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){
        try {
            // find the user 
            let user = await User.findById(req.params.id);
            // when we want to access the body params in the form, we wont be able to access directly from body.params because its a multi part form, For that multer has been deployed to perform the task(models/users  uploadedAvatar and avartarPath)
            User.uploadedAvatar(req, res, function(err){
                if(err){ console.log('*****Multer Error: ', err)}
                user.name = req.body.name;
                user.email = req.body.email;

                // it will check if the user is not uploading a file then we are going to update only when the user will do it
                if(req.file){
                    if(user.avatar){
                        // delete the avatar for which we need file system and also the path module
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    // this is saving the path of the uploaded file into the avatar feild in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename
                }
                user.save();
                return res.redirect('back');
                // console.log(req.file);
            });
        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized')
         return res.status(401).send('Unauthorized');
    }
    
}

// render the sign up page
module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "codeial | Sign Up"
    })
};

// render the sign in page                         
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "codeial | Sign In"
    })
};

// get sign-up data
module.exports.create = function(req, res){
    // check whether password and confirm password matches or not
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    // if passwords are same we will see if the email ids should be unique
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}
    //when user is not found 
        if (!user){
            User.create(req.body, function(err, user){
              if(err){console.log('error in creating user  while  signing up'); return}

              return res.redirect('/users/sign-in');
            })
           
        }else{
             // user already exist so back
            return res.redirect('back');
        }
    })
}

// get sign-in data
module.exports.createSession = function(req, res){
    req.flash('success','Logged in Successfully')
    // assuming user is already signed in so we need to redirect
    return res.redirect('/');
}

module.exports.destroySession = function(req, res, next){
    // this function is automated by passport js
    req.logout(function(err){
        return next(err);
    });
    req.flash('success', 'You have logged out');
    return res.redirect('/')
}