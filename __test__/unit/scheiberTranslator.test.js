const sampleData = require('../sampledata')
const {translate} = require('../../plugin/tools/scheiberTranslator')

describe('scheiberTranslator', () => {
  test('translate Battery', () => {
    const result = translate(sampleData.battery_babord)
    console.log(`result: ${JSON.stringify(result, null, 2)}`)

    expect(result).toEqual([
      {
        "source": {
          "type": "NMEA2000",
          "pgn": 127508
        },
        "values": [
          {
            "path": "electrical.batteries.1416.voltage",
            "value": 26.5
          },
          {
            "path": "electrical.batteries.1416.capacity.timeRemaining",
            "value": 0
          },
          {
            "path": "electrical.batteries.1416.current",
            "value": 0
          },
          {
            "path": "electrical.batteries.1416.name",
            "value": "babord"
          },
          {
            "path": "electrical.batteries.1416.healthstatus",
            "value": "GREEN"
          }
        ]
      }
    ])
  })
})
