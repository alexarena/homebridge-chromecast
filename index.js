let Service, Characteristic

const Interop = require('./interop')
const python = new Interop('python','/Users/alex/Dropbox/homebridge-chromecast/chromecast.py')

module.exports = function(homebridge){
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerAccessory("chromecast","Chromecast",chromecast)

}

function chromecast(log,config){
  this.log = log
}

chromecast.prototype = {
  getServices: function(){
    let infoService = new Service.AccessoryInformation()

    infoService
      .setCharacteristic(Characteristic.Manufacturer, "Google")
      .setCharacteristic(Characteristic.Model, "Chromecast")
      .setCharacteristic(Characteristic.SerialNumber, "0000")

    let switchService = new Service.Switch("Whole Home")

    switchService.getCharacteristic(Characteristic.On)
      .on('get',this.getSwitchOnCharacteristic.bind(this))
      .on('set',this.setSwitchOnCharacteristic.bind(this))

    this.informationService = infoService
    this.switchService = switchService
    return [infoService, switchService]
  },

  getSwitchOnCharacteristic: function (next) {

    console.log("Called")

    python.cmd('status.Whole Home',(err,status)=>{
      if(err) {
        console.log(err)
        return next(null,false)
      }
      const isPaused = (status.player_state === 'PAUSED')
      console.log("Player status: " + status.player_state)
      return next(null,isPaused)
    })

    //return next(null,true)

    // setInterval(()=>{
    //   python.cmd('status.Whole Home',(err,status)=>{
    //     if(err) {
    //       console.log(err)
    //     }
    //     console.log(status)
    //   })
    // },5000)

  },

  setSwitchOnCharacteristic: function (play,next){
    console.log('TARGET STATE: ' + play)

    const playPauseCmd = play ? 'play.Whole Home' : 'pause.Whole Home'

    python.cmd(playPauseCmd,(err,status)=>{
      if(err) {
        console.log(err)
      }
      return next()
    })
  }
}

// exec('status.Whole Home',(err,status)=>{
//   if(err) {
//     console.log(err)
//     return
//   }
//   console.log('Status: ', status)
// })
//
// exec('pause.Whole Home',(err,status)=>{
//   if(err) {
//     console.log(err)
//     return
//   }
//   console.log('Status: ', status)
// })
