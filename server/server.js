const express = require('express')
const app = express()
const cors = require('cors')

const server = app.listen(3000, () => {
  console.log('server started on port 3000')
})

const io = require('socket.io').listen(server)

app.use(cors({credentials: true, origin: true}))

app.get('/', (req, res) => {
  res.send('Hello world!')
})

let rooms = [
  {id: 1, name: 'room'}
]

io.on('connection', socket => {
  console.log('user connected')
  socket.on('disconnect', () => {
    console.log('disconnected')
  })
  socket.on('rooms', () => {
    console.log(rooms)
    socket.emit('rooms', rooms)
  })
  socket.on('room_new', room => {
    const newRoom  = {name: room.name, id: rooms.length+1}
    rooms = [...rooms, newRoom]
    io.emit('room_new', newRoom)
  })
})
