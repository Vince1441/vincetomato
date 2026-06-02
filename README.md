# 🍅 VinceTomato 番茄钟

一个极简透明的桌面番茄钟应用，采用温暖的玫瑰裸棕色调设计，帮助你在 Windows 上保持专注。

![主题色](https://via.placeholder.com/120x40/C49A8A/5C4033?text=Rose+Brown)

## ✨ 特性

- **悬浮透明小窗** — 始终置顶，无边框，可拖拽，不打扰工作流
- **经典番茄工作法** — 25分钟工作 / 5分钟短休 / 15分钟长休，自动循环
- **任务管理** — 添加今日任务，切换当前专注任务，记录每个任务的番茄数
- **数据统计** — 今日完成番茄数、专注时长、本周趋势柱状图
- **本地持久化** — 所有数据保存在本地 JSON，无需联网
- **系统通知 + 音效** — 阶段切换时自动提醒
- **自定义设置** — 工作/休息时长、音效开关、长休息间隔随心调

## 🛠 技术栈

- [Tauri v2](https://tauri.app/) — Rust 后端 + WebView 前端，包体小巧
- React 18 + TypeScript
- Tailwind CSS
- Zustand 状态管理

## 📦 安装

从 [Releases](../../releases) 下载最新版 `.msi` 安装包，双击安装即可。

## 🚀 开发

```bash
# 1. 克隆仓库
git clone https://github.com/Vince1441/vincetomato.git
cd vincetomato

# 2. 安装依赖
npm install

# 3. 启动开发模式
npm run tauri dev

# 4. 构建生产包
npm run tauri build
```

> **Windows 构建要求**：需安装 [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)（勾选"使用 C++ 的桌面开发"工作负载）

## 📁 数据存储位置

应用数据保存在：
```
%APPDATA%\com.pomodoro.app\
├── settings.json   # 应用设置
├── tasks.json      # 任务列表
└── records.json    # 历史记录
```

## 📄 License

MIT
