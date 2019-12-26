# awesome-chrome-extension-boilerplate

[![Build Status](https://travis-ci.org/tjx666/awesome-chrome-extension-boilerplate.svg?branch=master)](https://travis-ci.org/tjx666/awesome-chrome-extension-boilerplate) [![dependencies Status](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate/status.svg)](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate) [![devDependencies Status](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate/dev-status.svg)](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate?type=dev) [![Known Vulnerabilities](https://snyk.io/test/github/tjx666/awesome-chrome-extension-boilerplate/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tjx666/awesome-chrome-extension-boilerplate?targetFile=package.json) [![Percentage of issues still open](https://isitmaintained.com/badge/open/tjx666/awesome-chrome-extension-boilerplate.svg)](http://isitmaintained.com/project/tjx666/awesome-chrome-extension-boilerplate')

[English](./README-en.md) | 简体中文

> 一个超棒的基于 React & TypeScript & webpack 的 chrome 扩展开发模板

## :sparkles: 特性

- 选项和弹窗页面支持 react & react hooks & react hot reload & react devtools
- 整个页面包括 webpack 配置和 devServer 都是用 TypeScript 编写的
- 支持修改 content scripts 代码自动刷新扩展和当前页面
- 支持 sass/less CSS 扩展语言，使用 mini-css-extract-plugin 插件将 CSS 分离成 content CSS Script
- 集成了很多的优秀 webpack 插件优化 webpack 构建和 bundle 分析
- 使用 eslint 和相关插件 lint TypeScript，babel 编译 TypeScript，fork-ts-checker-webpack-plugin 检查 TypeScript 类型

## :package: 安装

```bash
# 克隆这个模板
git clone git@github.com:tjx666/awesome-chrome-extension-boilerplate.git your-extension-name

# 安装依赖，推荐使用 yarn
yarn
# 或者使用 npm
npm install
```

## :hammer_and_wrench: 开发

请确保你对 chrome 扩展开发已经有基本的了解。

### 1. 调整模板

1. 根据你的实际需求修改 manifest.dev.json/manifest.prod.json 中的字段，像 name, version, description, permission 等等...

   **注意:**

   任何注入了 content scripts 的页面都必须被注入 `js/all.js` 和 `css/all.css` ，你看我取文件名都叫 all。也就是说，他俩的 matches 应该是其它所有 content scripts 的 matches 的父集。

   默认的配置是:

   ```javascript
   "content_scripts": [
       {
           "matches": ["https://github.com/*"],
           "css": ["css/all.css"],
           "js": ["js/all.js"]
       },
       {
           // src/contents 目录下也应该有 pulls 文件夹
           // "https://github.com/pulls" 是 "https://github.com/*" 的子集
           "matches": ["https://github.com/pulls"],
           "css": ["css/pulls.css"],
           "js": ["js/pulls.js"]
       }
   ]
   ```

   上面的配置中，其它的 content scripts 的 matches `https://github.com/pulls` 是 `https://github.com/*` 的子集，确保了将 `js/pulls.js` 和 `css/pulls.css` 注入 `https://github.com/pulls` 页面时也注入了 `js/all.js` 和 `css/all.css`。如果你不需要开发 content scripts，直接删除上面的配置。

2. 图标和 HTML 模板等资源文件都被放置在 public 文件夹下面，将图标替换成你自己的扩展的图标，打包时会被自动 copy 到 dist 中。

### 2. 启动 devServer

执行下面的 npm 脚本:

```bash
npm start
```

由于 chrome 的限制，官方的 [react devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) chrome 扩展并不能审查 `chrome-extension://` 协议的页面如 options，popup 页面。所以需要使用独立的 [react devtools](https://www.npmjs.com/package/react-devtools)，启动 devServer 的同时打开独立的 devtools 窗口：

```bash
npm run devtools
```

### 3. 编写代码

#### [background](https://developer.chrome.com/extensions/background_pages)

如果你想开发 background 脚本，你可以在 `src/background` 文件夹编写你的代码。`src/background/index.ts` 是 background 脚本的 入口，其它像选项和弹窗页面脚本也类似。你可以查看 webpack entry 配置 `src/server/utils/entry.ts` 了解更多实现细节。

#### [options](https://developer.chrome.com/extensions/options) 和 [popup](https://developer.chrome.com/extensions/browserAction#popups)

它俩的 webpack entry 分别是 `src/options/index.tsx` 和 `src/popup/index.tsx`。这两个页面很相似，都只是一个普通的 web 页面，因此你可以像开发一个普通的 web APP 一样开发它们。

这个模板使用的 react 的最新版本，因此你可以使用 react hooks 去开发函数组件，react hooks 的 eslint 规则也集成了。

模板使用 [react-hot-reload](https://github.com/gaearon/react-hot-loader) 支持 react 的热更新。等到 [React Fast Refresh](https://github.com/facebook/react/issues/16604) 支持 webpack 环境了，它将被替换。

#### [content scripts](https://developer.chrome.com/extensions/content_scripts)

这个模板会扫描 `src/contents` 文件夹，将所有子文件夹中的 `index.tsx`或 `index/ts` 作为 webpack entry。

content scripts 都放在 `src/contents` 目录下。默认有个 all.ts，也是个 webpack entry，它不能被删除，因为这个 webpack entry 被用于注入实现 chrome 扩展自动刷新的功能的补丁。

**举个例子:**

当你要给 URL 是 `https://www.example.com/discuss` 页面开发 content script，你需要做下面两步:

1. 添加 content scripts 和页面 URL 之间的映射到 `manifest.dev.json` 和 `manifest.prod.json`:

   ```json
   "content_scripts": [
       {
           "matches": ["https://www.example.com/discuss*"],
           "css": ["css/discuss.css"],
           "js": ["js/discuss.js"]
       }
   ],
   ```

2. 创建一个和上面 content js script 路径对应的文件夹 `src/contents/discuss`。`src/discuss/index.tsx` 或者 `src/discuss/index.ts` 会被视为一个 webpack entry。 webpack 会通过这个 entry 最终产出 `js/discuss.js` 这个 chunk。

   **mini-css-extract-plugin** 将所有被 `discuss` entry 导入的样式文件分离到 `dist/css/discuss.css`，这也是为什么上面的 manifest.json 中 content CSS script 可以使用 `css/discuss.css` 的原因

## :construction_worker: 构建

构建生产级别的包直接运行：

```bash
npm run build
```

如果你想分析打包情况：

```bash
npm run build:analyze
```

## :handshake: 贡献 [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

欢迎提交 pull requests 和 issues。
