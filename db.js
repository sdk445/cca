const mongoose = require('mongoose');
const dbConfig = require('./dbConfig.json');


let connectDb = () => {
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-unused-vars
        mongoose.connect(dbConfig.mongoUri).then(_e => {
            resolve('MONGODB CONNECTED');
        }).catch(error => {
            console.log(error);
            reject(error);

        });
    });
};


module.exports = {
    connectDb: connectDb
};


