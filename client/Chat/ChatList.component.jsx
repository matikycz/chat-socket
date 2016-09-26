import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import classNames from 'classnames'

/* eslint-disable no-unused-vars */
import ListView from '../ListView'
/* eslint-enable no-unused-vars */
import {loadFromStorage, saveToStorage} from '../Utils/localStorage'

export default class ChatList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            rooms: []
        }

        this.rowTemplate = this.rowTemplate.bind(this)
        this.activeBtn = this.activeBtn.bind(this)
        this.onNickType = this.onNickType.bind(this)
        this.onButtonClick = this.onButtonClick.bind(this)

        this.onConnect = this.onConnect.bind(this)
        this.onRooms = this.onRooms.bind(this)
        this.onNewRoom = this.onNewRoom.bind(this)
        this.onJoin = this.onJoin.bind(this)

        this.newRoom = this.newRoom.bind(this)
        this.selectRoom = this.selectRoom.bind(this)
        this.addRoom = this.addRoom.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
    }

    componentDidMount() {
        //modals initialization
        /* eslint-disable no-undef */
        $('.modal-trigger').leanModal({ready: () => {ReactDOM.findDOMNode(this.refs.roomName).focus()}})
        /* eslint-enable no-undef */

        this.socket = io('http://localhost:3000/')
        this.socket.on('connect', this.onConnect)
        this.socket.on('rooms', this.onRooms)
        this.socket.on('room_new', this.onNewRoom)
        this.socket.on('room_add_success', this.onRoomAddSuccess)
        this.socket.on('room_check_join', this.onJoin)
        this.socket.on('exception', this.onException)
    }

    onConnect() {
        this.socket.emit('rooms')
    }

    onRooms(newRooms) {
        /* eslint-disable no-unused-vars */
        const {rooms, ...others} = this.state
        /* eslint-enable no-unused-vars */
        this.setState({...others, rooms: newRooms})
    }

    onNewRoom(room) {
        const {rooms, ...others} = this.state
        this.setState({
            ...others,
            rooms: [
                ...rooms,
                room
            ]
        })
    }

    onRoomAddSuccess(room) {
        /* eslint-disable no-undef */
        var $toastContent = $(`<span class="toast-span"><i class="material-icons success">done</i>Pokój ${room.name} pomyślnie dodany!</span>`)
        Materialize.toast($toastContent, 5000)
        /* eslint-enable no-undef */
    }

    onJoin(id) {
        const key = 'chat'
        const chatStore = loadFromStorage(key)
        if(chatStore) {
            /* eslint-disable no-unused-vars */
            const {nick, ...others} = chatStore
            /* eslint-enable no-unused-vars */
            saveToStorage(key, {...others, nick: this.state.nick})
        }
        else {
            saveToStorage(key, {nick: this.state.nick})
        }
        this.context.router.push(`/room/${id}`)
    }

    onException(error) {
        /* eslint-disable no-undef */
        var $toastContent = $(`<span class="toast-span"><i class="material-icons error">error</i>${error}</span>`)
        Materialize.toast($toastContent, 5000)
        /* eslint-enable no-undef */
    }

    newRoom(room) {
        this.socket.emit('room_new', room)
    }

    selectRoom(id) {
        /* eslint-disable no-unused-vars */
        const {selectedRoom, ...others} = this.state
        /* eslint-enable no-unused-vars */
        this.setState({
            ...others,
            selectedRoom: id
        })
    }

    addRoom() {
        const name = this.refs.roomName.value
        this.newRoom({name})
        this.refs.roomName.value = ''
    }

    onKeyDown(e) {
        if(e.keyCode === 13 && e.shiftKey === false) {
            this.addRoom()
            /* eslint-disable no-undef */
            $('#modal1').closeModal()
            /* eslint-enable no-undef */
        }
    }

    onButtonClick() {
        if(this.state.selectedRoom !== undefined && this.state.nick !== undefined && this.state.nick !== '') {
            this.socket.emit('room_check_join', this.state.selectedRoom, this.state.nick)
        }
    }

    parentTemplate(props) {
        const {children} = props
        return (
            <div className="rooms-list">
                <ul className="collection">
                    {children}
                </ul>
            </div>
        )
    }

    rowTemplate(item, key) {
        const active = item.id === this.state.selectedRoom ? 'active' : null
        return (
            <li key={key}
                className={classNames("collection-item", active)}
                onClick={() => this.selectRoom(item.id)}>
                {item.name}
            </li>
        )
    }

    onNickType() {
        /* eslint-disable no-unused-vars */
        const {nick, ...others} = this.state
        /* eslint-enable no-unused-vars */
        this.setState({
            ...others,
            nick: this.refs.nick.value
        })
    }

    activeBtn() {
        return this.state.selectedRoom === undefined || this.refs.nick === undefined || this.refs.nick.value === '' ? 'disabled' : null
    }

    render() {
        return (
            <div className="rooms">
                <div>
                    <div className="fixed-action-btn">
                        <a className="btn-floating btn-large waves-effect waves-light red modal-trigger" href="#modal1"><i className="material-icons">add</i></a>
                    </div>
                </div>
                <div id="modal1" className="modal">
                    <div className="modal-content">
                        <h4>Dodawanie nowego pokoju</h4>
                        <div className="input-field col s6">
                              <input id="room_name" ref="roomName" type="text" className="validate" onKeyUp={this.onKeyDown}/>
                              <label htmlFor="room_name">Nazwa pokoju</label>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a href="#!" className=" modal-action modal-close waves-effect waves-green btn-flat">Anuluj</a>
                        <a href="#!" className=" modal-action modal-close waves-effect waves-green btn-flat" onClick={this.addRoom}>Dodaj</a>
                    </div>
                </div>
                <h4 className="rooms-title">Lista pokojów</h4>
                <ListView
                    dataSource={this.state.rooms}
                    rowTemplate={this.rowTemplate}
                    parentTemplate={this.parentTemplate} />
                <div className="row valign-wrapper">
                    <div className="input-field col l10 m9 s12">
                          <input id="nick" ref="nick" type="text" onChange={this.onNickType}/>
                          <label htmlFor="nick">Nick</label>
                    </div>
                    <button className={classNames("btn waves-effect waves-light col l2 m3 s12", this.activeBtn())} onClick={this.onButtonClick}>Dołącz</button>
                </div>
          </div>
        )
    }
}

ChatList.contextTypes = {
    router: React.PropTypes.object.isRequired
}
