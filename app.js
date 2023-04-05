const express = require("express")
const socketIO = require("socket.io")

// Create an express app
const app = express()

// Connect to the socket.io server
const server = socketIO(app.listen(3000))

// Create a route for creating a new voting session
app.get("/voting-session", (req, res) => {
  // Generate a unique URL for the voting session
  const url = `/voting-session/${Math.random().toString(36).substring(7)}`

  // Create a new socket for the voting session
  const socket = server.sockets.on(url, (socket) => {
    // Add the user to the list of users in the voting session
    socket.join("users")

    // Listen for vote events
    socket.on("vote", (data) => {
      // Add the vote to the list of votes in the voting session
      socket.io.sockets.in(url).emit("votes", {
        name: socket.username,
        value: data.value,
      })
    })
  })

  // Return the URL of the voting session
  res.send(url)
})

// Create a route for joining an existing voting session
app.get("/voting-session/:url", (req, res) => {
  // Check if the URL is valid
  if (!/\/voting-session\/[a-zA-Z0-9]{32}/.test(req.params.url)) {
    res.sendStatus(400)
    return
  }

  // Join the socket for the voting session
  const socket = server.sockets.on(req.params.url, (socket) => {
    // Add the user to the list of users in the voting session
    socket.join("users")

    // Listen for vote events
    socket.on("vote", (data) => {
      // Add the vote to the list of votes in the voting session
      socket.io.sockets.in(req.params.url).emit("votes", {
        name: socket.username,
        value: data.value,
      })
    })
  })

  // Return the list of users in the voting session
  res.send(socket.io.sockets.in(req.params.url).list())
})

// Create a route for voting on a story point
app.post("/voting-session/:url/vote", (req, res) => {
  // Check if the URL is valid
  if (!/\/voting-session\/[a-zA-Z0-9]{32}/.test(req.params.url)) {
    res.sendStatus(400)
    return
  }

  // Check if the user is already in the voting session
  if (!socket.io.sockets.in(req.params.url).has(req.body.username)) {
    res.sendStatus(403)
    return
  }

  // Add the vote to the list of votes in the voting session
  socket.io.sockets.in(req.params.url).emit("votes", {
    name: req.body.username,
    value: req.body.value,
  })

  // Return the list of votes in the voting session
  res.send(socket.io.sockets.in(req.params.url).list())
})

// Start the server
app.listen(3000)
