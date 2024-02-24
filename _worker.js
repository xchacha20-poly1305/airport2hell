export function onRequest(context) {
  return handleRequest(context)
}

async function handleRequest(context) {
  // const url = new URL(request.url)
  const path = context.functionPath

  if (isNaN(parseInt(path.slice(1)))) {
    switch (path) {
      case "/ip":
        const ip = request.headers.get('cf-connecting-ip')
        if (ip) {
          return new Response(ip, { status: 200 })
        } else {
          return new Response('IP not available', { status: 404 })
        }
      default:
        return new Response('Invalid path', { status: 400 })
    }

  } else {
    const value = parseInt(path.slice(1))
    if (value <= 128) {
      // Generate data for the file
      const data = new Uint8Array(value * 1024 * 1024) // Convert MB to bytes

      // Create a Blob from the data
      const blob = new Blob([data])

      // Create a Response with the Blob
      return new Response(blob, {
        headers: {
          'Content-Disposition': `attachment; filename=random_${value}mb.dat`,
          'Content-Type': 'application/octet-stream',
        },
      })
    } else {
      return new Response(null, { status: value })
    }
  }
}
