const textarea = document.getElementById("textarea")

textarea.addEventListener("change", handleChange)

function handleChange(){
  const options = {method: "post", body: textarea.value}
  
  fetch("http://localhost:1344", options)
}