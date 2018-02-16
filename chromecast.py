import sys
import pychromecast
import json
import time

chromecasts = pychromecast.get_chromecasts()
cast = None

def getChromecasts(args):
    return json.dumps([cc.device.friendly_name for cc in chromecasts])

def setCast(args):
    global cast
    if(len(args) < 1):
        raise ValueError('Not enough args to setCast method.')

    cast = next(cc for cc in chromecasts if cc.device.friendly_name == args[0])
    cast.wait()
    return "success"

def nowPlaying(args):
    return cast.status.status_text

commands = {
    "chromecasts": getChromecasts,
    "nowPlaying": nowPlaying,
    "setCast": setCast
}

while not False:
    line = sys.stdin.readline()
    if not line:
        break

    trimmed = line.strip()
    args = trimmed.split('.')

    ack = args[0]
    cmd = args[1]

    args.remove(cmd)
    args.remove(ack)

    res = commands[cmd](args)
    sys.stdout.write(ack + '.' + res)

    sys.stdout.flush()
    #Introduce a small wait so Node interprets each command as a different event.
    time.sleep(0.001)
