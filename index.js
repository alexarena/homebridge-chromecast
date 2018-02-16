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


child.stdout.on('data', (data) => {
  const res = data.toString().trim().split('.')
  const ack = res[0]
  res.splice(0,1)

  resQueue[ack](res)
})

exec('chromecasts',(res)=>{
  console.log('The cast is now: ' + res)
})

exec('setCast.Office',(res)=>{
  console.log('Set cast: ' + res)
})

exec('nowPlaying',(res)=>{
  console.log('nowPlaying: ' + res)
})
