import {test} from '@jest/globals'
import * as dotenv from 'dotenv'
import {checkDeployment} from '../src/check-deployment'

// shows how the runner will run a javascript action with env / stdout protocol
test('test run', async () => {
  dotenv.config()
  if (
    process.env.SLACK_CHANNEL &&
    process.env.SLACK_TOKEN &&
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_REPOSITORY &&
    process.env.BASE_BRANCH_NAME &&
    process.env.DEPLOYMENT_ENVIRONMENT_NAME
  ) {
    await checkDeployment({
      log: console.log,
      slackChannel: process.env.SLACK_CHANNEL ?? '',
      slackToken: process.env.SLACK_TOKEN ?? '',
      githubToken: process.env.GITHUB_TOKEN ?? '',
      githubRepository: process.env.GITHUB_REPOSITORY ?? '/',
      baseBranch: process.env.BASE_BRANCH_NAME ?? '',
      deploymentEnvironmentName: process.env.DEPLOYMENT_ENVIRONMENT_NAME ?? ''
    })
  }
})
