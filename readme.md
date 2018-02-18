# homebridge-chromecast

This project is an attempt to create a Homebridge plugin for interfacing with Chromecast Audio devices. Rather than rewriting a library to interface with Google Chromecast devices in Node (the spec is kind of complicated and unsupported by Google), it aims to use the popular and well-maintained [pychromecast](https://github.com/balloob/pychromecast). I would use a native Node library, but none look anywhere near as well-maintained as pychromecast.

It is designed for audio-playback and has been developed with testing on Google Home devices, Chromecast Audio devices, and Google Cast Groups. Whether or not this will ever support non-audio devices is TBD.

### 🚨 This pre-alpha software!
It is not ready for even a somewhat adventurous enthusiast. If you don't understand what the code is doing, you shouldn't expect this to work for you (yet)!

In addition to being difficult to get working, the configuration details you set now **will** change in future versions.

## Todo

- [x] Develop interface to communicate between Node and Python
- [x] Implement bindings for the most important Chromecast commands (play,pause,volume)
- [x] Get a working Homebridge plugin for a single Chromecast device
- [ ] Support for multiple devices
- [ ] Switch support for preset operations (eg. a switch to play your favorite Spotify playlist)
- [ ] Any support whatsoever for non-Audio devices.

## Installation

**This package requires both Node 8 and Python 2/3.**

1. `pip install --upgrade pip`
2. `pip install pychromecast`
3. `sudo npm install homebridge-chromecast -g`

## Usage

Config sample:

```json
"accessories": [
  {
      "accessory": "Chromecast",
      "name": "Whole Home",
      "py_path":"/Users/alex/Dropbox/homebridge-chromecast/chromecast.py"
  }
]
```

In this example, `Whole Home` is the name of my Chromecast audio device. `py_path` is the path to the  `chromecast.py` script included in this plugin. This is a terrible hack but I haven't had the chance to make fix a bug with relative paths.

Once the plugin is up and running, it should add a light with dimmer controls to the Home app.

On/Off map to Play/Pause and the light brightness maps to volume. This is a terrible hack but Apple doesn't support speakers in Home.app.

## Contribution

Help is welcome! Issues/PRs are appreciated. If you want to chat about this project, DM me [@alexarena](twitter.com/alexarena).
