const express = require('express')
const app = express()
const port = 3000

const http = require('http').createServer(app)
const io = require('socket.io')(http)

//Adding mongoose -----------------------------------------------
const mongoose = require('mongoose')
const urlDB = "mongodb+srv://user:user@learningmodulus-yrmc9.mongodb.net/test?retryWrites=true&w=majority" //in production, this url would be in a hidden config file
mongoose.connect(urlDB, { useNewUrlParser: true, useUnifiedTopology: true })

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    // Once connection opens, this callback will be called
    console.log('mongoose is connected to MongoDB')
})

//  --defining database structure
var MsgSchema = new mongoose.Schema({
    name: String,
    message: String
})

var Message = mongoose.model('Message', MsgSchema)


//pre-populated chat messages for testing(this is used before the database is implemented) 
// var messages = [
//     { name: 'Claire', message: 'What is up?' },
//     { name: 'Lisa', message: 'Hola' },
// ]


//ensure that the form data received is parsed
app.use(express.urlencoded({ extended: true }))

//the html file at the root dir is displayed 
app.use(express.static('.'))


const server = http.listen(port, () => console.log(`Server is listening at http://localhost:${server.address().port}`))

//lists all the messages in the database
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        if (err) {
            throw err
        }
        res.send(messages)
    })
})

// app.post('/messages', (req, res) => {
//     messages.push(req.body)
//     io.emit('message', req.body)
//     res.sendStatus(200);
// })



io.on('connection', (socket) => {
    console.log('new client connection');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    
    //this replaces the app.post() codes above
    socket.on('message', (message) => {
        let messageRev = new Message(message)
        messageRev.save((err) => {
            if (err) {
                sendStatus(500)
            }
            //  for when used an array to temporarily store messages while server is up. But save method is not persistant
            // messages.push(message)
            console.log(message);
            io.emit('message', message)
        })

    });
})