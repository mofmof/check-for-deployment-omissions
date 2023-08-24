import {Octokit} from '@octokit/rest'
import fetch from 'node-fetch'

export const getCompareCommitsSize = async (
  owner: string,
  repo: string,
  basehead: string
): Promise<number> => {
  const octokit = new Octokit({
    auth: `token ${process.env.GITHUB_TOKEN}`,
    request: {
      fetch
    }
  })
  const {data} = await octokit.repos.compareCommitsWithBasehead({
    owner,
    repo,
    basehead
  })
  return data?.commits.length ?? 0
}
