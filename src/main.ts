import * as core from '@actions/core'
import {getLatestDeploymentCommit} from './getLatestDeploymentCommit'
import {getCompareCommitsSize} from './getCompareCommitsSize'

async function run(): Promise<void> {
  try {
    const [owner, repo] = (
      process.env.GITHUB_REPOSITORY ?? 'shwld/revelup-note'
    ).split('/')
    core.setOutput('owner/repo', {owner, repo})

    const latestDeploymentCommit = await getLatestDeploymentCommit(owner, repo)
    core.setOutput('latestDeploymentCommit', latestDeploymentCommit)

    if (latestDeploymentCommit === undefined) {
      return
    }

    const len = await getCompareCommitsSize(
      owner,
      repo,
      `${latestDeploymentCommit}...main`
    )

    core.setOutput('len', len)
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setOutput('sugoierror', error)
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
