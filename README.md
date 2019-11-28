# awesome-chrome-extension-boilerplate

> an awesome boilerplate for chrome extension development on top of **React** & **TypeScript** & **webpack**

[![dependencies Status](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate/status.svg?style=flat-square)](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate)[![devDependencies Status](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate/dev-status.svg?style=flat-square)](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate?type=dev)

## :sparkles: Features

- react & react hooks & react hot reload & react devtools ready for options, popup pages
- The whole project is written by TypeScript, includes webpack configurations and devServer
- Support extension auto reload when you change the content scripts code
- Support sass/less as CSS extension language , mini-css-extract-plugin to extracts CSS into separate content scripts
- Use many webpack plugins to optimize webpack build and bundle analyze
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

As the chrome limitation, the react devtools chrome extension can't be use in options and popup page, but we can use the standalone [react devtools](https://www.npmjs.com/package/react-devtools). The boilerplate will not startup the standalone devtools by default, startup the devtools at the same time as startup dev server using npm script:

```bash
npm run devtools
```

### content scripts

> Content scripts are files that run in the context of web pages

content scripts are all under `src/contents`. The default content script all.ts is for all the pages and it can't be remove as the extension auto reload patch code is injected to this entry.

When you want to develop a content script for `https://www.example.com/discuss`:

1. add the content scripts and page URL mapping to manifest.dev.json and manifest.prod.json:

   ```json
   "content_scripts": [
           {
               "matches": ["https://www.example.com/discuss*"],
               "css": ["css/discuss.css"],
               "js": ["js/discuss.js"]
           }
       ],
   ```

2. create a folder named `discuss` or others as you like under `src/contents`, the boilerplate will regard `src/discuss/index.tsx` or `src/discuss/index.ts` as entry. **mini-css-extract-plugin** will extracts the all the styles imported by the `discuss` entry to `discuss.css`, this is why you can set content CSS script `css/discuss.css` in manifest.json.

## :construction_worker: Build

Build a production bundle just run:

```bash
npm run build
```

If you want to analyze the bundle, you can run:

```bash
npm run build:analyze
```

## :handshake: Contributing [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Please feel free to make any PRs or submit an issue.
