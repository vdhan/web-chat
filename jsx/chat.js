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
		this.openOnlines = this.openOnlines.bind(this);
		this.closeOnlines = this.closeOnlines.bind(this);
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

	openOnlines() {
		getI('onlineBoard').style.width = '120px';
	    getI('content').style.marginRight = '120px';
		getI('onlines-info').onclick = this.closeOnlines;
	}

	closeOnlines() {
		getI('onlineBoard').style.width = '0';
	    getI('content').style.marginRight = '0';
		getI('onlines-info').onclick = this.openOnlines;
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

		var offsetRight = (-getI('onlines').offsetWidth / 2 + getI('onlines').offsetHeight / 2);
		getI('onlines').style.cssText += `right: ${offsetRight}px; visibility: visible`;

		getI('onlines-info').onclick = this.openOnlines;
		getI('content').style.marginBottom = `${getI('input').offsetHeight}px`;

		getI('mess').addEventListener('keyup', (e) => {
			if(e.keyCode == 13) {
				this.sendMessage();
			}
		});
	}

	render() {
		return (
			<div>
				<div id="content">
					<ul id="messages">
						<li>&nbsp;</li>
					</ul>
					<div id="onlines" className="vertical-text">
						<a id="onlines-info">
							Onlines: {this.state.onlines}
						</a>
					</div>
				</div>

				<div id="onlineBoard">
					<ul id="online-list"></ul>
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