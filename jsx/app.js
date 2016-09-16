import React from 'react';
import ReactDOM from 'react-dom';
import Chat from './chat.js';
import Copy from './copy.js';
import {getI} from './utils.js';

class Init extends React.Component {
	componentDidMount() {
		getI('input-name').addEventListener('keyup', function(e) {
			if(e.keyCode == 13) {
				if(this.value.trim() != '') {
					ReactDOM.render(<Chat name={this.value} />, getI('wrapper'));
				}
			}
		});
	}

	render() {
		return (
			<div className="container">
				<div className="row p-t-sm v-center">
					<div className="col-xs-2 text-right">
						<label htmlFor="input-name">Name</label>
					</div>
					<div className="col-xs-10">
						<input id="input-name" className="form-control" placeholder="Name" autoFocus />
					</div>
				</div>

				<Copy />
			</div>
		);
	}
}

ReactDOM.render(<Init />, getI('wrapper'));