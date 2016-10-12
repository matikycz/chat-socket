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
  {id: 1, name: 'room', participants: ['test'], messages: []}
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
            const newRoom  = {name: room.name, id: rooms.length+1, participants: [], messages: []}
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


    socket.on('room_join', (id, nick) => {
        const matchedRooms = rooms.filter(r => r.id === id)
        if(matchedRooms.length === 1) {
            const room = matchedRooms[0]
            const matchParticipants = room.participants.filter(p => p === nick)
            if(matchParticipants.length === 0) {
                const newRoom = Object.assign({}, room, {participants: [...room.participants, nick]})

                const newRooms = rooms.slice()
                newRooms.splice(rooms.indexOf(room), 1)
                rooms = [
                    ...newRooms,
                    newRoom
                ]

                socket.join(id)
                socket.emit('room_join_success', room.name, room.messages, room.participants)
                socket.broadcast.to(id).emit('user_join', `${nick} przyszedł`)

                socket.on('disconnect', () => {
                    const room = rooms.filter(r => r.id === id)[0]
                    socket.broadcast.to(id).emit('user_left', `${nick} wyszedł`)
                    const index = room.participants.indexOf(nick)
                    const participants = room.participants.slice()
                    participants.splice(index, 1)
                    if(participants.length > 0) {
                        const newRoom = Object.assign({}, room, {participants: [...participants]})
                        const newRooms = rooms.slice()
                        newRooms.splice(rooms.indexOf(room), 1)
                        rooms = [
                            ...newRooms,
                            newRoom
                        ]
                    }
                    else {
                        const newRooms = rooms.slice()
                        newRooms.splice(rooms.indexOf(room), 1)
                        rooms = [
                            ...newRooms
                        ]
                        io.emit('room_deleted', room)
                    }
                })
            }
            else {
                socket.emit('room_join_failure', 'Nick jest już zajęty w tym pokoju!')
            }
        }
        else {
            socket.emit('room_join_failure', 'Pokój nie istnieje!')
        }
    })
    socket.on('send_message', (id, nick, message) => {
        const room = rooms.filter(r => r.id === id)[0]
        const newMessage = {
            user: nick,
            time: new Date().toLocaleString(),
            message
        }
        const newRoom = Object.assign({}, room, {messages: [...room.messages, newMessage]})
        const newRooms = rooms.slice()
        newRooms.splice(rooms.indexOf(room), 1)
        rooms = [
            ...newRooms,
            newRoom
        ]
        socket.broadcast.to(id).emit('new_message', newMessage)
    })
})
