# 数据管理系统 (Data Management System)

基于 **Nuxt.js 3** + **Nitro** + **PostgreSQL** 的全栈数据管理系统，支持完整的数据增删改查(CRUD)操作。

## 技术栈

| 类别 | 技术 |
|------|------|
| 包管理 | pnpm |
| 前端框架 | Nuxt.js 3 (Vue 3 + Composition API) |
| 服务端引擎 | Nitro |
| 数据库 | PostgreSQL (Neon Serverless) |
| 测试 | Vitest |
| 部署 | Netlify + GitHub Actions |
| 语言 | TypeScript |

## 功能特性

- **数据表格展示**：分页加载、按列排序、搜索过滤、记录统计
- **添加数据**：表单提交与字段验证
- **编辑数据**：弹窗编辑模式，预填充现有数据
- **删除数据**：二次确认机制，防止误操作
- **查看详情**：展示完整记录信息
- **响应式设计**：适配桌面和移动设备
- **加载状态**：操作反馈与错误提示

## 项目结构

```
my-ssr/
├── .github/workflows/deploy.yml       # GitHub Actions 部署配置
├── components/
│   ├── ConfirmDialog.vue              # 删除确认对话框
│   ├── DataTable.vue                  # 数据表格组件
│   ├── ItemDetail.vue                 # 详情查看弹窗
│   ├── ItemForm.vue                   # 添加/编辑表单弹窗
│   ├── Pagination.vue                 # 分页组件
│   └── SearchBar.vue                  # 搜索过滤组件
├── composables/
│   └── useItems.ts                    # 数据操作组合式函数
├── pages/
│   └── index.vue                      # 主页面
├── server/
│   ├── api/items/
│   │   ├── index.get.ts               # GET - 列表查询（分页/搜索/排序）
│   │   ├── index.post.ts              # POST - 创建数据
│   │   ├── [id].get.ts               # GET - 单条查询
│   │   ├── [id].put.ts               # PUT - 更新数据
│   │   └── [id].delete.ts            # DELETE - 删除数据
│   ├── db/
│   │   ├── index.ts                   # 数据库连接池管理
│   │   └── schema.ts                  # 表结构自动创建
│   └── utils/
│       └── validation.ts              # 请求验证工具
├── tests/
│   └── validation.test.ts             # 单元测试
├── types/
│   └── index.ts                       # TypeScript 类型定义
├── app.vue                            # 应用根组件
├── nuxt.config.ts                     # Nuxt 配置
├── vitest.config.ts                   # 测试配置
├── .env.example                       # 环境变量示例
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 8

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd my-ssr

# 安装依赖
pnpm install
```

### 配置数据库

复制 `.env.example` 为 `.env`，配置你的 PostgreSQL 数据库连接：

```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=verify-full
```

> 数据库表结构会在首次 API 调用时自动创建。

### 开发模式

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
```

### 运行测试

```bash
pnpm test
```

## API 接口文档

### 获取数据列表

```
GET /api/items?page=1&pageSize=10&search=关键词&sortBy=id&sortOrder=DESC
```

### 创建数据

```
POST /api/items
Body: { "name": "名称", "description": "描述", "status": "active" }
```

### 获取单条数据

```
GET /api/items/:id
```

### 更新数据

```
PUT /api/items/:id
Body: { "name": "新名称", "status": "inactive" }
```

### 删除数据

```
DELETE /api/items/:id
```

### 数据字段

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 自增主键 |
| name | string | 名称（必填，最长255字符） |
| description | string | 描述（可选） |
| status | string | 状态：active/inactive/draft/archived |
| created_at | string | 创建时间（ISO 8601） |
| updated_at | string | 更新时间（ISO 8601） |

## 部署

### Vercel 部署

1. 在 Vercel 中创建项目，获取 `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` 和 `VERCEL_TOKEN`
2. 在 GitHub 仓库 Secrets 中添加：
   - `DATABASE_URL` - 数据库连接地址
   - `VERCEL_ORG_ID` - Vercel 组织 ID
   - `VERCEL_PROJECT_ID` - Vercel 项目 ID
   - `VERCEL_TOKEN` - Vercel 认证令牌
3. 推送代码到相应分支，GitHub Actions 会自动构建并部署

## 许可证

MIT