import {Octokit} from '@octokit/rest'
import fetch from 'node-fetch'

export const getCompareCommitsSize = async (
  githubToken: string,
  owner: string,
  repo: string,
  basehead: string
): Promise<number> => {
  const octokit = new Octokit({
    auth: `token ${githubToken}`,
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
