# 用户认证模块 - 数据库设计文档

## 一、登录页面字段 (`Login.vue`)

| 字段名 | 类型 | 表单类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `username` | String | text | ✅ 是 | 用户登录名 |
| `password` | String | password | ✅ 是 | 用户密码 |
| `remember` | Boolean | checkbox | ❌ 否 | 是否记住登录状态 |

---

## 二、注册页面字段 (`Register.vue`)

| 字段名 | 类型 | 表单类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `username` | String | text | ✅ 是 | 用户名 |
| `email` | String | email | ✅ 是 | 邮箱地址 |
| `password` | String | password | ✅ 是 | 密码（含强度检测） |
| `confirmPassword` | String | password | ✅ 是 | 确认密码 |
| `agree` | Boolean | checkbox | ✅ 是 | 同意用户协议 |

---

## 三、数据库用户表设计 (`users`)

### 表结构

| 字段名 | 类型 | 约束 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | - | 用户唯一标识 |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | - | 用户名 |
| `password` | VARCHAR(255) | NOT NULL | - | 加密后的密码（BCrypt） |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | - | 邮箱地址 |
| `phone` | VARCHAR(20) | NULL | NULL | 手机号码 |
| `role` | VARCHAR(20) | NOT NULL | 'user' | 角色（admin/user） |
| `avatar` | VARCHAR(255) | NULL | NULL | 头像URL |
| `avatar_color` | VARCHAR(50) | NULL | NULL | 头像默认渐变色 |
| `status` | VARCHAR(20) | NOT NULL | 'active' | 状态（active/inactive） |
| `practice_count` | INT | NOT NULL | 0 | 刷题数量 |
| `pass_rate` | DECIMAL(5,2) | NOT NULL | 0 | 通过率 |
| `join_date` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | 注册时间 |
| `updated_at` | DATETIME | ON UPDATE CURRENT_TIMESTAMP | CURRENT_TIMESTAMP | 更新时间 |

### 建表SQL示例

```sql
CREATE TABLE `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20),
  `role` VARCHAR(20) NOT NULL DEFAULT 'user',
  `avatar` VARCHAR(255),
  `avatar_color` VARCHAR(50),
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `practice_count` INT NOT NULL DEFAULT 0,
  `pass_rate` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `join_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 四、认证接口数据结构

### 1. 用户登录

**接口地址**: `POST /auth/login`

**请求体**:
```json
{
  "username": "string (用户名)",
  "password": "string (密码)"
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "string (JWT令牌)",
    "expire": "string (过期时间)",
    "user": {
      "id": "number (用户ID)",
      "username": "string (用户名)",
      "email": "string (邮箱)",
      "phone": "string (手机号)",
      "role": "string (角色)"
    }
  }
}
```

---

### 2. 用户注册

**接口地址**: `POST /auth/register`

**请求体**:
```json
{
  "username": "string (用户名)",
  "password": "string (密码)",
  "email": "string (邮箱)",
  "phone": "string (手机号，可选)"
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "注册成功",
  "data": null
}
```

---

## 五、设计说明

### 密码安全
- 后端需对密码进行加密存储（建议使用 BCrypt，cost 因子建议 10-12）
- 密码长度建议至少 6 位，建议添加强度校验（包含大小写字母、数字、特殊字符）

### 用户名/邮箱唯一
- 数据库添加唯一约束，防止重复注册
- 注册接口需检查用户名和邮箱是否已存在

### 角色管理
- `role` 字段用于区分管理员和普通用户
- 可选值：`admin`（管理员）、`user`（普通用户）

### 用户状态
- `status` 字段用于控制用户账号状态
- 可选值：`active`（正常）、`inactive`（禁用）

### 统计字段
- `practice_count`：记录用户刷题数量
- `pass_rate`：记录用户答题通过率（百分比）