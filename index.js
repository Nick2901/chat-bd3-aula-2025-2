const express = require("express");
const http = require("http");

const app = express();

const server = http.createServer(app);  

const ejs = require("ejs");
const path = require('path');
const socketIO = require('socket.io');
const { Socket } = require("dgram");
const io = socketIO(server)

app.use(express.static(path.join(__dirname,'public')));

app.set('view', path.join(__dirname, 'public'));

app.engine('html', ejs.renderFile);

app.use('/', (req,res)=>{
    res.render('indes.html')
})

let messages = []


io.on('connection', socket=>{
    console.log('NOVO USUÁRIO CONECTADO: ' + socket.id)

    socket.emit('previousMessage', messages)

    socket.on('sendMessage', data => {
        messages.push(data)

        socket.broadcast.emit('receivedMessage', data)
    })
})

server.listen(3000, ()=>{console.log("chat rodando em http://localhost:3000")});