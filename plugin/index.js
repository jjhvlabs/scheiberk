const {sendLightCmd, onCallbackMsg, sendDcCmd} = require('./tools/scheiberCmd')
const {translate} = require('./tools/scheiberTranslator')
const {
  startWebSocket,
  closeAllSockets,
} = require('./tools/websocket')
const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path')


module.exports = app => {
  let ws
  const plugin = {
    id: 'scheiberk',
    name: 'Signalk Scheiber Plugin',
    start: (settings, restartPlugin) => {
      // start up code goes here.
      console.log(
        `Starting scheiber plugin with settings: ${JSON.stringify(settings)}`,
      )
      ws = startWebSocket(settings.scheiber_server_url, scheiberMsg => {
        if (scheiberMsg.callback_id) return onCallbackMsg(scheiberMsg)
        translate(scheiberMsg).forEach(update => {
          update.source = {
            label: plugin.id,
            src: '99',
            ...update.source,
          }
          app.handleMessage(plugin.id, {updates: [update]})
        })
      })
    },
    stop: () => {
      // shutdown code goes here.
      closeAllSockets()
    },
    schema: {
      type: 'object',
      required: ['scheiber_server_url'],
      properties: {
        scheiber_server_url: {
          type: 'string',
          title: 'IP and port of the Scheiber MB-Box (e.g. 192.168.1.211:9474)',
        },
      },
    },
    registerWithRouter: router => {
      router.post('/lights', (req, res) => {
        sendLightCmd(ws, req.body)
        res.send(JSON.stringify({result: 'ok'}))
      })
      router.post('/dc', (req, res) => {
        sendDcCmd(ws, req.body)
        res.send(JSON.stringify({result: 'ok'}))
      })
    },
    getOpenApi: () => yaml.load(
      fs.readFileSync(path.join(__dirname, 'openAPI.yaml'), 'utf8')
    ),
  }

  return plugin
}
