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


io.on('connection', (socket) => {
    console.log('new client connection');
    
    // -- actions on client disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    

    // -- TO DO: update this to a proper POST request
    socket.on('message', (message) => {
        // -- create a new 'message' document from the Message model/collection
        let messageReceived = new Message(message)
        messageReceived.save()
            .then(() => {
                console.log('message saved to MongoDB')

            //   -- SIMPLE IMPLEMENTATION OF A 'BADWORD FILTER' ---------------------------------
            //     return Message.findOne({ message: 'badword' })
            // })
            // .then((censoredDocument) => {
            //     if (censoredDocument) {
            //         console.log('Censored Document found: ' + censoredDocument)
            //         return Message.deleteOne({ _id: censoredDocument.id})
            //     }
            //     console.log(message);
            //  -------------------------------------------------------------------------------
                
            })
            .catch((err) => {
                sendStatus(500)
                return console.error(err);
            })
    });

    // -- TO DO: update this to a proper DELETE request
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