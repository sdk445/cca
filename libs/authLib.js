const jwt = require('jsonwebtoken');
const JWT_SECRET = 'thisisasecret';
const responseLib = require('./responseLib');
// Middleware to verify JWT
const authenticateToken = async (req, res, next) => {
    const { redisClient } = require('../db');
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send(responseLib.error('Access Denied'));

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).send(responseLib.error('Access Denied'));

    try {
        const user = jwt.verify(token, JWT_SECRET);
        const reply = await redisClient.get(token);
        if (!reply) return res.status(403).send(responseLib.error('Token mismatch'));
        req.user = user;
        next();
    } catch (err) {

        return res.status(403).send('Invalid Token');
    }
};


const wssAuth = async (data) => {
    try {
        const { redisClient } = require('../db');
        const user = jwt.verify(data, JWT_SECRET);
        const reply = await redisClient.get(data);
        if (!reply) throw new Error('jwt malformed');
        return user;
    } catch (err) {
        console.log(err);
    }
};
const signJwt = (data) => {
    return jwt.sign(data, JWT_SECRET);
};




module.exports = {
    authenticateToken: authenticateToken,
    signJwt: signJwt,
    wssAuth: wssAuth
};