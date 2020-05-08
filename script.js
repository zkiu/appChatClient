
// Outputs messages to App --------------------------------------

//function to and 1 message to the html with ID #MESSAGE
function AddMessage(message) {
    const MESSAGE = document.querySelector('#messages')
    MESSAGE.insertAdjacentHTML('beforeend',`<h4>${message.name}</h4><p>${message.message}</p>`)

}

//iterate through all the massages and call AddMessage()
function GetMessages() {
    //still have to use JQuery for this. will use plain vanilla JS in the future.
    $.get('http://localhost:3000/messages', data => {
        data.forEach(AddMessage);
    })
}

//On app load (but before images are loaded), display all the chat history below the chat area 
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

    //clears the form after pressng the submit button
    document.querySelector('#form1').reset()
})

socket.on('message', AddMessage)