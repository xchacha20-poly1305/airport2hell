// per chunk size should not reach worker's memory limit
// https://developers.cloudflare.com/workers/platform/limits
const MAX_CHUNK_SIZE = 1024 * 1024 * 10; // 10MB

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const normalizedPath = path.toLowerCase();

    // Ignore all upload data
    await drainBody(request);

    switch (normalizedPath) {
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
      case "/ua":
      case "/user-agent": {
        const ua = request.headers.get('user-agent');
        if (ua) {
          return new Response(ua, { status: 200 });
        } else {
          return new Response('User-Agent not available', { status: 400 });
        }
      }
    }

    if (normalizedPath.startsWith('/delay/')) {
      const statusStr = normalizedPath.substring('/delay/'.length);
      const statusCode = parseInt(statusStr, 10);

      if (!isValidStatusCode(statusStr, statusCode)) {
        return new Response("invalid status code", { status: 400 });
      }

      const delayParam = url.searchParams.get('delay');
      const { delayMs, error } = parseDelay(delayParam);

      if (error) {
        return new Response(error, { status: 400 });
      }

      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

      return new Response(null, { status: statusCode });
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
        if (isValidStatusCode(bytes)) {
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

function isValidStatusCode(statusStr, statusCode) {
  return !isNaN(statusCode) && statusStr === statusCode.toString() && statusCode >= 200 && statusCode <= 599;
}

function parseDelay(delayParam) {
  if (!delayParam) return { delayMs: 0, error: null };

  let delayMs = 0;
  const parts = delayParam.split('-');

  if (parts.length === 1) {
    const val = parseInt(parts[0], 10);
    if (!isNaN(val)) delayMs = val;
  } else if (parts.length === 2) {
    const min = parseInt(parts[0], 10);
    const max = parseInt(parts[1], 10);
    if (!isNaN(min) && !isNaN(max)) {
      const actualMin = Math.min(min, max);
      const actualMax = Math.max(min, max);

      if (actualMax > 30000) {
        return { delayMs: 0, error: "delay too large" };
      }
      delayMs = Math.floor(Math.random() * (actualMax - actualMin + 1)) + actualMin;
    }
  }

  if (delayMs > 30000) {
    return { delayMs: 0, error: "delay too large" };
  }

  return { delayMs, error: null };
}
