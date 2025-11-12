# LocalJson Toolset

> ⚠️ **重大更新警示**: LocalJson 已完成 Monorepo 迁移，项目结构和构建方式有重大变化，请仔细阅读文档。

[English](README.md) | [中文](README_zh.md)

一个基于Wails实现的轻量化跨平台工具集，支持Web端和Mac、Windows和Linux等桌面端

## 关于

该项目前端基于[Vue3](https://github.com/vuejs/vue)、[Vite](https://github.com/vitejs/vite)、[Naive-UI](https://github.com/tusen-ai/naive-ui)和TypeScript实现的[It-Tools](https://github.com/CorentinTh/it-tools)，
桌面端基于Go实现的[Wails](https://github.com/wailsapp/wails), 同时感谢其他开源项目。

## 系统架构

```mermaid
graph TD
    A[LocalJson Toolset] --> B[前端层]
    A --> C[桌面层]
    A --> D[核心层]
    
    B --> B1[Vue3 + Vite]
    B --> B2[Naive-UI]
    B --> B3[TypeScript]
    
    C --> C1[Go 语言]
    C --> C2[Wails 框架]
    
    D --> D1[工具集合]
    D --> D2[数据处理]
    D --> D3[业务逻辑]
    
    B1 --> E[Web 端]
    C2 --> F[桌面端]
    
    E --> G[浏览器运行]
    F --> H[跨平台应用]
```

### 项目结构

```bash
localjson/
├── app/
│   ├── services/
│   ├── storage/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   └── package.json
│   ├── desktop/
│   └── web/
├── main.go
├── go.mod
└── wails.json
```

## 桌面截图

![Screenshot](./screen/screen-desktop.png)

## 构建

### 运行环境要求

* Go（最新版本）
* Node.js >= 18
* NPM >= 9

### 安装依赖

```bash
git clone https://github.com/inRemark/localjson.git
go install github.com/wailsapp/wails/v2/cmd/wails@latest
pnpm install
```

### 运行

```bash
# web
pnpm web:dev
# desktop
pnpm wails:dev
```

## License

This project is under the [GNU GPLv3](LICENSE).
