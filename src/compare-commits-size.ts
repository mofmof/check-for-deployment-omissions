import {Octokit} from '@octokit/rest'
import fetch from 'node-fetch'

type Result = {
  changes: {
    commits: number
    files: number
  }
}

export const compareCommits = async (
  githubToken: string,
  owner: string,
  repo: string,
  basehead: string
): Promise<Result> => {
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
  return {
    changes: {
      commits: data?.commits.length ?? 0,
      files: data?.files?.length ?? 0
    }
  }
}
