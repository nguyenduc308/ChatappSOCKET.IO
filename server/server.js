const express = require('express');
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')
const PORT = process.env.PORT || 5000;
const { generateMessage, generateLocation } = require('./util/messageText')
const app = express();
const server = http.createServer(app)
const Room = require('./models/Room')
const newRoom = new Room()
const io = socketIO(server)
io.on('connection', socket => {
    console.log("new use connected");
    socket.on('joinRoom', msg=> {
        const { name, room } = msg.user;
        socket.join(room) 
        newRoom.createUser(socket.id, name, room)
        io.to(room).emit('usersInRoom', {
            users: newRoom.getUsersByRoom(room)
        })
        socket.emit(
            "msgFromServer",
            generateMessage("Admin", "Welcome to chat App"))
        socket.broadcast.to(room).emit(
            "msgFromSever", 
            generateMessage("Admin", `${name} joined the room`))
    
        socket.on('msgFromClient', (msg) => {
            io.to(room).emit('msgFromSever', generateMessage(name, msg.text))
        })
        socket.on('locationFromClient', msg => {
            io.to(room).emit(
                'locationFromSever',
                generateLocation(name, msg.lat, msg.lng))
        }) 
        socket.on('disconnect', () => {
            const leftUser = newRoom.removeUserById(socket.id)
            io.to(room).emit('usersInRoom',{
                users: newRoom.users
            })
            socket.emit(
                "msgFromServer",
                generateMessage("Admin", `${leftUser.name} has left room`)
            )
    })
})

const publicPath = path.join(`${__dirname}/../public`)
console.log(publicPath);
app.use(express.static(publicPath))

server.listen(PORT, ()=> {
    console.log("App is running on port: " + 5000);
})
