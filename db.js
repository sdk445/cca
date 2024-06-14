const mongoose = require('mongoose');

const dbConfig = require('./dbConfig.json');
const redis = require('redis');


const redisClient = redis.createClient(6379);
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

let connectDb = async () => {
    try {
        await mongoose.connect(dbConfig.mongoUri);
        await redisClient.connect();
        module.exports = {redisClient};
        return 'MONGODB AND REDIS CONNECTED';
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};


module.exports = {
    connectDb: connectDb
};


