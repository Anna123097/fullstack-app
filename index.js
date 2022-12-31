const { readFileSync } = require("fs")
const { createServer } = require("http")
const { Server } = require("ws")

const httpPort = process.env.PORT || 1344
const wsConnections = []
const server = createServer(handleRequest)
const wss = new Server({ noServer: true })

const html = readFileSync("index.html", 'utf8')
const css = readFileSync("style.css")
const ico = readFileSync("favicon.ico")
const js = readFileSync("script.js", 'utf8')

let text = ""

server.listen(httpPort, () => console.log("http://localhost:" + httpPort))

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    ws.onclose = () => wsConnections.splice(wsConnections.indexOf(ws), 1)
    ws.onmessage = msg => wsConnections.filter(wsc => wsc != ws).forEach(wsc => wsc.send(text = msg.data))
    wsConnections.push(ws)
  })
})

function handleRequest(request, response) {
  if (request.url == "/" || request.url == "/index.html") {
    if (request.method == "POST") {
      getBody(request)
      response.end("")
    }
    else {
      const i = html.indexOf(`</textarea>`)
      const htmlWithText = html.slice(0, i) + text + html.slice(i)
      response.end(htmlWithText)
    }
  }

  else if (request.url == "/style.css") {
    response.end(css)
  }
  else if (request.url == "/favicon.ico") {
    response.end(ico)
  }
  else if (request.url == "/script.js") {
    response.end(js.replace('{httpPort}', httpPort))
  }
  else {
    response.end("error")
  }
  
}

function getBody(stream) {
  const chunks = []
  stream.addListener("data", chunk => chunks.push(chunk))
  stream.addListener("end", () => text = Buffer.concat(chunks).toString())
}