module.exports = {
  translate,
}

function translate(scheiberMsg) {
  const conversion = conversions[scheiberMsg.class]
  if (!conversion) return []
  return conversion(scheiberMsg)
}

const conversions = {
  //https://github.com/SignalK/signalk-to-nmea2000/blob/master/conversions/battery.js
  //module_id is not unique, so using name:
  Battery: msg => {
    const pathPrefix = `electrical.batteries.${msg.module_name}`
    return [
      {
        source: {
          type: 'NMEA2000',
          pgn: 127508,
        },
        values: [
          {
            path: `${pathPrefix}.voltage`,
            value: msg.battery_voltage_level,
          },
          {
            path: `${pathPrefix}.capacity.timeRemaining`,
            value: msg.dcd_time_remaining,
          },
          {
            path: `${pathPrefix}.current`,
            value: msg.battery_pgn_current,
          },
          {
            path: `${pathPrefix}.name`,
            value: msg.module_name,
          },
          {
            path: `${pathPrefix}.healthstatus`,
            value: msg.battery_health_level,
          },
        ],
      },
    ]
  },

  Tank: msg => {
    const type = getTankType(msg)
    const pathPrefix = `tanks.${type}.${msg.module_name}`
    return [
      {
        source: {
          type: 'NMEA2000',
          pgn: 127505,
        },
        values: [
          {
            path: `${pathPrefix}.capacity`,
            value: (msg.tank_capacity ?? 0) / 100,
          },
          {
            path: `${pathPrefix}.currentLevel`,
            value: (msg.tank_level ?? 0) / 100,
          },
          {
            path: `${pathPrefix}.name`,
            value: msg.module_name,
          },
        ],
      },
    ]
  },

  Light: msg => {
    const pathPrefix = `lights.${msg.module_name}`
    return [
      {
        source: {
          // type: "NMEA2000",
          // pgn: 127505,
        },
        values: [
          {
            path: `${pathPrefix}.dimmingLevel`,
            value: (msg.dimming_value ?? 0) / 100,
          },
          {
            path: `${pathPrefix}.state`,
            value: msg.is_light_on ? 1 : 0,
          },
          {
            path: `${pathPrefix}.group`,
            value: msg.light_group,
          },
        ],
      },
    ]
  },

  Dc: msg => {
    const pathPrefix = `electrical.switches.dc.${msg.module_name}`
    return [
      {
        source: {
          // type: "NMEA2000",
          // pgn: 127505,
        },
        values: [
          {
            path: `${pathPrefix}.state`,
            value: msg.dc_state === 'ON' ? 1 : 0,
          },
          {
            path: `${pathPrefix}.stateValue`,
            value: msg.dc_state,
          },
          {
            path: `${pathPrefix}.name`,
            value: msg.dc_name,
          },
        ],
      },
    ]
  },
}

function getTankType(msg) {
  if (msg.tank_type.startsWith('EG_')) return 'grayWater' //=eau grise
  if (msg.tank_type.startsWith('EP_')) return 'freshWater'
  //freshWater
  return 'fuel'
}
