// browser-side js


const socket = io(); // connects to the socket.IO server (running at same domain & port)

// grabs references to DOM elements - where messages will show and  input will be taken from.
const message = document.getElementById('messages'); 
const input = document.getElementById('msgInput');

// when user clicks "Send", this function will be invoked:
function sendMessage(){
    const msg = input.value.trim(); // read the input and remove the  extra whitespace
    if(msg){
        socket.emit('message', msg); // sends the message(msg) as data to server via WebSocket(emit 'message' event)
        input.value = ''; // clear the input box after sending
    }
}

//socket.on(...) doesn't run on "new message on the server" in general — it runs when the server emits a 'message' event to this client.
socket.on('message', (msg)=>{ // this callback runs whenever a 'message' event is received from the server
    const li = document.createElement('li'); // create a <li> element for the message
    li.textContent= msg; // set the text content of <li>  to the received message
    messages.appendChild(li); // append the new <li> to the <ul id = 'messages'> element in the DOM 
});