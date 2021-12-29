'use strict'

const spaces = /\s+/g
const leadingProduct = /^(BUS|TRAM)\s+/g
const symbolOnly = /^[a-z]{1,3}$/i
const numberOnly = /^[\d]+$/i
const twoNumbers = /^([\d]+)[^\w]([\d]+)$/i
const symbolAndNumber = /^(([a-z]{1,3})[^\w]?([\d]+)|([\d]+)[^\w]?([a-z]{1,3}))/i

const modes = {
	'ICE': 'train',
	'IC': 'train',
	'EC': 'train',
	'EN': 'train',
	'LOC': 'train',
	'RE': 'train',
	'RB': 'train',
	'OE': 'train',
	'U':  'train',
	'S':  'train',
	'F':  'watercraft',
	'E':  'bus',
	'H':  'bus',
	'N':  'bus',
	'X':  'bus'
}

const products = {
	'ICE': 'express',
	'IC': 'express',
	'EC': 'express',
	'EN': 'express',
	'LOC': 'express',
	'RE': 'regional',
	'RB': 'regional',
	'OE': 'regional',
	'U':  'subway',
	'S':  'suburban',
	'F':  'ferry',
	'E':  'bus',
	'H':  'bus',
	'N':  'bus',
	'X':  'bus'
}

const parse = (name) => {
	name = name.toUpperCase().replace(leadingProduct, '').replace(spaces, '')
	let r = {_: name,
		mode: null, product: null, symbol: null, nr: null,
		metro: false, express: false, night: false
	}

	// weird buses in Berlin
	if (name === 'TXL') return {_: name,
		mode: 'bus', product: 'bus', symbol: 'TXL', nr: null,
		metro: true, express: true, night: true
	}
	if (name === 'SXF2') return {_: name,
		mode: 'bus', product: 'bus', symbol: 'SXF', nr: 2,
		metro: false, express: true, night: false
	}
	if (name === 'SEV') return {_: name,
		mode: 'bus', product: 'bus', symbol: null, nr: null,
		metro: true, express: false, night: false
	}
	if (name === 'IRE') return {_: name,
		mode: 'train', product: 'regional', symbol: 'IRE', nr: null,
		metro: false, express: true, night: false
	}

	if (symbolOnly.test(name)) {
		r.symbol = name
		r.mode = r.product = 'bus'
	} else if (numberOnly.test(name)) { // bus & tram lines
		r.nr = parseInt(name)
	} else if (twoNumbers.test(name)) { // weird buses in Brandenburg
		const matches = twoNumbers.exec(name)
		r.mode = r.product = 'bus'
		r.nr = parseInt(matches[1])
	} else {
		const matches = symbolAndNumber.exec(name)
		if (matches && matches[2] && matches[3]) {
			r.symbol = matches[2]
			r.nr = parseInt(matches[3])
		} else if (matches && matches[4] && matches[5]) { // night bus somewhere else
			r.nr = parseInt(matches[4])
			r.symbol = matches[5]
		}
	}

	if (Number.isNaN(r.nr)) r.nr = null

	// handle bus & tram lines with symbol
	     if (r.symbol === 'M') r.metro   = true
	else if (r.symbol === 'X') r.express = true
	else if (r.symbol === 'N') r.night   = true

	// handle weird metro bus & metro tram naming
	if (!r.product) {
		if (r.symbol === 'M') {
			r.product = (r.nr <= 17 && r.nr !== 11) ? 'tram' : 'bus'
			r.mode = (r.nr <= 17 && r.nr !== 11) ? 'train' : 'bus'
		} else if (r.symbol) {
			r.mode = modes[r.symbol]
			r.product = products[r.symbol]
		} else {
			r.product = r.nr < 100 ? 'tram' : 'bus'
			r.mode = r.nr < 100 ? 'train' : 'bus'
		}
	}

	if (r.symbol === 'RE') r.express = true // regional express trains
	else if (r.symbol === 'EN') r.night = true // national night trains

	return r
}

module.exports = parse
