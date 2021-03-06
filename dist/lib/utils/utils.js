'use strict';

var d3 = require('d3');

var overlayColors = d3.scale.category10();

function Utils() {
}

Utils.overlayColors = overlayColors;
Utils.cloneMe = function(obj) {
	if(obj == null || typeof(obj) !== 'object')
		return obj;
	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}
	var temp = {};//obj.constructor(); // changed

	for(var key in obj) {
		if(obj.hasOwnProperty(key)) {
			temp[key] = Utils.cloneMe(obj[key]);
		}
	}
	return temp;
}
Utils.displayDateFormat = d3.time.format("%Y-%m-%d");
Utils.displayNumberFormat = function(x) {
	return Utils.numberWithCommas(x.toFixed(2));
};
Utils.numberWithCommas = function(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
Utils.isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};
Utils.mousePosition = function(e) {
	var container = e.currentTarget,
		rect = container.getBoundingClientRect(),
		x = e.clientX - rect.left - container.clientLeft,
		y = e.clientY - rect.top - container.clientTop,
		xy = [ Math.round(x), Math.round(y) ];
	return xy;
}
Utils.getValue = function(d) {
	if (d instanceof Date) {
		return d.getTime();
	}
	return d;
}
Utils.getClosestItem = function(array, value, accessor) {
	var lo = 0, hi = array.length - 1;
	while (hi - lo > 1) {
		var mid = Math.round((lo + hi)/2);
		if (accessor(array[mid]) <= value) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	if (accessor(array[lo]) === value) hi = lo;
	var closest = (Math.abs(accessor(array[lo]) - value) < Math.abs(accessor(array[hi]) - value))
						? array[lo]
						: array[hi]
	//console.log(array[lo], array[hi], closest, lo, hi);
	return Utils.cloneMe(closest);
}
Utils.getClosestItemIndexes = function(array, value, accessor) {
	var lo = 0, hi = array.length - 1;
	while (hi - lo > 1) {
		var mid = Math.round((lo + hi)/2);
		if (accessor(array[mid]) <= value) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	if (accessor(array[lo]) === value) hi = lo;
	//console.log(array[lo], array[hi], closestIndex, lo, hi);
	return { left: lo, right: hi };
}
Utils.pluck = function(array, key) {
	return array.map(function(each)  {return each[key];})
}
Utils.keysAsArray = function(obj) {
	return Object.keys(obj)
		.filter(function(key)  {return obj[key] !== null;})
		.map(function(key)  {return obj[key];});
}
Utils.sum = function(array) {
	return array.reduce(function(d1, d2)  {return d1 + d2;});
}

module.exports = Utils;
