# React Shop 前端项目

这是一个基于React 18和Ant Design的电商前端项目，用于连接后端RPC服务。

## 项目特点

- 使用React 18和Ant Design构建的现代UI界面
- 采用RESTful API设计连接后端RPC服务
- 响应式布局，支持多种设备
- 完整的电商流程：首页、商品列表、商品详情、购物车、结账流程等

## 项目结构

```
src/
  ├── api/           # API接口
  ├── components/    # 公共组件
  ├── pages/         # 页面组件
  ├── assets/        # 静态资源
  ├── utils/         # 工具函数
  ├── styles/        # 样式文件
  ├── contexts/      # React上下文
  ├── hooks/         # 自定义Hooks
  ├── App.js         # 主应用
  └── index.js       # 入口文件
```

## 安装与启动

### 前置条件

- Node.js v16+
- npm v8+

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

## 后端接口

该前端项目设计为通过RESTful API连接Triple提供的双接口RPC服务。主要使用的API包括：

- 产品目录API: `/api/products`
- 购物车API: `/api/cart`
- 结账API: `/api/checkout`

## 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

MIT 