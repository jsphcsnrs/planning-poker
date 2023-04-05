const socket = io()

document.getElementById("vote-form").addEventListener("submit", function (event) {
  event.preventDefault()
  const name = document.getElementsByName("name")[0].value
  const points = document.getElementsByName("points")[0].value
  socket.emit("vote", { name: name, points: points })
})

socket.on("vote-count", function (count) {
  document.getElementById("vote-count").innerHTML = count
})
