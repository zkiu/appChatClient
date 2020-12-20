const express = require('express')
const app = express()

// --need to tweak this:
// process.env.NODE_ENV
// -- "development"

//  -- Setting the port requirement for Heroku
let port = process.env.PORT
if (port == null || port == '') {
	port = 3000
}

const http = require('http').createServer(app)
const io = require('socket.io')(http)

// -- Adding mongoose -----------------------------------------------
const mongoose = require('mongoose')
// -- in production, this url would be in a hidden config file
const urlDB =
	'mongodb+srv://testUser:9Q4XDruS1nj43UpQ@learncluster.yrmc9.mongodb.net/chatclient?retryWrites=true&w=majority'
mongoose.connect(urlDB, {useNewUrlParser: true, useUnifiedTopology: true})

//  -- tell mongoose to use the ES6 Promise library
mongoose.Promise = Promise

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
	//  -- Once connection opens, this callback will be called
	console.log('mongoose is connected to MongoDB')
})

//  --defining mongoose schema
var MsgSchema = {
	name: String,
	message: String,
	date: {type: Date, default: Date.now},
}

var Message = mongoose.model('Message', MsgSchema)

// -- Middleware to parse the incoming POST requests
app.use(express.urlencoded({extended: true})) // -- not used yet in this app
app.use(express.text())

// -- the html file at the root dir is displayed
app.use(express.static('.'))

// -- variable server is only used in the http.listen callback() to get the port number
const server = http.listen(port)

// -- Respond to the GET /messages page request from the client
app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		if (err) {
			throw err
		}
		res.send(messages)
	})
})
// -- saving a message
app.post('/messages', async (req, res) => {
	try {
		var message = new Message(JSON.parse(req.body))
		var savedMessage = await message.save()
		// -- potential filtering code - could be replaced by API
		// var censored = await Message.findOne({ message: 'badword' })
		// if (censored)
		//     await Message.remove({ _id: censored.id })
		// else
		// io.emit('message', req.body)

		// *** fix socket.io
		io.emit('appendMessage', savedMessage)
		res.sendStatus(200)
		console.log('Post Request: message saved to MongoDB')
	} catch (error) {
		res.sendStatus(500)
		return console.error(error)
	}
})
// -- Delete all documents in database
app.post('/delete-all', async (req, res) => {
	try {
		Message.deleteMany({}, (err) => {
			if (err) {
				throw err
			}
		})
		res.sendStatus(200)
		console.log('Post Request: all messages deleted')
	} catch (error) {
		res.sendStatus(500)
		return console.error(error)
	}
})

// *** fix socket.io
io.on('connection', (socket) => {
	console.log('new client connection')

	// -- actions on client disconnect
	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})
