export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    switch (path) {
      case "/":
        return Response.redirect('https://github.com/xchacha20-poly1305/airport2hell', 302);
      case "/ip":
        const ip = request.headers.get('cf-connecting-ip');
        if (ip) {
          return new Response(ip, { status: 200 });
        } else {
          return new Response('IP not available', { status: 404 });
        }
    }

    // https://github.com/cmliu/CF-Workers-SpeedTestURL/blob/40c2c83cc3a226e23e03426d848ee6a90ae7178b/_worker.js

    // 以数字开头，以字母结尾
    const regex = /^(\d+)([a-z]?)$/i;
    const match = path.substring(1).match(regex);
    if (!match) {
      return new Response("invaild path", { status: 400 });
    }

    const bytesStr = match[1];
    const unit = match[2].toLowerCase();

    // 转换单位
    let bytes = parseInt(bytesStr, 10);
    switch (unit) {
      case "":
        if (200 <= bytesStr && bytesStr <= 599) {
          return new Response(null, { statue: bytesStr });
        }
        break;
      case "k":
        bytes *= 1000;
        break;
      case "m":
        bytes *= 1000000;
        break;
      case "g":
        bytes *= 1000000000;
        break;
    }


    const targetUrl = `http://speed.cloudflare.com/__down?bytes=${bytes}`;
    const cfRequest = new Request(targetUrl, request);

    return await fetch(cfRequest);
  }
}
