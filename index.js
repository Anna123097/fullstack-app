const { readFileSync } = require("fs")
const { createServer } = require("http")
const { Server } = require("ws")

const httpPort = 1344
const wsPort = 9876 

const server = createServer(handleRequest)

const wsConnections = []
global.wsConnections = wsConnections

const html = readFileSync("index.html").toString()
const css = readFileSync("style.css")
const ico = readFileSync("favicon.ico")
const js = readFileSync("script.js")

let text = ""

const wss = new Server({ port: wsPort })

wss.on("connection", ws => {
  ws.onmessage = msg => wsConnections.filter(wsc => wsc != ws).forEach(wsc => wsc.send(text = msg.data))
  wsConnections.push(ws)
  ws.onclose = () => wsConnections.splice(wsConnections.indexOf(ws), 1)
})

wss.on("listening", () => {
  server.listen(httpPort, () => console.log("http://localhost:" + httpPort))
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
    response.end(js)
  }
  else {
    response.end("error")
  }
  console.log(request, text)
}


function getBody(stream) {
  const chunks = []
  stream.addListener("data", chunk => chunks.push(chunk))
  stream.addListener("end", () => text = Buffer.concat(chunks).toString())
}