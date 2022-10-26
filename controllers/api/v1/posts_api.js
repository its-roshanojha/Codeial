const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
module.exports.index = async function(req, res){

    let posts = await Post.find({})
        // to show the post in the reverse chronological order
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments' ,
            populate: {
                path: 'user'
            }
        })
    return res.json(200, {
        message: "List of posts",
        posts: posts
    })
}

module.exports.destroy = async function(req, res){
    try{
    // we will be making (/posts/destroy/id) route and destroy the id, Id is the string param
    let post = await Post.findById(req.params.id);
    // Need to check whether the user who is deleting the post is the user who has written the post
    // .id means converting the object id into string
    if(post.user == req.user.id){
        post.remove();


        await Comment.deleteMany({post: req.params.id},);

        
        return res.json(200, {
            message: "Post associates and comments deleted successfully!"
        });

    }else{

         return res.json(401, 
            {
                message:'you cannot delete the post'
            });  
    }
        
   

    }catch(err){
        //  req.flash('error', err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}
