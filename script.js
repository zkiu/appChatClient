// Outputs messages to App --------------------------------------

// Append 1 message to html code at id:messages
function AddMessage(message) {
    const MESSAGE = document.querySelector('#messages')
    MESSAGE.insertAdjacentHTML('beforeend',`<h4>${message.name}</h4><p>${message.message}</p>`)
}

// Send GET request for /messages page that contains all the database messages.
function GetMessages() {
    //still have to use JQuery for this. will use plain vanilla JS in the future.
    $.get('http://localhost:3000/messages', data => {
        data.forEach(AddMessage);
    })
}

// Once app loaded (but before images are loaded), display all the chat history below the chat area 
document.addEventListener("DOMContentLoaded", () => {
    // console.log('loaded')
    GetMessages(message);
})

// Socket.IO Initialization on client side--------------------------------------
var socket = io();

// On btn submit
document.querySelector('button').addEventListener('click', () => {
    // grab text input values from the form
    let name = document.querySelector('#name').value;
    let message = document.querySelector('#message').value;

    //create an object with input values and send it to server side
    let data = { name: name, message: message }
    //pass the form imput to the server
    socket.emit('message', data)

    AddMessage(data)
    //clears the form
    document.querySelector('#form1').reset()
})