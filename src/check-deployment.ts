import {getLatestDeploymentCommit} from './get-latest-deployment-commit'
import {getCompareCommitsSize} from './get-compare-commits-size'
import {WebClient} from '@slack/web-api'

type Params = {
  githubRepository: string
  githubToken: string
  slackToken: string
  slackChannel: string
  baseBranch: string
  deploymentEnvironmentName: string
  log(name: string, object: unknown): void
}

export async function checkDeployment({
  log,
  slackChannel,
  slackToken,
  githubToken,
  githubRepository,
  baseBranch,
  deploymentEnvironmentName
}: Params): Promise<void> {
  log('start', {
    slackChannel,
    baseBranch
  })

  const [owner, repo] = (githubRepository || '/').split('/')
  log('owner/repo', {owner, repo})

  const latestDeploymentCommit = await getLatestDeploymentCommit(
    githubToken,
    owner,
    repo,
    deploymentEnvironmentName
  )
  log('latestDeploymentCommit', latestDeploymentCommit)

  // 1回もデプロイされていない場合は何もしない
  if (latestDeploymentCommit === undefined) {
    return
  }

  const len = await getCompareCommitsSize(
    githubToken,
    owner,
    repo,
    `${latestDeploymentCommit}...${baseBranch}`
  )

  log('len', len)
  log('time', new Date().toTimeString())

  const web = new WebClient(slackToken)
  const text = `${owner}/${repo} に未デプロイの変更${
    len > 0 ? `があります (${len}commits)` : 'はありません'
  }\nhttps://github.com/${owner}/${repo}/compare/${latestDeploymentCommit}...${baseBranch}`
  log('slack text', text)
  const slackResponse = await web.chat.postMessage({
    text,
    channel: `#${slackChannel}`
  })
  log('slack response', slackResponse)
}
