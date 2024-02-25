const WebSocket = require('ws')

module.exports = {
  startWebSocket,
  closeAllSockets,
}

function closeAllSockets() {
  sockets.forEach(s => s.close())
}

const sockets = []
function startWebSocket(ip, onMessage) {
  let ws
  function start() {
    ws = new WebSocket(`ws://${ip}`)
    sockets.push(ws)

    ws.on('error', console.error)
    ws.on('open', () => {
      //ws.send('something');
      console.log(`open!`)
      keepAlive()
    })

    ws.on('message', (data, isBinary) => {
      data = data.toString()
      if (data === 'ALIVE') return
      if (onMessage) onMessage(JSON.parse(data))
    })

    ws.on('close', data => {
      console.log('closed,trying ')
      checkConnection()
    })
  }
  start()

  function send(msg) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log(`sending: ${msg}`)
      ws.send(msg)
    }
  }

  function close() {
    if (ws) ws.close()
  }

  function checkConnection() {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      // && navigator.onLine
      // console.log("connection lost, trying to reconnect!", ws)
      start()
    }
  }

  let intervalId
  function keepAlive() {
    //keep connection alive:
    clearInterval(intervalId)
    intervalId = setInterval(function () {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send('ALIVE')
      }
    }, 1000 * 5)
  }

  return {
    send,
    close,
  }
}
