
const { connectDb } = require('./db');
const http = require('http');
const WebSocket = require('ws');
const { wssAuth } = require('./libs/authLib');
const { User } = require('./models');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const startServer = async (app) => {
    try {
        console.log(await connectDb());
        const server = http.createServer(app);
        const wss = new WebSocket.Server({ noServer: true });
        const clients = new Map();


        // Extract the token from the query string or headers
        server.on('upgrade', async (request, socket, head) => {
            try {
                // Check if the request has the 'Authorization' header
                const authHeader = request.headers['authorization'];
                if (!authHeader) {
                    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                    socket.destroy();
                    return;
                }

                const token = authHeader.split(' ')[1];
                if (!token) {
                    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                    socket.destroy();
                    return;
                }

                const user = await wssAuth(token);

                // Accept the WebSocket connection
                wss.handleUpgrade(request, socket, head, (ws) => {
                    wss.emit('connection', ws, request, user);
                });
            } catch (err) {
                console.error(err);
                socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
                socket.destroy();
            }
        });



        wss.on('connection', async (ws, request, user) => {
            console.log(`Client ${user.username} connected`);
            const clientId = user.userId; 
            clients.set(clientId, ws);
            sendMessageToAllClients(`user -- ${user.username} -- just landed here`);
            await User.findByIdAndUpdate(user.userId, { is_online: true });
            // Handle incoming messages
            ws.on('message', (message) => {
                console.log(`Received message from ${user.username} => ${message}`);
                // Handle messages here


            });


            ws.on('close', async () => {
                console.log(`Client ${user.username} disconnected`);
                clients.delete(clientId);
                await User.findByIdAndUpdate(user.userId, { is_online: false });
            });
        });

        const sendMessageToAllClients = (message) => {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message, { binary: false });
                }
            });
        };

        // Function to send a message to a specific client by ID
        const sendMessageToClient = (clientId, message) => {
            const client = clients.get(clientId);
            if (client && client.readyState === WebSocket.OPEN) {
                client.send(message);
            } else {
                console.error(`Client ${clientId} is not connected or WebSocket is not open.`);
            }
        };
        eventEmitter.on('sendNotification', (data) => {
            sendMessageToClient(data.userId);
        });

        server.listen(3000, () => {
            console.log('Server Running on port 3000');
        });
    } catch (err) {
        console.log(err);
        console.log('SERVER WILL NOT START [Tip] check db connection');
    }
};



module.exports = {
    startServer: startServer,
    eventEmitter : eventEmitter
};