import express from 'express';
import http from 'http'; // http module to create a raw HTTP server that Socket.IO can hook into.
import {Server} from 'socket.io'; // imports the Socket.IO server class, which wil be used to handle real-time communication.

const app = express(); // intializes express app
const server = http.createServer(app); // creating a new raw server from express app. Necessary because Socket.IO needs a lower-level HTTP server to bind to.
const io = new Server(server); // creating a websocket sever using Socket.IO, binding it to the HTTP server.

// Serve Static files 
app.use(express.static('public')); // Serve anything inside the /public folder as a webpage

// handle websocket connections 
io.on('connection', (socket)=>{ // this runs every time a new client connects to the webSocket server.
    console.log('new user Connected'); // a log on server to confirm user connection.
    socket.on('message', (msg) =>{ // waits for a message event from the user
        io.emit('message', msg); // broadcast the same message to everyone connected.(including the sender).
    });

    socket.on('disconnect', ()=>{ // when user closes tab or disconnects 
        console.log('User disconnected');
    })
});

server.listen(3000,() =>{
    console.log('Server running on http://localhost:3000');
});