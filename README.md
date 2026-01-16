# 📝 ESA 在线便签 - Edge Notes

基于阿里云ESA边缘计算的在线便签服务

[🖥️ 在线演示](#) | [📖 GitHub](#)

---

## 💡 项目介绍

### 🎯 应用价值
- ✅ **即用型服务**：部署后立即可用，无需配置
- ✅ **快速分享**：一键生成分享链接
- ✅ **Markdown支持**：支持基本Markdown格式
- ✅ **阅后即焚**：支持阅读后自动销毁
- ✅ **全球加速**：基于ESA边缘节点，全球访问超快

### ✨ 创意卓越
- 🎨 **现代化UI**：清爽简洁的界面设计
- 📱 **响应式设计**：完美适配各种设备
- 💬 **Toast通知**：优雅的通知提示
- ⚡ **快速便捷**：无需注册，即刻使用

### 🔥 技术探索
完整使用阿里云ESA边缘生态产品：
- **ESA Pages 静态托管**
- **ESA 边缘函数 (Edge Functions)**
- **ESA Edge KV 存储**

---

## ✨ 核心功能

- 📝 **快速创建便签** - 输入内容，一键生成分享链接
- 🎯 **Markdown支持** - 支持基本Markdown格式（粗体、斜体、代码）
- ⏰ **过期时间** - 支持设置有效期（1小时/1天/7天/30天/永久）
- 🔥 **阅后即焚** - 阅读后自动销毁，保护隐私
- 📋 **一键复制** - 快速复制内容到剪贴板
- 🌍 **全球加速** - 基于ESA边缘节点，全球访问超快

---

## 🚀 快速开始

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/你的用户名/esa-notes.git
   cd esa-notes
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **构建生产版本**
   ```bash
   npm run build
   ```

### 部署到 ESA Pages

1. **在 ESA 控制台创建 Edge KV 命名空间**
   - 命名空间名称：`notes_storage`

2. **推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/esa-notes.git
   git push -u origin main
   ```

3. **在 ESA Pages 控制台关联 GitHub 仓库**
   - ESA 会自动读取 `esa.jsonc` 配置并构建部署

---

## 📦 技术栈

- **前端框架**: Vue 3
- **路由管理**: Vue Router 4
- **构建工具**: Vite
- **边缘计算**: 阿里云 ESA Edge Functions
- **数据存储**: 阿里云 ESA Edge KV
- **部署平台**: 阿里云 ESA Pages

---

## 📁 项目结构

```
esa-notes/
├── index.html
├── package.json
├── vite.config.js
├── esa.jsonc              # ESA Pages 配置
└── src/
    ├── main.js
    ├── App.vue
    ├── style.css
    ├── edge-function.js   # ESA 边缘函数
    ├── components/
    │   └── Toast.vue
    └── views/
        ├── Home.vue       # 创建便签
        └── ViewNote.vue   # 查看便签
```

---

## 🎯 技术亮点

1. **完整的边缘计算架构**
   - ESA Pages 静态托管
   - ESA Edge Functions 实现后端 API
   - ESA Edge KV 实现数据持久化

2. **全球分布式部署**
   - 数据存储在全球边缘节点
   - 用户访问就近节点，低延迟

3. **现代化开发体验**
   - Vue 3 Composition API
   - Vite 快速构建
   - 简洁的代码结构

---

## 📖 使用说明

### 创建便签
1. 访问首页
2. 输入便签内容（支持Markdown）
3. 可选：设置标题、过期时间、阅后即焚
4. 点击"创建便签"
5. 复制生成的链接分享给他人

### 查看便签
1. 打开分享链接
2. 查看便签内容
3. 可复制内容到剪贴板

---

## 🌟 项目特色

1. **边缘计算优势**：利用ESA边缘节点，全球访问速度快
2. **实用性强**：部署即用，适合临时文本分享
3. **技术完整**：完整使用ESA生态（Pages + Functions + KV）
4. **界面美观**：现代化清爽设计
5. **开源免费**：MIT协议

---

## 📄 开源协议

MIT License

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**

**🏆 参赛项目：阿里云ESA Pages 边缘开发大赛**
