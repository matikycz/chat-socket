/* eslint-disable no-undef */
const express = require('express')
const app = express()
const cors = require('cors')

const server = app.listen(3000, () => {
    console.log('server started on port 3000')
})

const io = require('socket.io').listen(server)
/* eslint-enable no-undef */

app.use(cors({credentials: true, origin: true}))

app.get('/', (req, res) => {
    res.send('Hello world!')
})

let rooms = [
  {id: 1, name: 'room', participants: ['test']}
]

io.on('connection', socket => {
    console.log('user connected')
    socket.on('disconnect', () => {
        console.log('disconnected')
    })
    socket.on('rooms', () => {
        socket.emit('rooms', rooms)
    })
    socket.on('room_new', room => {
        if(rooms.filter(r => r.name === room.name).length === 0) {
            const newRoom  = {name: room.name, id: rooms.length+1, participants: []}
            rooms = [...rooms, newRoom]
            socket.emit('room_add_success', newRoom)
            io.emit('room_new', newRoom)
        }
        else {
            socket.emit('exception', 'Pokój o takiej nazwie już istnieje!')
        }
    })
    socket.on('room_check_join', (id, nick) => {
        const matchedRooms = rooms.filter(r => r.id === id)
        if(matchedRooms.length === 1) {
            const matchParticipants = matchedRooms[0].participants.filter(p => p === nick)
            if(matchParticipants.length === 0) {
                socket.emit('room_check_join', id)
            }
            else {
                socket.emit('exception', 'Nick jest już zajęty w tym pokoju!')
            }
        }
        else {
            socket.emit('exception', 'Pokój nie istnieje!')
        }
    })
})
