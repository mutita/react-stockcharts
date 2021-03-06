'use strict';

// DataSeries has to hold OverlaySeries since DataSeries might define the xAccessor and it needs to be sent to OverlaySeries
// Data series has to pass the current mouse position to the children so this has no benefit
//     of PureRenderMixin

var React = require('react'),
	PureRenderMixin = require('./mixin/restock-pure-render-mixin'),
	Utils = require('./utils/utils'),
	d3 = require('d3'),
	OverlayUtils = require('./utils/overlay-utils'),
	overlayColors = Utils.overlayColors;

function getOverlayFromList(overlays, id) {
	return overlays.map(function(each)  {return [each.id, each];})
		.filter(function(eachMap)  {return eachMap[0] === id;})
		.map(function(eachMap)  {return eachMap[1];})[0];
}

var DataSeries = React.createClass({displayName: "DataSeries",
	mixins: [PureRenderMixin],
	propTypes: {
		xAccessor: React.PropTypes.func,
		_xAccessor: React.PropTypes.func,
		yAccessor: React.PropTypes.func.isRequired,

		_xScale: React.PropTypes.func,
		_yScale: React.PropTypes.func,

		/*_currentItem: React.PropTypes.object,
		_lastItem: React.PropTypes.object,
		_firstItem: React.PropTypes.object,*/
		_overlays: React.PropTypes.array,
		_updateMode: React.PropTypes.object
	},
	getDefaultProps:function() {
		return {
			namespace: "ReStock.DataSeries"
		};
	},
	renderChildren:function() {
		var newChildren = React.Children.map(this.props.children, function(child)  {
			var newChild = child;

			if (typeof child.type === 'string') return newChild;

			if (/Series$/.test(newChild.props.namespace)) {
				newChild = React.addons.cloneWithProps(newChild, {
					_xScale: this.props._xScale,
					_yScale: this.props._yScale,
					_xAccessor: (this.props.xAccessor || this.props._xAccessor),
					_yAccessor: this.props.yAccessor,
					data: this.props.data
				});
				if (/OverlaySeries$/.test(newChild.props.namespace)) {
					var key = newChild.props.id;
					var overlay = getOverlayFromList(this.props._overlays, newChild.props.id);
					newChild = React.addons.cloneWithProps(newChild, {
						_overlay: overlay,
						_pan: this.props._pan,
						_isMainChart: this.props._isMainChart
					});
				}
			}
			return newChild;
		}.bind(this), this);

		return newChildren;
	},
	render:function() {
		//throw new Error();
		// console.log('rendering dataseries...');
		/*if (this.props._pan) {
			return <g></g>
		}*/
		return (
			React.createElement("g", {style: { "clipPath": "url(#chart-area-clip)"}}, this.renderChildren())
		);
	}
});

module.exports = DataSeries;
