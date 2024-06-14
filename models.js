const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Users Schema
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_online :  {type : Boolean , default : false}
});

// Followers Schema
const followerSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    follower_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

// Messages Schema
const messageSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: () => Date.now() }
});

// Models
const User = mongoose.model('User', userSchema);
const Follower = mongoose.model('Follower', followerSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { User, Follower, Message };
