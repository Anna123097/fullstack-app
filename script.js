const textarea = document.getElementById("textarea")

textarea.addEventListener("input", handleChange)

const ws = new WebSocket ("ws://localhost:9876")



ws.onmessage = msg => textarea.value = msg.data



function handleChange() {
    ws.send(textarea.value)
  }