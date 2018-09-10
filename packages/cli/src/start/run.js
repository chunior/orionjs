import runProcess from './runProcess'
import runOnce from './runOnce'
import colors from 'colors/safe'
import sleep from '../helpers/sleep'
import isPortInUse from '../helpers/isPortInUse'

let appProcess = null

const arePortsInUse = async function() {
  const port = process.env.PORT || 3000
  if (await isPortInUse(port)) return true
  if (global.processOptions.shell) {
    if (await isPortInUse(9229)) return true
  }

  return false
}

const restart = runOnce(async function() {
  if (appProcess) {
    console.log('')
    console.log(colors.bold('=> Restarting...'))
    appProcess.kill()
    for (let i = 0; await arePortsInUse(); i++) {
      await sleep(10)
      // 5 secs
      if (i > 1000 * 5) {
        throw new Error('Port is in use')
      }
    }
  }

  const options = global.processOptions
  appProcess = await runProcess({restart, options})
  console.log(colors.bold('=> App started\n'))

  await sleep(100)
})

export default restart
