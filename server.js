import express from 'express';
import http from 'http'; // http module to create a raw HTTP server that Socket.IO can hook into.
import {Server} from 'socket.io'; // imports the Socket.IO server class, which wil be used to handle real-time communication.

const app = express(); // intializes express app
const server = http.createServer(app); // creating a new raw server from express app. Necessary because Socket.IO needs a lower-level HTTP server to bind to.
const io = new Server(server); // creating a websocket sever using Socket.IO, binding it to the HTTP server.

// Serve Static files 
app.use(express.static('public')); // Serve anything inside the /public folder as a webpage

const nicknames = {}
// Function to generate nickname
function generateId(){
    const length = 5;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = '';
    for(let i = 0;i<length;i++){
        id += chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return id;
}

// handle websocket connections 
io.on('connection', (socket)=>{ // this runs every time a new client connects to the webSocket server.
    const ghostid = `👻${generateId()}`;
    nicknames[socket.id] = ghostid;
    console.log(`New Ghost Connected: ${ghostid}`); // a log on server to confirm user connection.

    // message logic
    socket.on('message', (msg) =>{ // waits for a message event from the user
        io.emit('message', {
            nickname: ghostid,
            text: msg
        }); // broadcast the same message to everyone connected.(including the sender).
    });

    // Typing logic 
    socket.on('typing', () =>{
        socket.broadcast.emit('user-typing', nicknames[socket.id]);
    });

    socket.on('disconnect', ()=>{ // when user closes tab or disconnects 
        delete nicknames[socket.id];
        console.log(`${ghostid} Ghost Disconnected!!`);
    });
});



server.listen(3000,() =>{
    console.log('Server running on http://localhost:3000');
});