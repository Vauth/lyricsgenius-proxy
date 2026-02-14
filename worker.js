export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const TARGETS = {
      "/root": "https://api.genius.com/",
      "/public": "https://genius.com/api/",
      "/web": "https://genius.com/"
    };

    let targetKey = null;
    const sortedKeys = Object.keys(TARGETS).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
      if (path.startsWith(key)) {
        targetKey = key;
        break;
      }
    }

    if (!targetKey) {
      return new Response("Not Found", { status: 404 });
    }

    const upstreamBase = TARGETS[targetKey];
    const remainingPath = path.slice(targetKey.length);

    const cleanBase = upstreamBase.replace(/\/+$/, "");
    const cleanPath = remainingPath.replace(/^\/+/, "");

    const destinationUrl = new URL(`${cleanBase}/${cleanPath}${url.search}`);

    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.set("Host", destinationUrl.hostname);

    const hopByHopHeaders = [
      "keep-alive", "transfer-encoding", "te", "connection", "trailer", "upgrade",
      "proxy-authorization", "proxy-authenticate"
    ];
    hopByHopHeaders.forEach(h => proxyHeaders.delete(h));

    const method = request.method.toUpperCase();
    const hasBody = !["GET", "HEAD"].includes(method);

    const proxyRequest = new Request(destinationUrl, {
      method: method,
      headers: proxyHeaders,
      body: hasBody ? request.body : null,
      redirect: "manual"
    });

    try {
      const response = await fetch(proxyRequest);

      const responseHeaders = new Headers(response.headers);
      responseHeaders.delete("content-encoding");
      responseHeaders.delete("content-length");
      hopByHopHeaders.forEach(h => responseHeaders.delete(h));

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      });

    } catch (e) {
      return new Response("Proxy Error: Bad Gateway", { status: 502 });
    }
  },
};
