const Comment= require('../models/comment');
const Post= require('../models/post');
const { post } = require('../routes/comments');
const commentsMailer= require('../mailers/comments_mailer');
//changes done for code Activity Solution
// const Like= require('../models/like');
const User = require('../models/user');
// const queue=require('../config/kue');
// const commentEmailWorker= require('../workers/comment_email_worker');
// module.exports.create= function(req,res){
//     Post.findById(req.body.post,function(err,post){
//         if(post){
//             Comment.create({ 
//                 content:req.body.content,
//                 post:req.body.post,
//                 user:req.user._id,
//             },function(err,comment){
//                 //handle error
//                 post.comments.push(comment);
//                 post.save();
//                 return res.redirect('/');
//             })
//         }
//     });   
// }
//using async await
module.exports.create=async function(req,res){
    try{
        let post=await Post.findById(req.body.post);
        post=await post.populate([{path:'comments'},]);
        

        
    if(post){
        let comment=await Comment.create({ 
            content:req.body.content,
            user:req.user._id,
            post:req.body.post,
            
        });
        comment= await comment.populate([{path: 'user'}]);
        post.comments.push(comment);
        post.save();
        
        // comment = await comment.populate('user', 'name email').execPopulate();
        commentsMailer.newComment(comment);
        // let job=queue.create('emails',comment).save(function(err){
        //     if(err){console.log('Error in creating a queue',job.id);
        //     return;}
        //     console.log('Job enqueued',job.id);
        // });
        
        if(req.xhr){
            return res.status(200).json({
                data:{
                    comment:comment
                },
                message:'comment created',
            });
        }
        
        return res.redirect('/');
    }   
    }catch(err){
        console.log('Error',err);
        return;
    }
    
}
module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});


            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}