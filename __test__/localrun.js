const plugin = require('../plugin/index.js')

const app = {
  on: (event, callback) => {
    callback()
  },
  emit: (event, data) => {
    console.log(`app.emit(${event},${JSON.stringify(data, null, 2)})`)
  },
}
const settings = {
  scheiber_server_url: '192.168.1.211:9474',
}
plugin(app).start(settings, () => {})
