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

io.on('connection', socket => {
  console.log('user connected')
  socket.on('disconnect', () => {
    console.log('disconnected')
  })
  socket.on('room', room => {
    console.log(`joined room ${room}`)
  })
})
