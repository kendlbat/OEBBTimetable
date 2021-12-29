'use strict'

const variant = require('./variants')



const tariffs = {
	  B: 'Berlin'
	, P: 'Potsdam'
	, S: 'Brandenburg (Havel)'
	, C: 'Cottbus'
	, G: 'urban area'
	, V: 'Frankfurt (Oder)'
	, L: 'rural area'
	, R: 'rural area'
	, M: 'Szczecin'
}

const R = []
R[3] = '25-35km'; R[4] = '35-45km'; R[5] = '45-55km'; R[6] = '55-65km';
R[7] = '65-75km'; R[8] = '75-85km'; R[9] = '85-95km';

// todo: G2
// todo: RA
const coverages = {
	  B: ['short trip', 'AB', 'BC', 'ABC']
	, S: [null, 'AB', 'BC', 'ABC']
	, G: [null, 'urban area']
	, L: [null, '2 zones', '3 zones', '4 zones']
	, R: R
	, M: ['urban area']
}
coverages.P = coverages.B
coverages.C = coverages.S
coverages.V = coverages.S



const parse = (t) => {
	const ticket = {
		  name:     t.name
		, price: (t.price || t.prc) / 100
		, tariff:   null
		, coverage: null
	}
	if (!t.shpCtx) return ticket
	let code
	try {code = JSON.parse(t.shpCtx).TLS}
	catch (e) {return ticket}
	if (!code) return ticket

	variant(ticket, code.slice(2))

	const tariff = code[0]
	if (tariff in tariffs) ticket.tariff = tariffs[tariff]

	const coverage = parseInt(code[1])
	if (coverages[tariff] && (coverage in coverages[tariff])) {
		ticket.coverage = coverages[tariff][coverage] || null
	}
	if (coverage === 0 && tariff !== 'M') ticket.shortTrip = true

	return ticket
}

module.exports = parse
