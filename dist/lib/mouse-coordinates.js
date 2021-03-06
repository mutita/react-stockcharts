'use strict';
var React = require('react/addons');
var EdgeCoordinate = require('./edge-coordinate')
var Utils = require('./utils/utils')

// Should not use xScale and yScale here as MouseCoordinate is common across all charts
// if it is made to be inside a Chart another Chart might be displayed over it
var MouseCoordinates = React.createClass({displayName: "MouseCoordinates",
	propTypes: {
		_height: React.PropTypes.number.isRequired,
		_width: React.PropTypes.number.isRequired,
		_show: React.PropTypes.bool.isRequired,
		_mouseXY: React.PropTypes.array.isRequired,
		_chartData: React.PropTypes.object.isRequired,
		_currentItem: React.PropTypes.object.isRequired,

		forChart: React.PropTypes.number.isRequired, 
		xDisplayFormat: React.PropTypes.func.isRequired,
		yDisplayFormat: React.PropTypes.func.isRequired
	},
	shouldComponentUpdate:function(nextProps, nextState) {
		return nextProps._currentItem != this.props._currentItem
				|| nextProps._mouseXY !== this.props._mouseXY
				|| nextProps._show !== this.props._show
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.MouseCoordinates",
			_show: false,
			snapX: true,
			xDisplayFormat: Utils.displayDateFormat,
			yDisplayFormat: Utils.displayNumberFormat,
		}
	},
	renderChildren:function() {
		var chartData = this.props._chartData;
		var item = this.props._currentItem.data;
		

		var xValue = chartData.accessors.xAccessor(item);
		var xDisplayValue = this.props._dateAccessor === undefined
			? xValue
			: this.props._dateAccessor(item);

		var yValue = chartData.scales.yScale.invert(this.props._mouseXY[1]);

		if (xValue === undefined || yValue === undefined) return null;
		var x = this.props.snapX ? Math.round(chartData.scales.xScale(xValue)) : this.props._mouseXY[0];
		var y = this.props._mouseXY[1];

		//console.log(xValue, this.props.xDisplayFormat(xValue));
		//console.log(yValue, this.props.yDisplayFormat(yValue));

		return React.Children.map(this.props.children, function(child)  {
			if (typeof child.type === 'string') return child;
			var newChild = child;
			return React.addons.cloneWithProps(newChild, {
				_width: this.props._width
				, _height: this.props._height
				, _mouseXY: [x, y]
				, _xDisplayValue: this.props.xDisplayFormat(xDisplayValue)
				, _yDisplayValue: this.props.yDisplayFormat(yValue)
			});
		}.bind(this), this);
	},
	render:function() {
		var children = null;
		if (this.props._show) {
			children = this.renderChildren();
		};

		return (
			React.createElement("g", {className: this.props._show ? 'show' : 'hide'}, 
				children
			)
		);
	}
});

module.exports = MouseCoordinates;


/*



*/