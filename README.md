# airport2hell

Airport2hell 是一款将贵机场的虚假宣传送入地狱的工具。

<https://airport2hell.pages.dev>

# 部署

## Workers

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xchacha20-poly1305/airport2hell)

## Pages

点击 “Use this template” 后连接到 Cloudflare。

# 用法

* `/ip` 获取访问的 IP 地址。

* `/<number>` "number" 为数字，当 200 <= `number` <= 599 时返回对应的 HTTP 状态码。其他时候下载 \<number\> bytes 的文件。

* `/<number><unit>` "number" 为数字，"unit" 为 "k"、 "m" 或 "g"。将下载对应大小的文件。

# 开发

```shell
npm install wrangler -g

npx wrangler pages dev .
```