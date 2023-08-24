import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {test} from '@jest/globals'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  if (
    'INPUT_GITHUB_TOKEN' in process.env &&
    'INPUT_SLACK_TOKEN' in process.env &&
    'INPUT_SLACK_CHANNEL' in process.env &&
    'INPUT_BASE_BRANCH_NAME' in process.env
  ) {
    const options: cp.ExecFileSyncOptions = {
      env: {
        ...process.env
      }
    }
    console.log(cp.execFileSync(np, [ip], options).toString())
  }
})
