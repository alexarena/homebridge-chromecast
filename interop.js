const readline = require('readline')
const { spawn } = require('child_process')

/*
  Creates a child process in another language and allows for bi-directional messaging using a shared syntax.

  Commands to the child are in the form: <syn>.<command>.<arg1>.<arg2>...
  Responses from the child should be in the form: <syn>.<error_message>.<success_message_json>

  The syn bit is incremented on every command so that commands and their responses can be kept in sync.

*/

const unescape = (str) => str.replace(new RegExp(/({{PERIOD}})/, 'g'), '.')

class Interop{
  constructor(command,script){

    this.child = spawn(command, [script],{detached:true})

    process.stdin.pipe(this.child.stdin)

    this.resQueue = {}
    this.syn = 0

    this.child.on('disconnect', (err) => {
      console.log('err:',err)
    })

    this.child.on('exit', (err) => {
      console.log('exit:',err)
    })

    this.child.stdout.on('data', (data) => {
      try{
        const outStr = data.toString()

        if(outStr === 'BadCommandFormatError'){
          throw new Error(outStr)
        }

        const out = outStr.trim().split('.')
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

        this.resQueue[ack](err,msg)

      }
      catch(e){
        console.error(e.message)
        if(e.message !== 'BadCommandFormatError'){
          console.error('Unexpected Child Proccess Output:',data.toString())
        }
      }
    })

  }

  cmd(command,callback){
    this.syn++
    const localSyn = this.syn
    const commandToSend = `${localSyn}.${command}\n`
    this.child.stdin.write(commandToSend)
    this.resQueue[localSyn] = callback
  }

}

module.exports = Interop
