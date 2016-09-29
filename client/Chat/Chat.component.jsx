import React from 'react'
// import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import classNames from 'classnames'

/* eslint-disable no-unused-vars */
import ListView from '../ListView'
/* eslint-enable no-unused-vars */
import {loadFromStorage} from '../Utils/localStorage'

export default class Chat extends React.Component {
    constructor(props) {
        super(props)
        const chatStore = loadFromStorage('chat')
        let nick
        if(chatStore) {
            nick = chatStore.nick
        }
        this.state = {
            messages: [],
            nick: nick
        }

        this.rowTemplate = this.rowTemplate.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.showNotify = this.showNotify.bind(this)

        this.onConnect = this.onConnect.bind(this)
        this.onRoomJoin = this.onRoomJoin.bind(this)
        this.onNewMessage = this.onNewMessage.bind(this)
        this.onJoinFailure = this.onJoinFailure.bind(this)

        this.sendMessage = this.sendMessage.bind(this)
    }

    componentDidMount() {
        this.socket = io('http://localhost:3000/')
        this.socket.on('connect', this.onConnect)
        this.socket.on('room_join_success', this.onRoomJoin)
        this.socket.on('new_message', this.onNewMessage)
        this.socket.on('user_join', this.showNotify)
        this.socket.on('user_left', this.showNotify)
        this.socket.on('room_join_failure', this.onJoinFailure)

        this.socket.on('exception', this.onException)

        window.onpopstate = () => this.socket.disconnect()
    }

    componentDidUpdate() {
        this.scrollToChatEnd()
    }

    onConnect() {
        const id = parseInt(this.props.params.id)
        const nick = this.state.nick
        this.socket.emit('room_join', id, nick)
    }

    onRoomJoin(name, messages, participants) {
        this.setState({
            ...this.state,
            name,
            messages,
            participants
        })
    }

    onNewMessage(message) {
        this.setState({
            ...this.state,
            messages: [
                ...this.state.messages,
                message
            ]
        })
    }

    onJoinFailure(message) {
        this.onException(message)
        this.context.router.push('/')
    }

    onException(error) {
        /* eslint-disable no-undef */
        var $toastContent = $(`<span class="toast-span"><i class="material-icons error">error</i>${error}</span>`)
        Materialize.toast($toastContent, 5000)
        /* eslint-enable no-undef */
    }

    showNotify(message) {
        /* eslint-disable no-undef */
        var $toastContent = $(`<span class="toast-span"><i class="material-icons info">info</i>${message}</span>`)
        Materialize.toast($toastContent, 5000)
        /* eslint-enable no-undef */
    }

    sendMessage() {
        const message = this.refs.message.value
        if(message !== '') {
            const id = parseInt(this.props.params.id)
            const nick = this.state.nick
            this.setState({
                ...this.state,
                messages: [
                    ...this.state.messages,
                    {
                        user: nick,
                        time: new Date().toLocaleString(),
                        message
                    }
                ]
            })
            this.socket.emit('send_message', id, nick, message)
            this.refs.message.value = ''
        }
    }

    onKeyDown(e) {
        if(e.keyCode === 13 && e.shiftKey === false) {
            this.sendMessage()
        }
    }

    scrollToChatEnd() {
        const list = document.getElementsByTagName('ul')[0]
        list.scrollTop = list.scrollHeight
    }

    parentTemplate(props) {
        const {children} = props
        return (
            <div className="messages-list">
                <ul className="collection">
                    {children}
                </ul>
            </div>
        )
    }

    rowTemplate(item, key) {
        const color = item.user === this.state.nick ? 'mine' : (key % 2 === 0 ? 'even' : 'odd')
        return (
            <li key={key} className={classNames("collection-item", "message", color)} >
                <div className="message-row">
                    <span className="message-user">
                        {item.user}
                    </span>
                    <span className="message-time">
                        {item.time}
                    </span>
                </div>
                <span className="message-text">
                    {item.message}
                </span>
            </li>
        )
    }

    render() {
        return (
            <div className="chat">
                <h4 className="chat-title">Chat: {this.state.name}</h4>
                <ListView
                    dataSource={this.state.messages}
                    rowTemplate={this.rowTemplate}
                    parentTemplate={this.parentTemplate} />
                <div className="row valign-wrapper">
                    <div className="input-field col l10 m9 s12">
                          <input id="message" ref="message" type="text" onKeyDown={this.onKeyDown}/>
                          {/* <label htmlFor="message">Nick</label> */}
                    </div>
                    <button className={classNames("btn waves-effect waves-light col l2 m3 s12")} onClick={this.sendMessage}>Wyślij</button>
                </div>
          </div>
        )
    }
}

Chat.contextTypes = {
    router: React.PropTypes.object.isRequired
}
