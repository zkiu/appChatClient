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

// -- Submitting the message to the database
function msgSubmit() {
    // -- grab text input values from the form
    let name = document.querySelector('#name').value;
    let message = document.querySelector('#message').value;

    // -- create an object with input values
    let data = { name: name, message: message }
    
    // -- Saving the message using the quick and unsafe way (not CRUD)
    // socket.emit('message', data)

    // -- POST request impementation    
    var request = new XMLHttpRequest()
    request.open('POST', `${window.location.href}messages`, true)
    request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8")
    let confirm = request.send(JSON.stringify(data)) // -- send data as text using stringify
    console.log(confirm);
    
    // -- Append message to Client webpage
    AddMessage(data)
    // -- clears the form
    document.querySelector('#form1').reset()
}

document.querySelector('button').addEventListener('click', msgSubmit)

document.querySelector('#message').addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        msgSubmit();
    }
});

document.querySelector('#btn-delete-all').addEventListener('click', function (e) {
    console.log('delete button pressed');
    
    // -- TO DO: update this to a proper DELETE request
    socket.emit('deleteAll', () => { console.log('delete called') })
    const MESSAGE = document.querySelector('#messages')
    MESSAGE.innerHTML = '' 
    }
);

