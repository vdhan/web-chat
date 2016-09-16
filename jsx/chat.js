import React from 'react';
import Copy from './copy.js';
import {getI} from './utils.js';

class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			socket: io(),
			onlines: 0
		};

		this.state.socket.emit('connected', props.name, (data) => {
			for(var prop in data) {
				this.updateOnlineList(prop, data[prop]);
			}

			this.setState({
				onlines: Object.keys(data).length
			});
		});

		this.sendMessage = this.sendMessage.bind(this);
	}

	sendMessage() {
		var mess = getI('mess');
		if(mess.value.trim() != '') {
			var data = {
				from: this.props.name,
				msg: mess.value
			};

			this.state.socket.emit('send message', data);
		}

		mess.value = '';
		this.updateMessage(`${data.from}: ${data.msg}`);
	}

	updateMessage(data) {
		var li = document.createElement('li');
		li.textContent = data;
		getI('messages').appendChild(li);
	}

	updateOnlineList(idx, name) {
		var li = document.createElement('li');
		li.textContent = name;
		li.setAttribute('data-keys', idx);
		getI('online-list').appendChild(li);
	}

	componentDidMount() {
		this.state.socket.on('connected', (data) => {
			this.updateMessage(data.msg);
			this.updateOnlineList(data.id, data.name);

			this.setState({
				onlines: this.state.onlines + 1
			});
		});

		this.state.socket.on('broadcast', (data) => {
			this.updateMessage(data);
		});

		this.state.socket.on('disconnect', (data) => {
			this.updateMessage(data.msg);

			var li = document.querySelector(`ul#online-list [data-keys="${data.id}"]`);
			li.parentNode.removeChild(li);

			this.setState({
				onlines: this.state.onlines - 1
			});
		});

		getI('mess').addEventListener('keyup', (e) => {
			if(e.keyCode == 13) {
				this.sendMessage();
			}
		});
	}

	render() {
		return (
			<div>
				<div className="col-xs-11">
					<ul id="messages"></ul>
				</div>

				<div id="onlines" className="col-xs-1">
					<a href="#onlineBoard" data-toggle="collapse">
						Onlines: {this.state.onlines}
					</a>

					<div id="onlineBoard" className="collapse">
						<ul id="online-list"></ul>
					</div>
				</div>

				<div id="input">
					<div className="col-xs-12 col-md-11">
						<input id="mess" className="form-control" autoFocus />
					</div>
					<div className="hidden-xs hidden-sm col-md-1">
						<button className="btn btn-success btn-block" onClick = {this.sendMessage}>Send</button>
					</div>

					<Copy />
				</div>
			</div>
		);
	}
}

export default Chat;