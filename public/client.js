// browser-side js
const socket = io(); // connects to the socket.IO server (running at same domain & port)

// grabs references to DOM elements - where messages will show and  input will be taken from.
const message = document.getElementById('messages'); 
const input = document.getElementById('msgInput');
const typingIndicator = document.getElementById('typing-indicator');
let typingTimeout;

input.addEventListener('input', () => {
    socket.emit('typing');

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(()=>{
        typingIndicator.innerText = '';
    },2500); //  hide after 2.5 sec
});

socket.on('user-typing', (nickname) =>{
    typingIndicator.innerText = `${nickname} is typing...`;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(()=>{
        typingIndicator.innerText = '';
    },2500);
});

// when user clicks "Send", this function will be invoked:
function sendMessage(){
    const msg = input.value.trim(); // read the input and remove the  extra whitespace
    if(msg){
        socket.emit('message', msg); // sends the message(msg) as data to server via WebSocket(emit 'message' event)
        input.value = ''; // clear the input box after sending
    };
};

// In general — it runs when the server emits a 'message' event to this client.
socket.on('message', ({nickname,text})=>{ // this callback runs whenever a 'message' event is received from the server
    const li = document.createElement('li'); // create a <li> element for the message
    li.textContent=`${nickname}: ${text}`; // set the text content of <li>  to the received message
    messages.appendChild(li); // append the new <li> to the <ul id = 'messages'> element in the DOM 
});