const Interop = require('./interop')
const python = new Interop('python','/Users/alex/Dropbox/homebridge-chromecast/chromecast.py')

setInterval(()=>{
  python.cmd('status.Whole Home',(err,status)=>{
    if(err) {
      console.log(err)
    }
    console.log(status)
  })
},5000)
