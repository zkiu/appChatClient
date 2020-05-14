// -- Outputs messages to App --------------------------------------

// -- Append 1 message to html code at id:messages
function AddMessage(message) {
    const MESSAGE = document.querySelector('#messages')
    MESSAGE.insertAdjacentHTML('beforeend',`<h4>${message.name}</h4><p>${message.message}</p>`)
}

// -- Send GET request for the /messages page that contains all the database messages.
function GetMessages() {
    //-- Code below uses JQuery for this. .
    // $.get(`${window.location.href}messages`, data => {
    //     data.forEach(AddMessage);        
    // })

    // JQuery code above has been rewritten with plain vanilla JS below
    var request = new XMLHttpRequest();
    request.open('GET', `${window.location.href}messages`, true);

    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var resp = this.response;
            // document.write(JSON.parse(resp))
            JSON.parse(resp).forEach(AddMessage);
        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
        alert('request to server error')
    };

    request.send();
}

// -- Once app loaded (but before images are loaded), display all the chat history below the chat area 
document.addEventListener("DOMContentLoaded", () => {
    // -- console.log('loaded')
    GetMessages(message);
})

// -- Socket.IO Initialization on client side--------------------------------------
var socket = io();

// -- On btn submit
document.querySelector('button').addEventListener('click', () => {
    // -- grab text input values from the form
    let name = document.querySelector('#name').value;
    let message = document.querySelector('#message').value;

    // -- create an object with input values and send it to server side
    let data = { name: name, message: message }
    // -- pass the form imput to the server
    socket.emit('message', data)

    AddMessage(data)
    // -- clears the form
    document.querySelector('#form1').reset()
})