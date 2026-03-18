# 🤖 AI or Human? - 单机演示版

这是一个图灵测试风格的多人游戏单机演示版。

## 🎮 游戏玩法

1. **看问题** - 系统显示一个问题或话题
2. **写回答** - 你在 60 秒内写下回答（要像 AI 一样）
3. **投票** - 猜哪个是 AI 写的
4. **得分** - 猜对得分，骗过别人也得分

## 🚀 快速开始

### 本地测试

```bash
cd ai-or-human-demo
npm install
npm run dev
```

然后在浏览器访问：http://localhost:8787

### 部署到 Cloudflare

```bash
# 确保已登录 Cloudflare
npx wrangler login

# 部署
npm run deploy
```

部署后会获得一个公开链接，例如：
`https://ai-or-human-demo.your-subdomain.workers.dev`

## 📁 项目结构

```
ai-or-human-demo/
├── worker.js          # Cloudflare Workers 主文件
├── package.json       # 项目配置
├── wrangler.toml      # Cloudflare 配置
├── public/
│   ├── index.html     # 游戏页面
│   └── game.js        # 游戏逻辑
└── README.md          # 说明文档
```

## 🎯 功能特点

- ✅ **单机演示** - 无需后端，所有逻辑在前端
- ✅ **模拟玩家** - 3 个 AI 玩家陪你玩
- ✅ **60 秒倒计时** - 紧张刺激的回答时间
- ✅ **投票系统** - 猜哪个是 AI 写的
- ✅ **得分计算** - 完整的得分规则
- ✅ **3 轮游戏** - 每轮不同的问题
- ✅ **最终排名** - 看看谁是赢家

## 🎨 游戏界面

1. **首页** - 开始游戏/查看规则
2. **游戏界面** - 问题 + 倒计时 + 输入框
3. **投票界面** - 匿名回答 + 投票
4. **结果界面** - 揭示 AI + 得分统计
5. **游戏结束** - 最终排名

## 💡 提示

- 要写得像 AI 一样（正式、详细、有时空洞）
- 可以使用"AI 提示"按钮获得参考
- 观察其他玩家的回答风格
- 骗过越多人得分越高

## 🛠️ 技术栈

- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **后端**: Cloudflare Workers（无服务器）
- **部署**: Cloudflare（完全免费）

## 📊 成本

Cloudflare Workers 免费额度：
- 每天 100,000 次请求
- 足够支持数百个玩家
- 完全免费起步

## 🎯 下一步

- [ ] 添加更多问题
- [ ] 改进 AI 回答质量
- [ ] 添加多人在线模式
- [ ] 添加排行榜
- [ ] 添加更多游戏模式

## 📝 许可证

MIT License

---

**享受游戏！** 🎮
