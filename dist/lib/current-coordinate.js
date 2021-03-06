'use strict';
var React = require('react'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin'),
	Utils = require('./utils/utils');

var CurrentCoordinate = React.createClass({displayName: "CurrentCoordinate",
	//namespace: "ReStock.DataSeries",
	mixins: [PureRenderMixin],
	propTypes: {
		forChart: React.PropTypes.number.isRequired,
		forOverlay: React.PropTypes.number,
		yAccessor: React.PropTypes.func,
		r: React.PropTypes.number.isRequired,
		className: React.PropTypes.string,

		_show: React.PropTypes.bool.isRequired,
		_chartData: React.PropTypes.object.isRequired,
		_currentItem: React.PropTypes.object.isRequired,
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.CurrentCoordinate",
			r: 3
		};
	},
	render:function() {

		var chartData = this.props._chartData;
		var item = this.props._currentItem.data;
		var fill = 'black';

		if (! this.props._show || item === undefined) return null;
		var yAccessor =  this.props.yAccessor || chartData.accessors.yAccessor;

		if (this.props.forOverlay !== undefined) {
			var overlays = chartData.overlays
				.filter(function(each)  {return each.id === this.props.forOverlay;}.bind(this));

			if (overlays.length != 1) {
				console.warn('Unique overlay with id={%s} not found', this.props.forOverlay);
				throw new Error('Unique overlay not found');
			}
			fill = overlays[0].stroke;
			yAccessor = overlays[0].yAccessor;
		}

		var xValue = chartData.accessors.xAccessor(item);
		var yValue = yAccessor(item);

		if (yValue === undefined) return null;

		var x = Math.round(chartData.scales.xScale(xValue)) + chartData.origin[0];
		var y = Math.round(chartData.scales.yScale(yValue)) + chartData.origin[1];

		return (
			React.createElement("circle", {className: this.props.className, cx: x, cy: y, r: this.props.r, fill: fill})
		);
	}
});

module.exports = CurrentCoordinate;
