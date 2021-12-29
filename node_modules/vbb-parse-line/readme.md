# *vbb-parse-line*

**Parses the names of VBB lines like `M4`, `TXL`, `S42`.**

[![npm version](https://img.shields.io/npm/v/vbb-parse-line.svg)](https://www.npmjs.com/package/vbb-parse-line)
[![build status](https://img.shields.io/travis/derhuerst/vbb-parse-line.svg)](https://travis-ci.org/derhuerst/vbb-parse-line)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-parse-line.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)

Because this module tries to guess the mode of transport from line names, it is doomed to have conflicts. Right now, it is primarily focused on Berlin, until we have a more robust solution to find out more about lines.


## Installing

```shell
npm install vbb-parse-line
```


## Usage

```js
const parse = require('vbb-parse-line')
parse('M4')
```

This will return the following.

```js
{
	mode: 'train',
	product: 'tram',
	symbol: 'M',
	nr: 4
	metro: true  // buses & trams that run frequently & all day
	express: false // buses that skip stations
	night: false // buses replacing other lines in the night
}
```


## Contributing

If you have a question or have difficulties using `vbb-parse-line`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/vbb-parse-line/issues).
