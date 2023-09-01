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
  githubToken: string,
  owner: string,
  repo: string,
  environmentName: string
): Promise<string | undefined> => {
  const result: QueryResult = await graphql({
    query: `
      query getRepo($owner: String!, $repo: String!, $environmentNames: [String!]!){
        repository(owner: $owner, name: $repo) {
          deployments(
            first: 3
            environments: $environmentNames
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
    environmentNames: [environmentName],
    headers: {
      authorization: `token ${githubToken}`
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
