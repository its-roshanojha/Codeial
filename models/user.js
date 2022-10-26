const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
},{
    // timestamp is created at and updated at
    timestamps: true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });
//   static functions(In OOPS static functions are the once that can be called overall on the whole class)
userSchema.statics.uploadedAvatar = multer({
  // single means only one instance or only one file will be send to avatar not multiple files
  storage: storage}).single('avatar');

userSchema.statics.avatarPath = AVATAR_PATH;
  
const upload = multer({ storage: storage });
  

const User = mongoose.model('User', userSchema);

module.exports = User;