import React from 'react'
import io from 'socket.io-client'

import ListView from '../ListView'

export default class Chat extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rooms: []
    }

    this.rowTemplate = this.rowTemplate.bind(this)
    this.onConnect = this.onConnect.bind(this)
    this.onRooms = this.onRooms.bind(this)
    this.onNewRoom = this.onNewRoom.bind(this)
    this.newRoom = this.newRoom.bind(this)

    this.addRoom = this.addRoom.bind(this)
  }

  componentDidMount() {
    this.socket = io('http://localhost:3000/')
    this.socket.on('connect', this.onConnect)
    this.socket.on('rooms', this.onRooms)
    this.socket.on('room_new', this.onNewRoom)
  }

  onConnect() {
    this.socket.emit('rooms')
  }

  onRooms(newRooms) {
    const {rooms, ...others} = this.state
    this.setState({...others, rooms: newRooms})
  }

  onNewRoom(room) {
    console.log(room)
    const {rooms, ...others} = this.state
    this.setState({
      ...others,
      rooms: [
        ...rooms,
        room
      ]
    })
  }

  newRoom(room) {
    this.socket.emit('room_new', room)
  }

  parentTemplate(props) {
    const {children} = props
    return (
      <div className="rooms">
        <ul>
          {children}
        </ul>
      </div>
    )
  }

  rowTemplate(item, key) {
    return (
      <li key={key}
        onClick={() => this.context.router.push(`/room/${item.id}`)}>
        {item.name}
      </li>
    )
  }

  addRoom() {
    const name = this.refs.roomName.value
    this.newRoom({name})
  }

  render() {
    const dataSource = [
      {name: 'room1', id: 1},
      {name: 'room2', id: 2}
    ]
    return (
      <div>
        <div>
          Nowy pokój:<br/>
          <input type="text" ref="roomName"/>
          <button onClick={this.addRoom}>Dodaj pokoja</button>
        </div>
        <hr/>
        <ListView 
          dataSource={this.state.rooms} 
          rowTemplate={this.rowTemplate}
          parentTemplate={this.parentTemplate}
          />
      </div>
    )
  }
}

Chat.contextTypes = {
  router: React.PropTypes.object.isRequired
}
