# vbb-translate-ids

**Translate VBB IDs from 9-digit to 12-digit and reverse.**

[![npm version](https://img.shields.io/npm/v/vbb-translate-ids.svg)](https://www.npmjs.com/package/vbb-translate-ids)
[![build status](https://img.shields.io/travis/derhuerst/vbb-translate-ids.svg)](https://travis-ci.org/derhuerst/vbb-translate-ids)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-translate-ids.svg)
[![gitter channel](https://badges.gitter.im/derhuerst/vbb-rest.svg)](https://gitter.im/derhuerst/vbb-rest)


## Installing

```shell
npm install vbb-translate-ids
```


## Usage

```js
const {to12Digit, to9Digit} = require('vbb-translate-ids')

assert.strictEqual(to12Digit('900003201'), '900000003201')
assert.strictEqual(to9Digit('900000003201'), '900003201')
```

If `to12Digit`/`to9Digit` don't know how to translate the ID, they will just return it.


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-translate-ids/issues).
