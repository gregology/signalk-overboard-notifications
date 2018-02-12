[![Version](https://img.shields.io/npm/v/signalk-overboard-notifications.svg?style=flat)](https://www.npmjs.com/package/signalk-overboard-notifications)
[![Downloads](https://img.shields.io/npm/dt/signalk-overboard-notifications.svg?style=flat)](https://www.npmjs.com/package/signalk-overboard-notifications)
[![Development](https://img.shields.io/badge/development-active-green.svg)](https://github.com/gregology/signalk-overboard-notifications)
[![License](http://img.shields.io/badge/license-MIT-yellow.svg?style=flat)](https://github.com/gregology/signalk-overboard-notifications/blob/master/LICENSE)
[![Gregology](https://img.shields.io/badge/contact-Gregology-blue.svg?style=flat)](http://gregology.net/contact/)


# Signalk Overboard Notifications

signalk-overboard-notifications generates notifications on the state of devices providing location data.

Possible use cases;
 * raising an emergency notification (including the last knowing location) when a person goes overboard
 * raising an alarm notification when a dinghy floats away

# Installation

Install this app via the Signal K Node Server App Store

# Configuration

Setup a phone as a provider. One option is to install [GPS Tether](https://play.google.com/store/apps/details?id=com.ryanandbrenda.gpstether&hl=en) on a phone. Then add the phone as a provider in your Signal K Node Server settings.

```
{
  "id": "providerId",
  "pipeElements": [
    {
      "type": "providers/tcp",
      "options": {
        "host": "android-0123456789abcdef.lan",
        "port": "10110"
      },
      "optionMappings": [
        {
          "fromAppProperty": "argv.udpport",
          "toOption": "port"
        }
      ]
    },
    {
      "type": "providers/nmea0183-signalk",
      "optionMappings": [
        {
          "fromAppProperty": "selfId",
          "toOption": "selfId"
        },
        {
          "fromAppProperty": "selfType",
          "toOption": "selfType"
        }
      ]
    }
  ]
}
```

Finish off the configuration in Signal K Server Plugin Configuration.
