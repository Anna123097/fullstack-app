const httpPort = 1344 
const textarea = document.getElementById("textarea")

textarea.addEventListener("input", handleChange)

const ws = new WebSocket(`ws${location.protocol.slice(4)}//${location.hostname}:${httpPort}`)

ws.onmessage = msg => textarea.value = msg.data

function handleChange() {
  ws.send(textarea.value)
}