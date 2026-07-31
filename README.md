# airport2hell

Airport2hell 是一款将贵机场的虚假宣传送入地狱的工具。

<https://airport2hell.pages.dev>

# 部署

Airport2hell 可以部署为 Cloudflare **Workers** 或 **Pages**，任选其一即可。

## 一键部署

点击下方按钮，登录 Cloudflare 账号后即可一键部署为 Worker：

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xchacha20-poly1305/airport2hell)

## Workers 部署

### 方法一：Wrangler CLI（推荐）

```shell
# 安装 wrangler
npm install wrangler -g

# 部署为 Worker
npx wrangler deploy
```

### 方法二：Dashboard 网页部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，在 “Workers & Pages” 中点击 “Create Worker”。
2. 创建 Worker 后，点击 “Edit Code”。
3. 将项目中的 `_worker.js` 内容复制并替换到编辑器中，保存并部署。

## Pages 部署

### 方法一：Git 连接部署

1. 在 GitHub 上点击 **“Use this template”** 按钮，基于此模版创建一个你自己的 GitHub 仓库。
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
3. 导航到 **Workers & Pages** -> **Create**，选择 **Pages** 标签页，然后点击 **Connect to Git**。
4. 选择并授权你的 GitHub 账号，选择你刚刚创建的仓库，点击 **Begin setup**。
5. 在 **Build settings**（构建设置）中配置如下：
   - **Framework preset**（框架预设）: 选择 `None`。
   - **Build command**（构建命令）: 留空（不填）。
   - **Build output directory**（构建输出目录）: 填写 `.`（即根目录）。
6. 点击 **Save and Deploy**，等待 Cloudflare 部署完成即可。

### 方法二：Wrangler CLI

```shell
# 安装 wrangler
npm install wrangler -g

# 部署为 Pages
npx wrangler pages deploy .
```

# 用法

* 任意路径均可上传。

* `/ip` 获取访问的 IP 地址。

* `/ua` 或 `/user-agent` 获取访问的 User-Agent 信息（路径不区分大小写，无 UA 时返回 400）。

* `/<number>` "number" 为数字，当 200 <= `number` <= 599 时返回对应的 HTTP 状态码。其他时候下载 \<number\> bytes 的文件。

* `/<number><unit>` "number" 为数字，"unit" 为 "k"、 "m" 或 "g"。将下载对应大小的文件。

* `/delay/<status_code>?delay=<delay_range>` `<status_code>` 为期望返回的状态码。delay 表示延迟几秒， 支持直接写整数或区间。示例：`/delay/204?delay=10`, `/delay/200?delay=20-50`.

# 开发

## Workers 开发

```shell
npm install wrangler -g
npx wrangler dev
```

## Pages 开发

```shell
npm install wrangler -g
npx wrangler pages dev .
```
