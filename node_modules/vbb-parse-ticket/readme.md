# vbb-parse-ticket

**Parse ticket information from the VBB HAFAS API.**

```js
{
	  name:  'foo'
	, price: 321
	, shpCtx: '{"TLS": "B3TK"}'
}
```

will be parsed to

```js
{
	  name:      'foo'
	, price:     3.21
	, amount:    1
	, fullDay:   true
	, group:     true
	, tariff:    'Berlin'
	, coverage:  'ABC'
	, variant:   '1 day, group'
}
```

[![npm version](https://img.shields.io/npm/v/vbb-parse-ticket.svg)](https://www.npmjs.com/package/vbb-parse-ticket)
[![build status](https://img.shields.io/travis/derhuerst/vbb-parse-ticket.svg)](https://travis-ci.org/derhuerst/vbb-parse-ticket)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-parse-ticket.svg)](https://david-dm.org/derhuerst/vbb-parse-ticket)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/vbb-parse-ticket.svg)](https://david-dm.org/derhuerst/vbb-parse-ticket#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-parse-ticket.svg)
[![gitter channel](https://badges.gitter.im/derhuerst/vbb-rest.svg)](https://gitter.im/derhuerst/vbb-rest)


## Installing

```shell
npm install vbb-parse-ticket
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-parse-ticket/issues).
