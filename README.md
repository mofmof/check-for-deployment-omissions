# [Check for Deployment Omissions] Action!

Notify you when there is a difference between Deployment and the base branch.

# Install

## 1. Create Slack App

1. Go to https://api.slack.com/apps/
1. Create New App with `From an app manifest`

manifest is

```yml
display_information:
  name: Check for Deployment Omissions
settings:
  org_deploy_enabled: false
  socket_mode_enabled: false
  is_hosted: false
  token_rotation_enabled: false
features:
  bot_user:
    display_name: Check for Deployment Omissions
oauth_config:
  scopes:
    bot:
      - chat:write
      - chat:write.public
```

## 2. Create GitHub Actions workflow

.github/workflows/check-for-deployment-omissions.yml

```yml
name: 'check-for-deployment-omissions'
on:
  schedule:
    - cron: '0 0 * * 1'

jobs:
  check-for-deployment-omissions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: mofmof/check-for-deployment-omissions@v0
        with:
          base_branch: 'main'
          github_token: ${{ secrets.GITHUB_TOKEN }}
          slack_token: ${{ secrets.SLACK_TOKEN }}
          slack_channel: ${{ secrets.SLACK_CHANNEL }}
```
