const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId
    },
    // this define the object id iof the liked obeject 
    likeable: {
        type: mongoose.Schema.ObjectId,
        require: true,
        // refPath means we are going to refer some other feild or path that feild will define on which type of object the the like has been  placed
        refPath : 'onModel'
    },
    // this field is used for defining the type of liked object since this is a dynamic referece
    onModel: {
        type: String,
        require: true,
        // it tells that value of onModel in each like can post or comment
        enum: ['Post', 'Comment']
    }
},{
    timestamps: true
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;