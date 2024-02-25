module.exports = {
  sendLightCmd,
  sendDcCmd,
  onCallbackMsg,
}

let callbackId = 0

function onCallbackMsg(msg) {
  console.log(`on cmd Msg: ${JSON.stringify(msg, null, 2)}`)
}
  

function sendLightCmd(ws, params) {
  ws.send(
    JSON.stringify({
      cmd: 'alter_object',
      params: {
        ...params,
        filter: {
          ...params.filter,
          class: 'Light',
        },
      },
      callback_id: callbackId++,
    }),
  )
}
function sendDcCmd(ws, params) {
  ws.send(
    JSON.stringify({
      cmd: 'alter_object',
      params: {
        ...params,
        filter: {
          ...params.filter,
          class: 'Dc',
        },
      },
      callback_id: callbackId++,
    }),
  )
}
