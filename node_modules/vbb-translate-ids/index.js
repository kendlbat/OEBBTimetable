'use strict'

const to12Digit = (id) => {
	if ('string' !== typeof id) throw new Error('ID must be a string.')
	if (id.length === 9) return id.slice(0, 1) + '000' + id.slice(1)
	if (id.length === 7) return id.slice(0, 1) + '00000' + id.slice(1)
	return id
}

const to9Digit = (twelve) => {
	if ('string' !== typeof twelve) throw new Error('ID must be a string.')
	if (twelve.length === 12) return twelve.slice(0, 1) + twelve.slice(4)
	if (twelve.length === 7) return twelve.slice(0, 1) + '00' + twelve.slice(1)
	return twelve
}

module.exports = {to12Digit, to9Digit}
