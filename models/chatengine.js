const mongoose=require('mongoose');
const ChatEngine= new mongoose.Schema({
    message:{
        type:String,
    },
    user_email:{
        type:String,
    },
    chatroom:{
        type:String,
    }

},{
    timestamps:true,
});
const Chatting=mongoose.model('Chatting',ChatEngine);
module.exports=Chatting;