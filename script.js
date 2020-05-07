
// Outputs messages to App --------------------------------------

function AddMessage(message) {
    const MESSAGE = document.querySelector('#messages')
    MESSAGE.insertAdjacentHTML('beforeend',`<h4>${message.name}</h4><p>${message.message}</p>`)

}

function GetMessages() {
    //still have to use JQuery for this. will use plain vanilla JS in the future.
    $.get('http://localhost:3000/messages', data => {
        data.forEach(AddMessage);
    })
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('loaded')
    // const message = { name:"kiu", message:"here"}
    GetMessages(message);
})

// Caputure submitted messages with Socket.IO--------------------------------------
var socket = io();




document.querySelector('button').addEventListener('click', () => {
    let name = document.querySelector('#name').value;
    let message = document.querySelector('#message').value;

    // alternative, but inefficient way to compose the JSON object
    // let data = { name: `${name}`, message: `${message}` }
    // console.log(data);
    
    let data = { name: name, message: message }
    socket.emit('message', data)
})

socket.on('message', AddMessage)