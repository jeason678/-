# 🐟 大鱼吃小鱼

一个精美的网页版大鱼吃小鱼游戏，使用 React + TypeScript + Canvas 构建。

![游戏截图](https://gnmgrjl2t6h66.ok.kimi.link/screenshot.png)

## 🎮 在线试玩

**[点击这里开始游戏](https://gnmgrjl2t6h66.ok.kimi.link)**

## 📖 游戏介绍

控制你的小鱼在海底世界中游动，吃掉比你小的鱼来成长，同时要小心避开比你大的鱼！

### 游戏特色

- 🎨 精美的海底世界画面，带有动态光线和海草
- 🫧 逼真的气泡效果
- 🐠 多种颜色和大小的小鱼
- 📈 等级系统，吃掉越多鱼等级越高
- 🏆 分数记录，挑战最高分
- 📱 支持鼠标和触摸屏操作
- 🎯 流畅的动画和碰撞检测

### 操作方式

- **鼠标**：移动鼠标控制鱼儿游动方向
- **触摸**：在屏幕上滑动控制鱼儿游动方向
- **暂停**：点击右上角的暂停按钮

### 游戏规则

1. 控制橙色的小鱼（玩家）
2. 吃掉比你小的鱼来增长体型和获得分数
3. 避开比你大的鱼，否则游戏结束
4. 小鱼会智能躲避玩家
5. 随着等级提升，会出现更大的鱼

## 🚀 在 GitHub Pages 上运行

### 方法一：Fork 后自动部署

1. **Fork 本仓库**
   - 点击右上角的 "Fork" 按钮

2. **启用 GitHub Pages**
   - 进入你 Fork 的仓库
   - 点击 "Settings" → "Pages"
   - 在 "Source" 下选择 "GitHub Actions"

3. **自动部署**
   - 每次推送到 `main` 分支时，GitHub Actions 会自动构建并部署
   - 部署完成后，可以通过 `https://你的用户名.github.io/仓库名` 访问

### 方法二：本地开发后手动部署

```bash
# 克隆仓库
git clone https://github.com/你的用户名/big-fish-eat-small-fish.git
cd big-fish-eat-small-fish

# 安装依赖
npm install

# 本地开发
npm run dev

# 构建
npm run build

# 部署到 GitHub Pages（需要配置 gh-pages）
npm run deploy
```

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **动画**: Canvas API + requestAnimationFrame

## 📁 项目结构

```
.
├── .github/workflows/    # GitHub Actions 工作流
│   └── deploy.yml        # 自动部署配置
├── src/
│   ├── components/       # 组件
│   │   ├── GameCanvas.tsx   # 游戏画布渲染
│   │   └── GameUI.tsx       # 游戏界面UI
│   ├── hooks/            # 自定义 Hooks
│   │   └── useGame.ts    # 游戏逻辑核心
│   ├── types/            # 类型定义
│   │   └── game.ts       # 游戏相关类型
│   ├── App.tsx           # 主应用组件
│   └── main.tsx          # 入口文件
├── dist/                 # 构建输出目录
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 自定义配置

可以修改 `src/types/game.ts` 中的 `GAME_CONFIG` 来调整游戏参数：

```typescript
export const GAME_CONFIG = {
  canvasWidth: 1200,        // 画布宽度
  canvasHeight: 800,        // 画布高度
  playerInitialSize: 20,    // 玩家初始大小
  playerMaxSize: 150,       // 玩家最大大小
  playerSpeed: 4,           // 玩家速度
  enemySpawnInterval: 1500, // 敌人生成间隔（毫秒）
  minEnemySize: 10,         // 最小敌人大小
  maxEnemySize: 120,        // 最大敌人大小
  growthRate: 0.3,          // 成长速率
  scoreMultiplier: 10,      // 分数倍数
};
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

Made with ❤️ by Kimi AI
