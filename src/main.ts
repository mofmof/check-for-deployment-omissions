import * as core from '@actions/core'
import {checkDeployment} from './check-deployment'

async function run(): Promise<void> {
  try {
    const githubToken: string = core.getInput('github_token')
    const slackToken: string = core.getInput('slack_token')
    const slackChannel: string = core.getInput('slack_channel')
    const baseBranch: string = core.getInput('base_branch')
    const deploymentEnvironmentName: string = core.getInput(
      'deployment_environment_name'
    )
    core.setOutput('start', {
      slackChannel,
      baseBranch
    })

    await checkDeployment({
      log: core.setOutput,
      slackChannel,
      slackToken,
      githubToken,
      githubRepository: process.env.GITHUB_REPOSITORY ?? '/',
      baseBranch,
      deploymentEnvironmentName
    })
  } catch (error) {
    core.setOutput('error', error)
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
