const express = require('express')
const app = express()

// --need to tweak this:
// process.env.NODE_ENV
// -- "development"



//  -- Setting the port requirement for Heroku
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}



const http = require('http').createServer(app)
const io = require('socket.io')(http)

// -- Adding mongoose -----------------------------------------------
const mongoose = require('mongoose')
// -- in production, this url would be in a hidden config file
const urlDB = "mongodb+srv://user:user@learningmodulus-yrmc9.mongodb.net/test?retryWrites=true&w=majority" 
mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true })

//  -- tell mongoose to use the ES6 Promise library
mongoose.Promise = Promise

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    //  -- Once connection opens, this callback will be called
    console.log('mongoose is connected to MongoDB')
})

//  --defining database structure
var MsgSchema = {
    name: String,
    message: String,
    date: { type: Date, default: Date.now }
}

var Message = mongoose.model('Message', MsgSchema)

// -- Middleware to parse the incoming POST requests
app.use(express.urlencoded({ extended: true })) // -- not used yet in this app
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

app.post('/messages', async (req, res) => {
    try {
        var message = new Message(JSON.parse(req.body))
        var savedMessage = await message.save()
        // console.log(savedMessage.id, ' ', savedMessage.name);
        
        console.log('message saved to MongoDB')

        // -- potential filtering code - could be replaced by API
        // var censored = await Message.findOne({ message: 'badword' })
        // if (censored)
        //     await Message.remove({ _id: censored.id })
        // else
            // io.emit('message', req.body)
        
        
        io.emit('appendMessage', savedMessage)
        res.sendStatus(200)

    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {
        console.log('message post called')
    }
})


io.on('connection', (socket) => {
    console.log('new client connection');
    
    // -- actions on client disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    // -- Delete all collections in database
    socket.on('deleteAll', (deletefunction) => {
        deletefunction()
        Message.deleteMany({}, (err) => {
            if (err) {
                throw err
            }
        })
    })
})