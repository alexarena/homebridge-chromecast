const readline = require('readline')
const { spawn } = require('child_process')

const child = spawn('python', ['chromecast.py'])

const resQueue = {}
let syn = 0

function exec(command,callback){
  syn++
  localSyn = syn
  const commandToSend = `${localSyn}.${command}\n`
  child.stdin.write(commandToSend)
  resQueue[localSyn] = callback
}

const unescape = (str) => str.replace(new RegExp(/({{PERIOD}})/, 'g'), '.')

child.stdout.on('data', (data) => {

  try{
    const out = data.toString().trim().split('.')
    if(out.length === 0){
      throw new Error('Unexpected output')
    }

    const ack = out[0]

    let err = null
    const errText = unescape(out[1])
    if(errText !== ''){
      err = new Error(errText)
    }

    const msg = JSON.parse(unescape(out[2]))

    resQueue[ack](err,msg)

  }
  catch(e){
    console.error(e)
    console.error('Unexpected Python Output:',data.toString())
  }

})

exec('all',(err,chromecasts)=>{
  if(err) {
    console.log(err)
    return
  }
  console.log('The cast is now: ', chromecasts)
})

exec('set.Office',(err,res)=>{
  if(err) {
    console.log(err)
    return
  }
  console.log('Set cast: ', res)
})

exec('status',(err,status)=>{
  if(err) {
    console.log(err)
    return
  }
  console.log('Status: ', status)
})

exec('pause',(err,status)=>{
  if(err) {
    console.log(err)
    return
  }
  console.log('Status: ', status)
})
