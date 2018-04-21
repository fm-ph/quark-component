# [<img src="logo.png" alt="quark-component" width="200">](https://github.com/fm-ph/quark-component)

[![build status][travis-image]][travis-url]
[![stability][stability-image]][stability-url]
[![npm version][npm-image]][npm-url]
[![js-standard-style][standard-image]][standard-url]
[![semantic-release][semantic-release-image]][semantic-release-url]

Simple __recursive component__ class with __template rendering__ and __hooks__.

___This package is part of `quark` framework but it can be used independently.___

## Installation

[![NPM](https://nodei.co/npm/quark-component.png)](https://www.npmjs.com/package/quark-component)

```sh
npm install quark-component --save
```

## Usage

### Basic

```js
import { Component } from 'quark-component'

const rootComponent = new Component({ el: '#root' })
```

_To be written..._

## API

See [https://fm-ph.github.io/quark-component/](https://fm-ph.github.io/quark-component/)

## Build

To build the sources with `babel` in `./lib` directory :

```sh
npm run build
```

## Documentation

To generate the `JSDoc` :

```sh
npm run docs
```

To generate the documentation and deploy on `gh-pages` branch :

```sh
npm run docs:deploy
```

## Testing

To run the tests, first clone the repository and install its dependencies :

```sh
git clone https://github.com/fm_ph/quark-component.git
cd quark-component
npm install
```

Then, run the tests :

```sh
npm test
```

To watch (test-driven development) :

```sh
npm run test:watch
```

For coverage :

```sh
npm run test:coverage
```

## License

MIT [License](LICENSE.md) © [Patrick Heng](http://hengpatrick.fr/) [Fabien Motte](http://fabienmotte.com/) 

[travis-image]: https://img.shields.io/travis/fm-ph/quark-component/master.svg?style=flat-square
[travis-url]: http://travis-ci.org/fm-ph/quark-component
[stability-image]: https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square
[stability-url]: https://nodejs.org/api/documentation.html#documentation_stability_index
[npm-image]: https://img.shields.io/npm/v/quark-component.svg?style=flat-square
[npm-url]: https://npmjs.org/package/quark-component
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
