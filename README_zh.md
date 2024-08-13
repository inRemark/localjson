# LocalJson Toolset

## 一个基于Wails实现的轻量化跨平台工具集，支持Web端和Mac、Windows和Linux等桌面端。

## 关于

该项目前端基于[Vue3](https://github.com/vuejs/vue)、[Vite](https://github.com/vitejs/vite)、[Naive-UI](https://github.com/tusen-ai/naive-ui)和TypeScript实现的[It-Tools](https://github.com/CorentinTh/it-tools)，
桌面端基于Go实现的[Wails](https://github.com/wailsapp/wails), 同时感谢其他开源项目。

## 构建

### 运行环境要求

* Go（最新版本）
* Node.js >= 16
* NPM >= 9

### 安装wails

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### 拉取代码

```bash
git clone https://github.com/inRemark/localjson.git
```

### 构建前端

```bash
pnpm install --prefix ./frontend

# or

cd frontend
pnpm install
```

### 运行

```bash
wails dev
```

## License

This project is under the [GNU GPLv3](LICENSE).

