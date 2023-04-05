const socket = io()

const newSessionForm = document.getElementById("new-session-form")

const createSession = async () => {
  try {
    const response = await fetch("/create-session", {
      method: "POST",
    })
    const { sessionId } = await response.json()
    window.location.href = `/session/${sessionId}`
  } catch (error) {
    console.error(error)
  }
}

const handleSubmit = (event) => {
  event.preventDefault()
  createSession()
}
