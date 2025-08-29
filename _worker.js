// per chunk size should not reach worker's memory limit
// https://developers.cloudflare.com/workers/platform/limits
const MAX_CHUNK_SIZE = 1024 * 1024 * 10; // 10MB

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Ignore all upload data
    await drainBody(request);

    switch (path) {
      case "/":
        return Response.redirect('https://github.com/xchacha20-poly1305/airport2hell', 302);
      case "/ip": {
        const ip = request.headers.get('cf-connecting-ip');
        if (ip) {
          return new Response(ip, { status: 200 });
        } else {
          return new Response('IP not available', { status: 502 });
        }
      }
    }

    // https://github.com/cmliu/CF-Workers-SpeedTestURL/blob/40c2c83cc3a226e23e03426d848ee6a90ae7178b/_worker.js

    // 以数字开头，以字母结尾
    const regex = /^(\d+)([a-z]?)$/i;
    const match = path.substring(1).match(regex);
    if (!match) {
      return new Response("invalid path", { status: 400 });
    }

    const bytesStr = match[1];
    const unit = match[2].toLowerCase();

    // 转换单位
    let bytes = parseInt(bytesStr, 10);
    switch (unit) {
      case "":
        if (200 <= bytes && bytes <= 599) {
          return new Response(null, { status: bytesStr });
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


    // https://github.com/alsotang/cf_workers__file/blob/f2a81dcda59b191ea8e510eef11af30d99c15f6e/src/handler.ts

    let sendedSize = 0;

    const { readable, writable } = new FixedLengthStream(bytes);

    // return the readable first, then write to it
    setTimeout(async () => {
      const MAX_CHUNK = new Uint8Array(MAX_CHUNK_SIZE);
      const writer = writable.getWriter();

      // use stream to keep memory usage small enough
      while (sendedSize < bytes) {
        const chunkSize = Math.min(bytes - sendedSize, MAX_CHUNK_SIZE);
        if (chunkSize === MAX_CHUNK_SIZE) {
          await writer.write(MAX_CHUNK);
        } else {
          await writer.write(new Uint8Array(chunkSize))
        }
        sendedSize += chunkSize;
      }

      writer.close();
    }, 0);

    return new Response(readable, {
      headers: {
        'Content-Disposition': 'attachment; filename="file.bin"',
      }
    })
  }
}

async function drainBody(request) {
  if (request.body) {
    const reader = request.body.getReader();
    try {
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }
    } catch (e) {
    }
  }
}