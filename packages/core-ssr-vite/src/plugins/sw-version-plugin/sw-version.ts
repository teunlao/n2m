// @ts-nocheck
// injected via sw-plugin
const commitHash = '__GIT_COMMIT_HASH__'

self.addEventListener('install', () => {
  self.skipWaiting()
  console.log('sw installed: v=', commitHash)
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE',
            message: 'A new version of the app is available.',
            commitHash: commitHash,
          })
        })
      })
    })
  )
  console.log('sw activated: v=', commitHash)
})

self.addEventListener('fetch', (event: any) => {
  if (
    event.request.url.match(/\/(assets|images|icons)\/.*\.(js|css|png|jpg|jpeg|svg)$/) ||
    event.request.url.includes('client-entry.js')
  ) {
    event.respondWith(requestFetch(event))
  }
})

function requestFetch(event: any) {
  const url = new URL(event.request.url)
  url.searchParams.set('v', commitHash)

  const newRequest = new Request(url, {
    method: event.request.method,
    headers: event.request.headers,
    credentials: event.request.credentials,
    redirect: event.request.redirect,
    mode: 'cors',
  })

  return fetch(newRequest).then((response) => {
    const clonedResponse = response.clone()

    const newHeaders = new Headers(clonedResponse.headers)
    newHeaders.append('Cache-Control', 'public, max-age=604800, must-revalidate')
    newHeaders.append('x-version', commitHash)

    return new Response(clonedResponse.body, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers: newHeaders,
    })
  })
}
