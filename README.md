# awesome-chrome-extension-boilerplate

> an awesome boilerplate for chrome extension development on top of **React** & **TypeScript** & **webpack**

## :sparkles: Features

- react & react hooks & react hot reload& react devtools ready for options, popup pages
- The whole project is written by TypeScript, includes webpack configurations and devServer
- Support extension auto reload when you change the content scripts code
- Use sass as CSS extension language , mini-css-extract-plugin to extracts CSS into separate content scripts
- Use many webpack plugins to optimize webpack build and analyze
- Use eslint and related plugins to lint TypeScript, babel to compile TypeScript and fork-ts-checker-webpack-plugin to check TypeScript Types

## :package: Installation

```bash
# clone the boilerplate
git clone git@github.com:tjx666/awesome-chrome-extension-boilerplate.git your-extension-name
# install dependencies, recommand yarn
yarn
# or you can use npm
npm install
```

## :hammer_and_wrench: Development

### Startup devServer

run follow npm script:

```bash
npm start
```

### background

If you want to background script, you cant write code under `src/background` directory. `scr/background/index.ts` is the webpack entry for background script, other script like options and popup page is similar, you can check `src/server/utils/entry.ts` which is the entry config for webpack for more details.

### options and popup page

They entries of them are `src/options/index.tsx` and `src/popup/index.tsx` respectively.

The two pages is similar, all is just a normal web page, so, you can just develop them like normal web APP.

The boilerplate uses the latest react version, so you can use the react hooks to develop functional component, eslint rules of react hooks is also ready.

The boilerplate use [react-hot-reload](https://github.com/gaearon/react-hot-loader) to support react hot reload. When the [React Fast Refresh](https://github.com/facebook/react/issues/16604) supports webpack env, it would be replaced.

### content scripts

to be continue...
