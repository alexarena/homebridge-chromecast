import sys
import pychromecast
import json
import time
import re
import logging

chromecasts = pychromecast.get_chromecasts()


#todo: refactor these to some type of for all in loop

def castToJSON(castIn):
    castAsJSON = {
        'friendly_name':castIn.device.friendly_name,
        'model_name':castIn.device.model_name,
        'manufacturer':castIn.device.manufacturer,
        'cast_type': castIn.device.cast_type,
        'port': castIn.port
    }
    return json.dumps(castAsJSON)

def mediaStatusAsJSON(mcIn):
    tmp = mcIn.status
    mcAsJSON = {
        'current_time':tmp.current_time,
        'content_id': tmp.content_id,
        'content_type':tmp.content_type,
        'duration':tmp.duration,
        'stream_type':tmp.stream_type,
        'idle_reason':tmp.idle_reason,
        'media_session_id':tmp.media_session_id,
        'playback_rate':tmp.playback_rate,
        'player_state':tmp.player_state,
        'supported_media_commands':tmp.supported_media_commands,
        'volume_level':tmp.volume_level,
        'volume_muted':tmp.volume_muted
    }
    return json.dumps(mcAsJSON)

def getChromecasts(args):
    return json.dumps([cc.device.friendly_name for cc in chromecasts])

def getChromecastByName(name):
    try:
        cast = next(cc for cc in chromecasts if cc.device.friendly_name == name)
        cast.wait()
        return cast
    except:
        raise ValueError('There is no Chromecast with that name.')

def pause(args):

    if(len(args) < 1):
        raise ValueError('The first argument must be a Chromecast name.')

    cast = getChromecastByName(args[0])
    mc = cast.media_controller
    mc.pause()
    return mediaStatusAsJSON(mc)

def play(args):

    if(len(args) < 1):
        raise ValueError('The first argument must be a Chromecast name.')

    cast = getChromecastByName(args[0])
    mc = cast.media_controller
    mc.play()
    return mediaStatusAsJSON(mc)

def volumeUp(args):

    if(len(args) < 1):
        raise ValueError('The first argument must be a Chromecast name.')
    cast = getChromecastByName(args[0])

    cast.set_volume(cast.status.volume_level+0.05)
    return json.dumps({'volume':cast.status.volume_level})

def volumeDown(args):

    if(len(args) < 1):
        raise ValueError('The first argument must be a Chromecast name.')
    cast = getChromecastByName(args[0])

    cast.set_volume(cast.status.volume_level-0.05)
    return json.dumps({'volume':cast.status.volume_level})

def setVol(args):

    if(len(args) < 2):
        raise ValueError('The first argument must be a Chromecast name and the second must be volume')
    cast = getChromecastByName(args[0])

    vol = float(args[1])
    fracVol = vol/100

    cast.set_volume(fracVol)
    time.sleep(0.01)

    volOutOf100 = round(cast.status.volume_level*100)

    return json.dumps({'volume':volOutOf100})

def getVol(args):

    if(len(args) < 1):
        raise ValueError('The first argument must be a Chromecast name.')
    cast = getChromecastByName(args[0])

    volOutOf100 = round(cast.status.volume_level*100)
    return json.dumps({'volume':volOutOf100})

def status(args):

    if(len(args) < 1):
        raise ValueError('The first argument must be a Chromecast name.')
    cast = getChromecastByName(args[0])
    mc = cast.media_controller
    mcJSON = mediaStatusAsJSON(mc)

    return mcJSON

commands = {
    "all": getChromecasts,
    "status": status,
    "pause": pause,
    "play": play,
    "setVol": setVol,
    "getVol":getVol,
    "volumeUp": volumeUp,
    "volumeDown": volumeDown
}

def output(ack,error,result):
    result = re.sub(r'[.]+',"{{PERIOD}}",result)
    error = re.sub(r'[.]+',"{{PERIOD}}",error)

    return (ack + '.' + error + '.' + result)

while not False:
    line = sys.stdin.readline()
    if not line:
        break

    try:
        trimmed = line.strip()
        args = trimmed.split('.')

        ack = args[0]
        cmd = args[1]

        args.remove(cmd)
        args.remove(ack)

        try:
            res = commands[cmd](args)
            sys.stdout.write(output(ack,"",res))
        except Exception as e:
            logging.exception("Something awful happened!")
            sys.stdout.write(output(ack,str(e),""))

    except:
        sys.stdout.write("BadCommandFormatError")

    sys.stdout.flush()
    #Introduce a small wait so Node interprets each command as a different event.
    time.sleep(0.001)
