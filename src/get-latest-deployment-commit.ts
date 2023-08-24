import {graphql} from '@octokit/graphql'
import fetch from 'node-fetch'

type QueryResult = {
  repository: {
    deployments: {
      nodes: {
        state: string
        commit: {
          oid: string
        }
      }[]
    }
  }
}

export const getLatestDeploymentCommit = async (
  owner: string,
  repo: string
): Promise<string | undefined> => {
  const result: QueryResult = await graphql({
    query: `
      query getRepo($owner: String!, $repo: String!){
        repository(owner: $owner, name: $repo) {
          deployments(
            first: 3
            environments: ["production"]
            orderBy: {field: CREATED_AT, direction: DESC}
          ) {
            nodes {
              state
              commit {
                oid
              }
            }
          }
        }
      }
    `,
    owner,
    repo,
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`
    },
    request: {
      fetch
    }
  })
  const latestDeploymentCommit = result.repository.deployments.nodes.find(
    node => node.state === 'ACTIVE'
  )?.commit.oid

  return latestDeploymentCommit
}
