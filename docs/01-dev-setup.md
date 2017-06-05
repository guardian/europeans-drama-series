# DEV setup

## Requirements
- [Node](https://nodejs.org/en/download/) 6.X

### Optional Requirements
- [nvm](https://github.com/creationix/nvm)

## Setup
- Clone this repo `git clone git@github.com:guardian/docs-interactive-template.git`
- Change directory `cd docs-interactive-template`
- Ensure you're using Node 6.X (`node --version`), or run `nvm use` to switch
- Install dependencies `npm install`
- Start the local server `npm start`
- Navigate to interactive in a browser `http://localhost:8000/immersive.html`

## Using third party js
1. Install package using JSPM e.g.

	`jspm install reqwest` or

	`jspm install github:guardian/iframe-messenger`

2. Import package. e.g.

	`import reqwest from 'reqwest'` or

	`import reqwest from 'guardian/iframe-messenger'`

## Text/JSON in javascript
```
import someHTML from './text/template.html!text'
import someJSON from './data/data.json!json'
```

## Test Harness
`index.html` - Stripped down test harness. Includes frontend fonts and curl for loading boot.js.
`immersive.html` - Immersive-style interactive page pulled from theguardian.com
