#!/bin/bash

# AI or Human? - 一键部署脚本

echo "🚀 开始部署 AI or Human? 到 Cloudflare..."

# 检查是否已安装 wrangler
if ! command -v npx &> /dev/null; then
    echo "❌ 错误：需要先安装 Node.js 和 npm"
    exit 1
fi

# 进入项目目录
cd "$(dirname "$0")"

# 安装依赖（如果还没安装）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 检查是否已登录 Cloudflare
echo "🔐 检查 Cloudflare 登录状态..."
if ! npx wrangler whoami &> /dev/null; then
    echo "⚠️  需要先登录 Cloudflare"
    npx wrangler login
fi

# 部署
echo "🚀 开始部署..."
npx wrangler deploy

echo ""
echo "✅ 部署完成！"
echo ""
echo "🌐 访问你的游戏："
echo "   https://ai-or-human-demo.<your-subdomain>.workers.dev"
echo ""
echo "💡 提示：可以在 Cloudflare Dashboard 中自定义域名"
