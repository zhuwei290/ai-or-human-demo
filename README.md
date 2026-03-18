# 🤖 AI or Human? - Cloudflare Pages 版

这是一个图灵测试风格的多人游戏，部署在 Cloudflare Pages 上。

## 🎮 游戏玩法

1. **看问题** - 系统显示一个问题或话题
2. **写回答** - 你在 60 秒内写下回答（要像 AI 一样）
3. **投票** - 猜哪个是 AI 写的
4. **得分** - 猜对得分，骗过别人也得分

## 🚀 部署到 Cloudflare Pages

### 方法 1：GitHub 集成（推荐）

1. Fork 或克隆此仓库
2. 访问 https://dash.cloudflare.com/?to=/:account/pages
3. 点击 "Create a project" → "Connect to Git"
4. 选择此仓库
5. **构建设置**：
   - **Production branch**: `main`
   - **Build command**: (留空)
   - **Build output directory**: `public`
6. 点击 "Save and Deploy"

### 方法 2：直接上传

1. 访问 https://dash.cloudflare.com/?to=/:account/pages
2. 点击 "Create a project" → "Direct Upload"
3. 上传 `public` 文件夹
4. 点击 "Deploy"

## 📁 项目结构

```
ai-or-human-demo/
├── public/
│   ├── index.html     # 游戏主页面
│   └── game.js        # 游戏逻辑
├── .gitignore
└── README.md
```

## 🎯 功能特点

- ✅ **纯静态网站** - 无需后端服务器
- ✅ **Cloudflare Pages 部署** - 全球 CDN，免费托管
- ✅ **单机演示** - 3 个 AI 玩家陪你玩
- ✅ **60 秒倒计时** - 紧张刺激的回答时间
- ✅ **投票系统** - 猜哪个是 AI 写的
- ✅ **投票系统** - 猜哪个是 AI 写的
- ✅ **得分计算** - 完整的得分规则
- ✅ **3 轮游戏** - 每轮不同的问题
- ✅ **最终排名** - 看看谁是赢家

## 💡 提示

- 要写得像 AI 一样（正式、详细、有时空洞）
- 可以使用"AI 提示"按钮获得参考
- 观察其他玩家的回答风格
- 骗过越多人得分越高

## 🛠️ 本地开发

```bash
# 使用 Python 简单服务器
cd public
python3 -m http.server 8000

# 或使用 Node.js
npx serve public
```

然后在浏览器访问：http://localhost:8000

## 📊 成本

Cloudflare Pages 免费额度：
- 无限请求
- 每天 500 次构建
- 完全免费起步

---

**享受游戏！** 🎮
