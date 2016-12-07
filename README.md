[![CircleCI](https://circleci.com/gh/guardian/docs-interactive-template.svg?style=svg)](https://circleci.com/gh/guardian/docs-interactive-template)

Guardian interactive ES6 template
=================================

An interactive template & test harness, set up with commonly used components and example code

Usage
=====

Setup
-----
- Install [nvm](https://github.com/creationix/nvm) to manage multiple versions of node.
- Switch node version `nvm use`
- Install dependancies `npm install`

Development
-----------
If you haven't switched node version yet, run `nvm use`. Then start the server `npm start`.

Production / deployment
-----------------------

1. Get `interactives` S3 credentials from Janus
2. `grunt deploy`


Using third party js
--------------------
1. Install package using JSPM e.g.

	`jspm install reqwest` or

	`jspm install github:guardian/iframe-messenger`

2. Import package. e.g.

	`import reqwest from 'reqwest'` or

	`import reqwest from 'guardian/iframe-messenger'`

Text/JSON in javascript
-----------------------
```
import someHTML from './text/template.html!text'
import someJSON from './data/data.json!json'
```

Test Harness
============

`index.html` - Stripped down test harness. Includes frontend fonts and curl for loading boot.js.
`immersive.html` - Immersive-style interactive page pulled from theguardian.com
