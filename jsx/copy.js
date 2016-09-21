import React from 'react';

class Copy extends React.Component {
	getYear() {
		var year = 2016;
		var current = new Date().getFullYear();
		return year + (current > year && '-' + current);
	}

	render() {
		return (
			<div className="col-xs-12 text-center p-t-sm text-primary">
				<strong>Copyright &copy; {this.getYear()}, Hoàng Ân</strong>
			</div>
		);
	}
}

export default Copy;