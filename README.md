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

* `/<number>` "number" 为数字，当 `number` <=128 时将下载 \<number\> MB 的文件（Cloudflare 有文件大小限制？）；其他时候将返回对应的 HTTP 状态码。