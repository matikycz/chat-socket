import io from 'socket.io-client'

const randomInt = (min, max) => (
  Math.floor(Math.random() * (max - min + 1)) + min
)

function getQueryVariable(variable)
{
  const query = window.location.search.substring(1)
  const vars = query.split("&")
  for (let i=0; i<vars.length; i++) {
    const pair = vars[i].split("=")
    if(pair[0] === variable ) {
      return pair[1]
    }
  }
  return null
}

const socket = io('http://localhost:3000/')
socket.on('connect', () => {
  socket.emit('room', getQueryVariable('room') || 1)
})
