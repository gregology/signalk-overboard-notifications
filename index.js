const Bacon = require('baconjs')
const _ = require('lodash')

module.exports = function(app) {
  var plugin = {}
  var watchIds = []
  var devices = []
  var matchKey = require('match-key')

  plugin.id = "overboard-notifications"
  plugin.name = "Overboard Notifications"
  plugin.description = "Signal K server plugin to setup overboard notifications"

  plugin.schema = {
    type: "object",
    properties: {
      paths: {
        type: "array",
        title: "Tracked Devices",
        "default": defaultNotification,
        items: {
          title: "Device",
          type: "object",
          required: ["provider", "name", "delay"],
          properties: {
            "enabled": {
              title: "Enabled",
              type: "boolean",
              default: true
            },
            "provider": {
              title: "Provider",
              type: "string",
              default: ""
            },
            "name": {
              title: "Name",
              description: "Name given to device holder",
              type: "string",
            },
            "delay": {
              id: "delay",
              type: "number",
              title: "Delay before raising alarm (seconds)",
              description: "The alarm will be raised when the device has not reported it's location for this many seconds",
              name: "delay",
            },
            "state": {
              type: "string",
              title: "Alarm State",
              description: "The alarm state when the value is in this zone.",
              default: "normal",
              enum: ["normal", "alert", "warn", "alarm", "emergency"]
            },
            "visual": {
              title: "Visual",
              type: "boolean",
              description: "Display a visual indication of the notification",
              default: true
            },
            "sound": {
              title: "Sound",
              type: "boolean",
              description: "Sound an audible indication of the notification",
              default: true
            }
          }
        }
      }
    }
  }

  plugin.start = function(props) {
    props.paths.forEach(function(device){
      if (device.enabled) {
        startWatchingDevice(device)
        devices.push(device)
      }
    })
  }

  plugin.stop = function() {
    watchIds.forEach(function(watchId){
      clearInterval(watchId)
    })
    watchIds = []

    devices.forEach(function(device){
      delta = {
        "context": "vessels." + app.selfId,
        "updates": [
          {
            "source": {
              "label": "overboard"
            },
            "timestamp": (new Date()).toISOString(),
            "values": [
              {
                "path": "notifications.overboard." + device.name,
                "value": {
                  "state": "disabled"
                }
              }
            ]
          }
        ]
      }
      app.signalk.addDelta(delta)
    })
    devices = []
  }

  function startWatchingDevice(device){
    watchId = setInterval(function () {
      position = app.getSelfPath('navigation.position')

      if (position != undefined) {
        matchingProviders = matchKey(position.values, device.provider + '*')

        if (matchingProviders != null) {
          deviceReading = Object.entries(matchingProviders)[0][1]

          secondsSinceSeen = ((new Date) - Date.parse(deviceReading.timestamp)) / 1000

          if (secondsSinceSeen < device.delay) {
            state = 'normal'
          } else {
            state = device.state
          }

          alarmMethod = []
          if (device.visual) {
            alarmMethod.push("visual")
          }
          if (device.sound) {
            alarmMethod.push("sound")
          }

          delta = getOverboardDelta(app.selfId, device.name, deviceReading)
          app.signalk.addDelta(delta)
        }
      }
    }, 1000);
    watchIds.push(watchId);
  }
  return plugin
}

function getOverboardDelta(vesselId, deviceName, deviceReading) {
  var delta = {
    "context": "vessels." + vesselId,
    "updates": [
      {
        "source": {
          "label": "overboard"
        },
        "timestamp": (new Date()).toISOString(),
        "values": [
          {
            "path": "notifications.overboard." + deviceName,
            "value": {
              "state": state,
              "method": alarmMethod,
              "message": deviceName + " last seen " + Math.round(secondsSinceSeen) + " seconds ago at latitude " + deviceReading.value.latitude.toFixed(6) + ", longitude " + deviceReading.value.longitude.toFixed(6),
              "timestamp": (new Date()).toISOString()
            }
          }
        ]
      }
    ]
  }
  return delta;
}

const defaultNotification = [
  {
    "enabled": true,
    "provider": "tricorder01",
    "name": "Greg",
    "delay": 30,
    "state": "emergency",
    "visual": true,
    "sound": true
  },
  {
    "enabled": false,
    "provider": "tricorder02",
    "name": "Dinghy",
    "delay": 60,
    "state": "alarm",
    "visual": true,
    "sound": true
  }
]
