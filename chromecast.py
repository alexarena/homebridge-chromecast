import sys
import pychromecast
import json
import time
import re

chromecasts = pychromecast.get_chromecasts()
cast = None


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

def setCast(args):
    global cast
    if(len(args) < 1):
        raise ValueError('Not enough args to setCast method.')

    cast = next(cc for cc in chromecasts if cc.device.friendly_name == args[0])
    cast.wait()
    device = castToJSON(cast)
    return json.dumps({'success':True,'device':device})

def pause(args):
    mc = cast.media_controller
    mc.pause()
    return mediaStatusAsJSON(mc)

def play(args):
    mc = cast.media_controller
    mc.play()
    return mediaStatusAsJSON(mc)

def volumeUp(args):
    cast.set_volume(cast.status.volume_level+0.1)
    return json.dumps({'volume':cast.status.volume_level})

def status(args):
    return json.dumps({'playing':cast.status.status_text})

commands = {
    "all": getChromecasts,
    "status": status,
    "set": setCast,
    "pause": pause,
    "play": play,
    "volumeUp": volumeUp
}

def output(ack,error,result):
    result = re.sub(r'[.]+',"{{PERIOD}}",result)
    error = re.sub(r'[.]+',"{{PERIOD}}",error)

    return (ack + '.' + error + '.' + result)

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

    try:
        res = commands[cmd](args)
        sys.stdout.write(output(ack,"",res))
    except Exception as e:
        sys.stdout.write(output(ack,str(e),""))
    sys.stdout.flush()
    #Introduce a small wait so Node interprets each command as a different event.
    time.sleep(0.001)
