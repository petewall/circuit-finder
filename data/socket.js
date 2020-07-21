const socketPort = 1337
const socket = new ReconnectingWebSocket(
  `ws://${window.location.hostname}:${socketPort}`,
  'echo-protocol',
  { reconnectInterval: 1000 }
)

let pingTimeout
function heartbeat() {
  socket.send("ping")
  clearTimeout(pingTimeout)
  pingTimeout = setTimeout(() => {
    disconnected()
  }, 900)
}

let heartbeatTimeout
function startHeartbeat() {
  heartbeatTimeout = setInterval(heartbeat, 1000)
}

function connected() {
  $('body').addClass('connected')
  startHeartbeat()
}

function disconnected() {
  $('body').removeClass('connected')
  clearInterval(heartbeatTimeout)
}

socket.onopen = connected
socket.onmessage = function(event) {
  clearTimeout(pingTimeout)
}
socket.onclose = disconnected
socket.onerror = disconnected
