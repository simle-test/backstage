# 智能题库系统 - 后端接口文档

## 概述

本文档定义了智能题库系统前端所需的后端 API 接口规范，用于支持用户认证、题目管理、题库管理、用户管理和统计分析等功能。

---

## 基础信息

- **基础 URL**: `http://localhost:3000/api`
- **认证方式**: JWT Token（放在请求头 `Authorization: Bearer <token>`）
- **数据格式**: JSON
- **字符编码**: UTF-8

---

## 目录

1. [认证模块](#1-认证模块)
2. [用户管理模块](#2-用户管理模块)
3. [题目管理模块](#3-题目管理模块)
4. [题库模块](#4-题库模块)
5. [统计模块](#5-统计模块)

---

## 1. 认证模块

### 1.1 用户登录

**接口地址**: `POST /auth/login`

**请求体**:
```json
{
  "username": "string (必填, 用户名)",
  "password": "string (必填, 密码)",
  "remember": "boolean (可选, 是否记住登录)"
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "string (JWT令牌)",
    "user": {
      "id": "number (用户ID)",
      "username": "string (用户名)",
      "email": "string (邮箱)",
      "role": "string (角色: user/admin/vip)",
      "avatar": "string (头像)"
    }
  }
}
```

**失败响应** (401):
```json
{
  "code": 401,
  "message": "用户名或密码错误"
}
```

---

### 1.2 用户注册

**接口地址**: `POST /auth/register`

**请求体**:
```json
{
  "username": "string (必填, 用户名)",
  "email": "string (必填, 邮箱)",
  "password": "string (必填, 密码)"
}
```

**成功响应** (201):
```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "id": "number (用户ID)",
    "username": "string (用户名)",
    "email": "string (邮箱)",
    "role": "string (角色, 默认user)"
  }
}
```

**失败响应** (400):
```json
{
  "code": 400,
  "message": "用户名已存在"
}
```

---

## 2. 用户管理模块

### 2.1 获取用户列表

**接口地址**: `GET /users`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| size | number | 否 | 每页数量，默认10 |
| keyword | string | 否 | 搜索关键词 |
| role | string | 否 | 角色筛选 |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "number (用户ID)",
        "username": "string (用户名)",
        "email": "string (邮箱)",
        "role": "string (角色)",
        "roleText": "string (角色中文)",
        "solved": "number (刷题数)",
        "passRate": "number (通过率)",
        "joinDate": "string (注册时间)",
        "status": "string (状态: active/inactive/banned)",
        "statusText": "string (状态中文)",
        "avatar": "string (头像首字)",
        "color": "string (头像颜色)"
      }
    ],
    "total": "number (总数)",
    "page": "number (当前页)",
    "size": "number (每页数量)"
  }
}
```

---

### 2.2 获取用户统计

**接口地址**: `GET /users/statistics`

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": "number (总用户数)",
    "active": "number (活跃用户数)",
    "todayNew": "number (今日新增)",
    "retentionRate": "number (留存率%)"
  }
}
```

---

### 2.3 添加用户

**接口地址**: `POST /users`

**请求体**:
```json
{
  "username": "string (必填, 用户名)",
  "email": "string (必填, 邮箱)",
  "password": "string (必填, 密码)",
  "role": "string (可选, 角色)"
}
```

**成功响应** (201):
```json
{
  "code": 201,
  "message": "添加成功",
  "data": "用户对象"
}
```

---

### 2.4 更新用户

**接口地址**: `PUT /users/:id`

**请求体**:
```json
{
  "username": "string (可选, 用户名)",
  "email": "string (可选, 邮箱)",
  "role": "string (可选, 角色)",
  "status": "string (可选, 状态)"
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "更新成功"
}
```

---

### 2.5 删除用户

**接口地址**: `DELETE /users/:id`

**成功响应** (200):
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 3. 题目管理模块

### 3.1 获取题目列表

**接口地址**: `GET /questions`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| size | number | 否 | 每页数量，默认10 |
| keyword | string | 否 | 搜索关键词 |
| difficulty | string | 否 | 难度筛选: easy/medium/hard |
| category | string | 否 | 分类筛选 |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "number (题目ID)",
        "title": "string (题目标题)",
        "difficulty": "string (难度)",
        "difficultyText": "string (难度中文)",
        "category": "string (分类)",
        "passRate": "number (通过率)",
        "status": "string (状态: active/draft)",
        "statusText": "string (状态中文)"
      }
    ],
    "total": "number (总数)",
    "page": "number (当前页)",
    "size": "number (每页数量)"
  }
}
```

---

### 3.2 获取题目统计

**接口地址**: `GET /questions/statistics`

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": "number (题目总数)",
    "easy": "number (简单题数)",
    "medium": "number (中等题数)",
    "hard": "number (困难题数)",
    "trend": "number (增长趋势%)"
  }
}
```

---

### 3.3 添加题目

**接口地址**: `POST /questions`

**请求体**:
```json
{
  "title": "string (必填, 题目标题)",
  "content": "string (必填, 题目内容)",
  "options": "array (必填, 选项列表)",
  "answer": "string (必填, 正确答案)",
  "difficulty": "string (必填, 难度: easy/medium/hard)",
  "category": "string (必填, 分类)",
  "analysis": "string (可选, 解析)"
}
```

**成功响应** (201):
```json
{
  "code": 201,
  "message": "添加成功",
  "data": "题目对象"
}
```

---

### 3.4 更新题目

**接口地址**: `PUT /questions/:id`

**请求体**:
```json
{
  "title": "string (可选, 题目标题)",
  "content": "string (可选, 题目内容)",
  "options": "array (可选, 选项列表)",
  "answer": "string (可选, 正确答案)",
  "difficulty": "string (可选, 难度)",
  "category": "string (可选, 分类)",
  "analysis": "string (可选, 解析)",
  "status": "string (可选, 状态)"
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "更新成功"
}
```

---

### 3.5 删除题目

**接口地址**: `DELETE /questions/:id`

**成功响应** (200):
```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

### 3.6 获取题目详情

**接口地址**: `GET /questions/:id`

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "number (题目ID)",
    "title": "string (题目标题)",
    "content": "string (题目内容)",
    "options": [
      "string (选项A)",
      "string (选项B)",
      "string (选项C)",
      "string (选项D)"
    ],
    "answer": "string (正确答案)",
    "difficulty": "string (难度: easy/medium/hard)",
    "difficultyText": "string (难度中文)",
    "category": "string (分类)",
    "analysis": "string (解析)",
    "passRate": "number (通过率)",
    "status": "string (状态: active/draft)",
    "statusText": "string (状态中文)",
    "createTime": "string (创建时间)",
    "updateTime": "string (更新时间)"
  }
}
```

**失败响应** (404):
```json
{
  "code": 404,
  "message": "题目不存在"
}
```

---

## 4. 题库模块

### 4.1 获取题库列表

**接口地址**: `GET /banks`

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "number (题库ID)",
      "name": "string (题库名称)",
      "desc": "string (题库描述)",
      "color": "string (主题颜色)",
      "count": "number (题目数量)",
      "updateTime": "string (更新时间)"
    }
  ]
}
```

---

### 4.2 获取题库详情

**接口地址**: `GET /banks/:id`

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "number (题库ID)",
    "name": "string (题库名称)",
    "desc": "string (题库描述)",
    "color": "string (主题颜色)",
    "questions": "array (题目列表)",
    "count": "number (题目数量)"
  }
}
```

---

### 4.3 新建题库

**接口地址**: `POST /banks`

**请求体**:
```json
{
  "name": "string (必填, 题库名称)",
  "desc": "string (可选, 题库描述)",
  "color": "string (可选, 主题颜色)"
}
```

**成功响应** (201):
```json
{
  "code": 201,
  "message": "创建成功",
  "data": "题库对象"
}
```

---

### 4.4 更新题库

**接口地址**: `PUT /banks/:id`

**请求体**:
```json
{
  "name": "string (可选, 题库名称)",
  "desc": "string (可选, 题库描述)",
  "color": "string (可选, 主题颜色)"
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "更新成功"
}
```

---

## 5. 统计模块

### 5.1 获取综合统计

**接口地址**: `GET /statistics`

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalQuestions": "number (总题数)",
    "totalSubmissions": "number (总提交)",
    "totalUsers": "number (总用户)",
    "avgPassRate": "number (平均通过率%)"
  }
}
```

---

### 5.2 获取每日提交趋势

**接口地址**: `GET /statistics/daily`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| days | number | 否 | 天数，默认7 |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": [
    { "day": "string (日期)", "value": "number (提交数)" }
  ]
}
```

---

### 5.3 获取模块得分分布

**接口地址**: `GET /statistics/categories`

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "speech": "number (言语理解正确率%)",
    "logic": "number (判断推理正确率%)",
    "data": "number (资料分析正确率%)"
  }
}
```

---

### 5.4 获取刷题排行榜

**接口地址**: `GET /statistics/ranking`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | number | 否 | 数量，默认10 |

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "number (用户ID)",
      "name": "string (用户名)",
      "avatar": "string (头像首字)",
      "color": "string (头像颜色)",
      "desc": "string (用户描述)",
      "solved": "number (刷题数)"
    }
  ]
}
```

---

## 错误响应格式

```json
{
  "code": "number (错误码)",
  "message": "string (错误信息)",
  "data": "any (可选, 错误详情)"
}
```

**常见错误码**:
| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 附录

### 题目分类列表

| 分类 | 说明 |
|------|------|
| 言语理解 | 选词填空、片段阅读、语句表达 |
| 数量关系 | 数字推理、数学运算 |
| 判断推理 | 图形推理、定义判断、类比推理、逻辑判断 |
| 资料分析 | 速算技巧、统计术语 |
| 常识判断 | 政治、经济、法律、历史、地理、科技 |

### 用户角色

| 角色 | 说明 |
|------|------|
| user | 普通用户 |
| vip | VIP用户 |
| admin | 管理员 |

### 题目难度

| 难度 | 说明 |
|------|------|
| easy | 简单 |
| medium | 中等 |
| hard | 困难 |
