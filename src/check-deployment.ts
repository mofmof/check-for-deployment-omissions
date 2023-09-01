import {getLatestDeploymentCommit} from './get-latest-deployment-commit'
import {compareCommits} from './compare-commits-size'
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

  const {changes} = await compareCommits(
    githubToken,
    owner,
    repo,
    `${latestDeploymentCommit}...${baseBranch}`
  )

  log('changes', changes)

  const web = new WebClient(slackToken)
  const slackResponse = await web.chat.postMessage({
    channel: `#${slackChannel}`,
    attachments:
      changes.files > 0
        ? [
            {
              fallback: `There are undeployed changes in the ${owner}/${repo}`,
              color: '#FF0000',
              title: 'Deployment Notification',
              text: `There are undeployed changes in the ${owner}/${repo} (${changes.commits}commits)\nhttps://github.com/${owner}/${repo}/compare/${latestDeploymentCommit}...${baseBranch}`,
              mrkdwn_in: ['text']
            }
          ]
        : [
            {
              fallback: `No undeployed changes in ${owner}/${repo}`,
              color: '#00FF00',
              title: 'Deployment Notification',
              text: `No undeployed changes in ${owner}/${repo}\nhttps://github.com/${owner}/${repo}/compare/${latestDeploymentCommit}...${baseBranch}`,
              mrkdwn_in: ['text']
            }
          ]
  })
  log('slack response', slackResponse)
}
