// -- Append 1 message to html code at id:messages
function AddMessage(message) {
	const MESSAGE = document.querySelector('tbody')

	let date = Date.parse(message.date) //parse the UTC date string from database into date object
	let options = {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: false,
	}
	//convert UTC date to the computer's default local time zone
	dateConverted = new Intl.DateTimeFormat('default', options).format(date)

	MESSAGE.insertAdjacentHTML(
		'beforeend',
		`<tr><td>${message.name}</td><td>${message.message}</td><td class="text-nowrap">${dateConverted}</td></tr>`
	)

	// -- auto scroll to bottom of element as new items overflow the element container
	const messageBox = document.querySelector('#message-box')
	messageBox.scroll({
		top: 1000000,
		left: 0,
		behavior: 'smooth',
	})
}

// -- Send GET request for the /messages page that contains all the database messages.
function GetMessages() {
	/*
	Code below uses JQuery for this. .
		$.get(`${window.location.href}messages`, data => {
				data.forEach(AddMessage);
		})
	JQuery code above has been rewritten with plain vanilla JS below
	*/
	var request = new XMLHttpRequest()
	request.open('GET', `${window.location.href}messages`, true)

	request.onload = function () {
		// on success condition
		if (this.status >= 200 && this.status < 400) {
			var resp = this.response
			JSON.parse(resp).forEach(AddMessage)
		}
	}

	request.onerror = function () {
		// There was a connection error of some sort
		alert('request to server error')
	}

	request.send()
}

// -- Once app loaded (but before images are loaded), display all the chat history below the chat area
document.addEventListener('DOMContentLoaded', () => {
	// -- console.log('loaded')
	GetMessages(message)
})

// -- Socket.IO Initialization on client side--------------------------------------
// *** fix socket.io
// var socket = io()

// -- Submitting the message to the database
function msgSubmit(e) {
	e.preventDefault()
	// -- grab text input values from the form
	let name = document.querySelector('#name').value
	let message = document.querySelector('#message').value

	// -- create an object with input values
	let data = {name, message}

	// -- Saving the message using the quick and unsafe way (not CRUD)
	// *** fix socket.io
	// socket.emit('message', data)

	// -- POST request impementation
	var request = new XMLHttpRequest()
	request.open('POST', `${window.location.href}messages`, true)
	request.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8')
	request.send(JSON.stringify(data)) // -- send raw data as text using stringify

	// -- reset the form fields
	document.querySelector('#form1').reset()
}

// -- Once data successfully saved to MondoDB by server via POST request, server emits the event and returns the newly saved message to callback below
// socket.on('appendMessage', (savedMessage) => {
// 	// -- Append message to Client webpage
// 	AddMessage(savedMessage)
// 	// -- clears the form
// 	document.querySelector('#form1').reset()
// })
// -- submit button
document.querySelector('#form1').addEventListener('submit', msgSubmit)

// -- Danger - delete all button
document
	.querySelector('#btn-delete-all')
	.addEventListener('click', function (e) {
		// -- TO DO: update this to a proper DELETE request
		socket.emit('deleteAll', () => {
			console.log('delete called')
		})
		const MESSAGE = document.querySelector('tbody')
		MESSAGE.innerHTML = ''
	})
