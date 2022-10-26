const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

// this is going tp control multiple users
module.exports.post = function(req,res){
    res.end('<h1> User Post </h1>');
} 

module.exports.create = async function(req, res){
    try{
        // console.log(req.user, "line 9");
    let post = await Post.create({
        content: req.body.content,
        user: req.user._id,   
    });

    if(req.xhr){
        return res.status(200).json({
            data: {
                post: post
            },
            message: 'post created'
        })
    }

    req.flash('success', 'Post published');

    return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}
// creating a destroy action
module.exports.destroy = async function(req, res){
    try{
    // we will be making (/posts/destroy/id) route and destroy the id, Id is the string param
    let post = await Post.findById(req.params.id);
    // Need to check whether the user who is deleting the post is the user who has written the post
    // .id means converting the object id into string
    if(post.user == req.user.id){

        // delete the likes asoociated posts and all its comment's likes too
        await Like.deleteMany({likeable: post, onModel: 'Post'});
        await Like.deleteMany({_id: {$in: post.comments}});

        post.remove();


        await Comment.deleteMany({post: req.params.id},);

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post_id: req.params.id
                },
                message: "post deleted "
            });
        }

        req.flash('success', 'Post and associated comments deleted!');
        return res.redirect('back');
    }else{
        req.flash('error', 'You cannot delete this post');
        return res.redirect('back');
    }

    }catch(err){
         req.flash('error', err);
        return;
    }
}
