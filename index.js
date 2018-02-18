let Service, Characteristic

const Interop = require('./interop')

let python = null
let PLAYER_NAME = null

module.exports = function(homebridge){
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic

  homebridge.registerAccessory("chromecast","Chromecast",chromecast)

}

function chromecast(log,config){

  python = new Interop('python',config.py_path)
  PLAYER_NAME = config.name

  this.log = log
  this.volumeService = new Service.Lightbulb(PLAYER_NAME+" Volume" , "volumeService");
}

chromecast.prototype = {
  getServices: function(){
    let infoService = new Service.AccessoryInformation()

    infoService
      .setCharacteristic(Characteristic.Manufacturer, "Google")
      .setCharacteristic(Characteristic.Model, "Chromecast")
      .setCharacteristic(Characteristic.SerialNumber, "0000")

    this.volumeService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPlayPauseStatus.bind(this))
      .on('set', this.setPlayOrPause.bind(this))

    this.volumeService
      .addCharacteristic(new Characteristic.Brightness())
      .on('get', this.getVolume.bind(this))
      .on('set', this.setVolume.bind(this))

    this.informationService = infoService

    return [this.informationService,this.volumeService]
  },

  setVolume: function (level,callback){
    this.log('Set vol to: ' + level)

    python.cmd('setVol.'+PLAYER_NAME+'.'+level,(err,vol)=>{
      if(err) {
        console.log(err)
        return callback(null,0)
      }

      this.log('Success! Vol is: ' + vol.volume)
      return callback(null,level)
    })

  },


  getVolume: function (callback){
    this.log('Get volume')
    python.cmd('getVol.'+PLAYER_NAME,(err,vol)=>{
      if(err) {
        console.log(err)
        return callback(null,false)
      }
      callback(null,vol.volume)
    })

  },

  getPlayPauseStatus: function (next) {

    this.log("gettingPlayPauseStatus")

    python.cmd('status.'+PLAYER_NAME,(err,status)=>{
      if(err) {
        console.log(err)
        return next(null,false)
      }
      const isPlaying = (status.player_state === 'PLAYING')
      this.log("Player State: " + status.player_state)
      return next(null,isPlaying)
    })

  },

  setPlayOrPause: function (play,next){

    this.log('Set to play? ' + play)

    const playPauseCmd = play ? `play.${PLAYER_NAME}` : `pause.${PLAYER_NAME}`

    python.cmd(playPauseCmd,(err,status)=>{
      if(err) {
        console.log(err)
      }
      return next()
    })
  }
}
