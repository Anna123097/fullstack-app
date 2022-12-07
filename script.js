const textarea = document.getElementById("textarea")

textarea.addEventListener("change", handleChange)

connect()

function connect(){
  const ws = new WebSocket('ws://localhost:1455')

  ws.onopen = ()=>{
    console.log("connection established")

    ws.send("hi from client")
  }

  ws.onmessage = (e)=>{
    console.log(e.data)
  }

  ws.onclose = ()=>{
    console.log("connection dropped")
  }
}

function handleChange(){
  const options = {method: "post", body: textarea.value}
  
  fetch("http://localhost:1344", options)
}