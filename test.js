const Interop = require('./interop')
const python = new Interop('python','/Users/alex/Dropbox/homebridge-chromecast/chromecast.py')

python.cmd('getVol.Office',(err,vol)=>{
  if(err) {
    console.log(err)
  //  return next(null,false)
  }

  console.log(vol)

  // const isPaused = (status.player_state === 'PAUSED')
  // console.log("Player status: " + status.player_state)
  // return next(null,isPaused)
})
