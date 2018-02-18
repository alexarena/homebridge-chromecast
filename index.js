
const Interop = require('./interop')
const chromecast = new Interop('python','chromecast.py')

chromecast.cmd('status.Whole Home',(err,chromecasts)=>{
  if(err) {
    console.log(err)
    return
  }
  console.log('The cast is now: ', chromecasts)
})

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
