# airport2hell

Airport2hell 是一款让您机场的劫持失效的工具。

# 部署

复制 [_worker.js](./_worker.js) 到 Cloudflare Woreker 中。

# 用法

* `/ip` 获取访问的 IP 地址。

* `/<number>` "number" 为数字，当 `number` <=128 时将下载 \<number\> MB 的文件（Cloudflare 有文件大小限制？）；其他时候将返回对应的 HTTP 状态码。