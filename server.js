const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)

app.use(express.static(__dirname + "/public"))

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html")
})

io.on("connection", function (socket) {
  console.log("a user connected")
  socket.on("disconnect", function () {
    console.log("user disconnected")
  })
})

http.listen(3000, function () {
  console.log("listening on *:3000")
})