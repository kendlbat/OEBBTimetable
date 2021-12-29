'use strict'

const names = {
	  '': 'adult'
	, E:  'reduced'
	, T:  '1 day, adult'
	, F:  'bike'
	, M:  '4x adult'
	, ME: '4x reduced'
	, TE: '1 day, reduced'
	, TF: '1 day, bike'
	, TK: '1 day, group'
	, SG: '1 day, group reduced'
}

const props = {
	  '': {amount: 1}
	, E:  {amount: 1, reduced: true}
	, T:  {amount: 1, fullDay: true}
	, F:  {amount: 1, bike: true}
	, M:  {amount: 4}
	, ME: {amount: 4, reduced: true}
	, TE: {amount: 1, reduced: true, fullDay: true}
	, TF: {amount: 1, bike: true, fullDay: true}
	, TK: {amount: 1, group: true, fullDay: true}
	, SG: {amount: 1, reduced: true, group: true, fullDay: true}
}

const parse = (ticket, code) => {
	if (code in names) ticket.variant = names[code]
	if (code in props) Object.assign(ticket, props[code])
	return ticket
}

module.exports = parse
