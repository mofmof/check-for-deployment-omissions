import {Octokit} from '@octokit/rest'

export const getCompareCommitsSize = async (
  owner: string,
  repo: string,
  basehead: string
): Promise<number> => {
  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`
  })
  const {data} = await octokit.repos.compareCommitsWithBasehead({
    owner,
    repo,
    basehead
  })
  // // const {data} = await octokit.rest.repos.compareCommits({
  // //   owner,
  // //   repo,
  // //   base: latestDeploymentCommit,
  // //   head: 'e94abdfee5aa0194a8f07d79bbf5134f95d947e3'
  // // })
  return data?.commits.length ?? 0
}
