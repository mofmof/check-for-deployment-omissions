import * as core from '@actions/core'
import {getLatestDeploymentCommit} from './get-latest-deployment-commit'
import {getCompareCommitsSize} from './get-compare-commits-size'
import {WebClient} from '@slack/web-api'

async function run(): Promise<void> {
  try {
    const githubToken: string = core.getInput('github_token')
    const slackToken: string = core.getInput('slack_token')
    const slackChannel: string = core.getInput('slack_channel')
    const baseBranch: string = core.getInput('base_branch')
    core.setOutput('start', {
      slackChannel,
      baseBranch
    })

    process.env.GITHUB_TOKEN = githubToken
    const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '/').split('/')
    core.setOutput('owner/repo', {owner, repo})

    const latestDeploymentCommit = await getLatestDeploymentCommit(owner, repo)
    core.setOutput('latestDeploymentCommit', latestDeploymentCommit)

    // 1回もデプロイされていない場合は何もしない
    if (latestDeploymentCommit === undefined) {
      return
    }

    const len = await getCompareCommitsSize(
      owner,
      repo,
      `${latestDeploymentCommit}...${baseBranch}`
    )

    core.setOutput('len', len)
    core.setOutput('time', new Date().toTimeString())

    const web = new WebClient(slackToken)
    const text = `${owner}/${repo} に未デプロイの変更${
      len > 0 ? `があります (${len}commits)` : 'はありません'
    }`
    core.setOutput('slack text', text)
    const slackResponse = await web.chat.postMessage({
      text,
      channel: `#${slackChannel}`
    })
    core.setOutput('slack resp', slackResponse)
  } catch (error) {
    core.setOutput('error', error)
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
