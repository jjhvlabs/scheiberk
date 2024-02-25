module.exports = {
  sendLightCmd,
  sendDcCmd,
  onCallbackMsg,
}

let callbackId = 0
const callbacks = {}

function onCallbackMsg(msg) {
  console.log(`on cmd Msg: ${JSON.stringify(msg, null, 2)}`)
  const callback = callbacks[msg.callback_id]
  if (callback) {
    callback({result: msg.result})
    delete callbacks[msg.callback_id]
  }
}
  

function sendLightCmd(ws, params,onCallbackMsg) {
  const _callBackId = callbackId++
  callbacks[_callBackId] = onCallbackMsg
  timeoutCmd(_callBackId)
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
      callback_id: _callBackId,
    }),
  )
}
function sendDcCmd(ws, params,onCallbackMsg) {
  const _callBackId = callbackId++
  callbacks[_callBackId] = onCallbackMsg
  timeoutCmd(_callBackId)
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
      callback_id: _callBackId,
    }),
  )
}

function timeoutCmd(callbackId) {
  setTimeout(() => {
    const callback = callbacks[callbackId]
    if (callback) {
      callback({result: false,reason:'no response'})
      delete callbacks[callbackId]
    }
  }, 5000)
}