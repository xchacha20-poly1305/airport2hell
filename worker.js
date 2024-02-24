addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname

  if (isNaN(parseInt(path.slice(1)))) {
    if (path === '/ip') {
      const ip = request.headers.get('cf-connecting-ip')
      if (ip) {
        return new Response(ip, { status: 200 })
      } else {
        return new Response('IP not available', { status: 404 })
      }
    } else {
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
