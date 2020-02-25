# awesome-chrome-extension-boilerplate

[![Build Status](https://travis-ci.org/tjx666/awesome-chrome-extension-boilerplate.svg?branch=master)](https://travis-ci.org/tjx666/awesome-chrome-extension-boilerplate) [![dependencies Status](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate/status.svg)](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate) [![devDependencies Status](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate/dev-status.svg)](https://david-dm.org/tjx666/awesome-chrome-extension-boilerplate?type=dev) [![Known Vulnerabilities](https://snyk.io/test/github/tjx666/awesome-chrome-extension-boilerplate/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tjx666/awesome-chrome-extension-boilerplate?targetFile=package.json) [![Percentage of issues still open](https://isitmaintained.com/badge/open/tjx666/awesome-chrome-extension-boilerplate.svg)](http://isitmaintained.com/project/tjx666/awesome-chrome-extension-boilerplate)

> 一个超棒的基于 React & TypeScript & webpack 的 chrome 扩展开发模板

## :sparkles: 特性

- :fire: 支持修改 `content scripts` 代码自动重载扩展和刷新注入了 `content scripts`的页面，再也不用修改了 `content scripts` 后手动刷新扩展和页面了。
- :palm_tree: `options` 和 `popup` 页面支持 `react` & `react hooks` & `react hot reload` & `react devtools`，充分享受现代前端工程化的便捷，让你从开发 `SPA` 无缝切换到 chrome 扩展开发。
- :shield: 整个模板包括 **webpack 配置**都是用 `TypeScript` 编写的，使用 `TypeScript` 配置 `webpack` 减少查阅文档和手残的概率。
- :lipstick: ​ 支持 css/less/sass，使用 `mini-css-extract-plugin` 将 CSS 分离成 content CSS Script。
- :hammer_and_pick: ​ 集成了社区很多的优秀的 `webpack`，`eslint` 和 `babel` 插件，优化开发，构建和打包分析体验。

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

:bell: 请确保你对 chrome 扩展开发已经有基本的了解，入门推荐：[Chrome 插件(扩展)开发全攻略](http://blog.haoji.me/chrome-plugin-develop.html)。

### 准备工作

#### 修改清单文件

在 src 目录下有两个清单文件：`manifest.dev.json` 和 `manifest.prod.json`，分别是开发环境和生产环境的配置文件。

**注意**：任何注入了 `content scripts` 的页面也必须被注入 `js/all.js` 和 `css/all.css` ，为了实现这一点，它俩的 `matches` 应该是其它所有 `content scripts` 的 `matches` 的父集。

示例的配置是:

```javascript
"content_scripts": [
    // 注入到所有注入了 content scripts 的页面
    {
        "matches": ["https://github.com/*"],
        "css": ["css/all.css"],
        "js": ["js/all.js"]
    },
    // 注入到 github pull requests 页面
    {
        "matches": ["https://github.com/pulls"],
        "css": ["css/pulls.css"],
        "js": ["js/pulls.js"]
    }
]
```

#### 添加静态资源

`public` 下的文件会被打包到扩展的根目录，`manifest` 中用到的图标等资源可以直接到 `public` 文件夹下面。模板在 `public/icons` 放了一些默认的图标，因此可以在 `manifest` 中这样引用图标：

```json
{
  "icons": {
    "16": "icons/extension-icon-x16.png",
    "32": "icons/extension-icon-x32.png",
    "48": "icons/extension-icon-x48.png",
    "128": "icons/extension-icon-x128.png"
  }
}
```

### 启动 devServer

```bash
npm start
```

由于 `chrome` 的限制，官方的 chrome 扩展 [react devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) 并不能审查 `chrome-extension://` 协议的页面如 `options`，`popup` 页面。所以需要使用独立的 [react devtools](https://www.npmjs.com/package/react-devtools)，启动 devServer 的同时打开独立的 devtools 窗口：

```bash
npm run devtools
```

### 编写代码

模板默认的代码实现的功能是修改 github 导航栏的颜色模板，使用了 [normalize.css](https://github.com/necolas/normalize.css) 和一些自定义样式对 CSS 进行样式重置。

#### [background](https://developer.chrome.com/extensions/background_pages)

如果你想开发 background 脚本，你可以在 `src/background` 文件夹编写你的代码。`src/background/index.ts` 是 `background` 脚本的 入口，也是 `webpack` 的一个 `entry`，其它像 options 和`popup` 页面也类似。你可以查看 `webpack` 的 `entry` 配置： `src/server/utils/entry.ts` 了解更多实现细节。

#### [options](https://developer.chrome.com/extensions/options) 和 [popup](https://developer.chrome.com/extensions/browserAction#popups)

它俩的 webpack entry 分别是 `src/options/index.tsx` 和 `src/popup/index.tsx`。这两个页面很相似，都只是一个普通的 web 页面，因此你可以像开发一个 react SPA 一样开发它们。

这个模板使用了 `react` 的最新版本，因此你可以使用 `react hooks` 去开发函数组件，`react hooks` 的 eslint 规则也集成了。

模板使用 [react-hot-reload](https://github.com/gaearon/react-hot-loader) 支持 react 的热更新。等到 [React Fast Refresh](https://github.com/facebook/react/issues/16604) 支持 webpack 环境了，它将被替换。

#### [content scripts](https://developer.chrome.com/extensions/content_scripts)

这个模板会扫描 `src/contents` 文件夹，将所有子文件夹中的 `index.tsx`或 `index/ts` 作为 `webpack entry`。

`content scripts` 都放在 `src/contents` 目录下。默认有个 `all.ts`，也是个 webpack entry，它不能被删除，因为这个 webpack entry 被用于注入实现 chrome 扩展自动刷新的功能的补丁，`all.ts` 导入的样式将会被用于所有注入了 `content scripts` 的页面。

**举个 🌰:**

当你要给 URL 是 `https://www.example.com/discuss` 页面开发 `content script`，你需要做下面两步:

1. 添加 c`ontent scripts` 和页面 URL 之间的映射到 `manifest.dev.json` 和 `manifest.prod.json`:

   ```json
   "content_scripts": [
       {
           "matches": ["https://www.example.com/discuss*"],
           "css": ["css/discuss.css"],
           "js": ["js/discuss.js"]
       }
   ],
   ```

2. 创建一个和上面 `content script` 路径对应的文件夹 `src/contents/discuss`。`src/discuss/index.tsx` 或者 `src/discuss/index.ts` 将会被视为一个 webpack entry。 `webpack` 会通过这个 `entry` 最终产出 `js/discuss.js` 这个 `chunk`。

   `mini-css-extract-plugin` 会将所有被 `discuss/index.ts` 导入的样式文件合并再分离到 `dist/css/discuss.css`，这也是为什么上面的 `manifest` 中 content CSS script 可以使用 `css/discuss.css` 的原因

## :construction_worker: 打包

构建生产级别的包直接运行：

```bash
npm run build
```

如果你想分析打包情况：

```bash
npm run build-analyze
```

## :loudspeaker: 注意事项

`src/all` 和 `src/background`下的文件包含了实现修改 content script 自动重载扩展和刷新注入了 content script 页面的功能的代码。除非你不开发 content scripts，否则，不能删除它。

## :dart: TODO

- [ ] 打包扩展成 .crx 文件
- [ ] 集成测试
- [ ] 给 manifest.json 增加 json 校验的 VSCode 扩展

## :handshake: 贡献 [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

欢迎提交 PRs 和 issues。
