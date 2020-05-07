const express = require('express')
const app = express()
const port = 3000

const http = require('http').createServer(app)
const io = require('socket.io')(http)

//pre-populated chat messages (this is used before the database is implemented)
var messages = [
    { name: 'Claire', message: 'What is up?' },
    { name: 'Lisa', message: 'Hola' },
]


//ensure that the form data received is parsed
app.use(express.urlencoded({ extended: true }))

//the html file at the root dir is displayed 
app.use(express.static('.'))


const server = http.listen(port, () => console.log(`Server is listening at http://localhost:${server.address().port}`))

app.get('/messages', (req, res) => res.send(messages))

app.post('/messages', (req, res) => {
    res.sendStatus(200);
    messages.push(req.body)
    // res.send(messages);
    // console.log(messages);
})

io.on('connection', (socket) => {
    console.log('new user connection');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})