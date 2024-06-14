/**
 * @author Chinmoy Das
 * @dateCreated jun 14 2024
 */

const express = require('express');
const app = express();
const { startServer } = require('./server');
const route = require('./router/router');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

app.use(express.json());
app.use('/api', route);

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
//start server

startServer(app);



