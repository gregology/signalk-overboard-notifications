# Signalk Overboard Notifications

signalk-overboard-notifications generates notifications on the state of devices providing location data.

Possible use cases;
 * raising an emergency notification (including the last knowing location) when a person goes overboard
 * raising an alarm notification when a dinghy floats away

# Installation

Install this app via the Signal K Node Server App Store

# Configuration

Setup a phone as a provider. One way is to install GPS Tether (free app) on your phone. Then add the details to your Signal K Node Server settings.

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
