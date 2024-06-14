
const { connectDb } = require('./db');

const startServer = async (app) => {
    try {
        console.log(await connectDb());
        app.listen(3000, () => {
            console.log('Server Running on port 3000');
        });
    } catch (err) {
        console.log(err);
        console.log('SERVER WILL NOT START [Tip] check db connection');
    }

};

module.exports = {
    startServer: startServer
};