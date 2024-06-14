const express = require('express');
const router = express.Router();
const { User, Follower, Message } = require('../models');
const bcrypt = require('bcrypt');
const responseLib = require('../libs/responseLib');
const { authenticateToken, signJwt } = require('../libs/authLib');
const { default: mongoose } = require('mongoose');
const {eventEmitter} = require('../server');

// Register User
router.post('/register', async (req, res) => {
    try {

        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        let apiResponse = responseLib.generate(false, 'User registered successfully', { username });
        res.status(201).send(apiResponse);
    } catch (err) {
        res.status(400).send(responseLib.error());
    }

});

// Login User
router.post('/login', async (req, res) => {

    const { redisClient } = require('../db');
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send('Invalid username or password');
    }
    const token = signJwt({ userId: user._id, username: user.username });
    redisClient.set(token, user._id.toString(), 'EX', 3600); // token expiry set to 1 hour
    res.json({ token });
});



// Logout User
router.post('/logout', authenticateToken, async (req, res) => {
    const { redisClient } = require('../db');
    const token = req.headers['authorization'].split(' ')[1];
    let deleteresponse = await redisClient.del(token);
    if (deleteresponse == 1) {
        let apiResponse = responseLib.generate(false, 'Logged out successfully', {});
        res.status(200).send(apiResponse);
    } else {
        res.status(500).send(responseLib.error('logout failed'));
    }
});

// Follow User
router.post('/follow', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.body;
        if (!mongoose.isValidObjectId(userId)) {
            res.status(400).send(responseLib.generate(true, 'invalid input', {}));
        }

        let findFollower = await Follower.findOne({ user_id: userId, follower_id: req.user.userId });
        if (findFollower) return res.status(400).send(responseLib.generate(false, 'already following', {}));
        const newFollower = new Follower({ user_id: userId, follower_id: req.user.userId });
        await newFollower.save();
        let apiResponse = responseLib.generate(false, 'User followed successfully', { userId });
        res.status(201).send(apiResponse);
    } catch (err) {
        res.status(500).send(responseLib.error('something went wrong'));
    }
});

// Send Message
router.post('/message', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        const newMessage = new Message({ user_id: req.user.userId, content });
        await newMessage.save();
        
        let getFollowers = await  Follower.find({ user_id: req.user.userId }, {__v: 0 ,  password : 0 });
        console.log(getFollowers);
        if(getFollowers) {
            eventEmitter.emit('sendNotification',{data : getFollowers});
        }
        res.status(201).send(responseLib.generate(false, 'Message sent successfully', {}));

    } catch (err) {
        res.status(500).send(responseLib.generate(true, 'Something went wrong', {}));
    }
});

// Get User Messages
router.get('/messages', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        let messages;

        if (id) {
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).send(responseLib.generate(true, 'Invalid message ID', {}));
            }
            messages = await Message.find({ user_id: id }, {
                __v: 0,
            });
            if (!messages) {
                return res.status(404).send(responseLib.generate(true, 'Message not found', {}));
            }
        } else {
            messages = await Message.find({ user_id: req.user.userId }, {
                __v: 0,
            });
        }

        res.status(200).send(responseLib.generate(false, 'Messages retrieved successfully', messages));
    } catch (err) {
        res.status(500).send(responseLib.generate(true, 'Something went wrong', {}));
    }
});


// Get Followers
router.get('/followers', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        let followers;

        if (id) {
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).send(responseLib.generate(true, 'Invalid follower ID', {}));
            }
            followers = await Follower.find({ user_id: id }, {__v: 0 ,  _id : 0 })
            .populate('follower_id', {
                __v: 0,
                password: 0
            });
            if (!followers) {
                return res.status(404).send(responseLib.generate(true, 'Follower not found', {}));
            }
            //returned _id under follower_id is user_id of follower 
        } else {
            followers = await Follower.find({ user_id: req.user.userId }, {
                __v: 0, _id :0
            }).populate('follower_id', {
                __v: 0,
                password: 0
            });
        }

        res.status(200).send(responseLib.generate(false, 'Followers retrieved successfully', followers));
    } catch (err) {
        res.status(500).send(responseLib.generate(true, 'Something went wrong', {}));
    }
});








module.exports = router;
