const express = require('express')
const app = express()

// -- Typical port used for dev
//  -- const port = 3000

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
    message: String
}

var Message = mongoose.model('Message', MsgSchema)

// -- the html file at the root dir is displayed 
app.use(express.static('.'))

// -- variable server is only used in the http.listen callback() to get the port number
const server = http.listen(port, () => console.log(`Server is listening at http://localhost:${server.address().port}`))

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
})