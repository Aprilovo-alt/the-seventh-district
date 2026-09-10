# 第七码头：正常生活

一个离线运行的反乌托邦政治寓言小游戏 V0.1。

## 本地浏览器运行

需要 Node.js。

```bash
npm install
npm start
```

然后打开 http://localhost:8080

## Android APK

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

在 Android Studio 中选择 Build > Build APK(s)。

## GitHub

将整个项目上传到 GitHub。`www/` 是游戏主体，后续剧情可以直接在 `game.js` 中扩展。
