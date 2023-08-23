const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3030;
const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

const io = require('socket.io')(server);
app.use(express.static(path.join(__dirname, 'public')));

let socketsConnected = new Set();


const onConnected = (socket) => {
    console.log('Socket connected:', socket.id);
    socketsConnected.add(socket.id);
    io.emit('usersConnected', socketsConnected.size);

    io.emit('clients-total', socketsConnected.size);    


    socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
        socketsConnected.delete(socket.id);
    io.emit('clients-total', socketsConnected.size);    

    })

    socket.on('message', (data) => {
        console.log("message", data);
        socket.broadcast.emit('chat-message', data);
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    })
}

io.on('connection', onConnected) 