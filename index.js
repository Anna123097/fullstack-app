const { readFileSync } = require("fs")
const { createServer } = require("http")
const { Server } = require("ws")

const server = createServer(handleRequest)

const html = readFileSync("index.html").toString()
const css = readFileSync("style.css")
const ico = readFileSync("favicon.ico")
const js = readFileSync("script.js")

let text = ""

server.listen(1344, () => console.log("server started at http://localhost:1344"))

const wss = new Server({ port: 1455 })

wss.on("connection", handleConnection)

function handleConnection(ws){
  ws.send("hello from server")

  ws.on("message", (message)=>{
    console.log(message.toString())
  })
}

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