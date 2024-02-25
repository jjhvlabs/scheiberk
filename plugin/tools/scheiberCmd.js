module.exports = {
  sendLightCmd,
  sendDcCmd,
  onCallbackMsg,
}


function sendLightCmd(ws, params,onCallbackMsg) {
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
      callback_id: getNewCallbackId(onCallbackMsg),
    }),
  )
}
function sendDcCmd(ws, params,onCallbackMsg) {
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
      callback_id: getNewCallbackId(onCallbackMsg),
    }),
  )
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
  
function getNewCallbackId(callback) {
  const _callBackId = callbackId++
  callbacks[_callBackId] = callback
  timeoutCmd(_callBackId)
  return _callBackId

}

function timeoutCmd(_callbackId) {
  setTimeout(() => {
    const callback = callbacks[_callbackId]
    if (callback) {
      callback({result: false,reason:'no response'})
      delete callbacks[_callbackId]
    }
  }, 5000)
}