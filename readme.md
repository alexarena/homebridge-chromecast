# homebridge-chromecast

This project is an attempt to create a Homebridge plugin for interfacing with Chromecast Audio devices. Rather than rewriting a library to interface with Google Chromecast devices in Node (the spec is kind of complicated and unsupported by Google), it aims to use the popular and well-maintained [pychromecast](https://github.com/balloob/pychromecast). I would use a native Node library, but none look anywhere near as well-maintained as pychromecast.

**Current Status:** I've implemented a protocol that supports bidirectional messaging between Node and Python. It allows you to send commands with arguments to Python and have a callback fired in Node when a response is received. I need to finish exposing the important parts of pychromecast to this protocol. Once that's done, I'll wrap it all in a Homebridge plugin and *fingers crossed*, we'll have a working library. 
