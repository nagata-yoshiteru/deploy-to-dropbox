# deploy-to-dropbox

A GitHub Action to deploy to Dropbox using dropbox-sdk-js@10.x

## Setup

Follow [this guide][dropbox-token-guide] to create and get your access token.

Save the token to your repository `Settings > Secrets`:

- Name: `DROPBOX_REFRESH_TOKEN`
- Value: Get your refresh_token from [this link](https://www.dropbox.com/oauth2/authorize?client_id=gjodf0rrqhqfjza&redirect_uri=https://exdata.co.jp/gh-dropbox/redirect&response_type=code&token_access_type=offline)

## Usage

In your workflow add the following code:
```yaml
- name: Upload to Dropbox
    uses: nagata-yoshiteru/deploy-to-dropbox@master
    with:
        DROPBOX_REFRESH_TOKEN: ${{ secrets.DROPBOX_REFRESH_TOKEN }}
        GLOB: dist/*
        FILE_WRITE_MODE: overwrite
```

## Inputs

* `DROPBOX_REFRESH_TOKEN` - Refresh token to get access token for Dropbox.
* `GLOB` - [Glob][npm-glob] pattern of files to upload.
* `FILE_WRITE_MODE` - Set file write mode when conflict occurs. Allowed modes: "add", "overwrite", "update".

Head over to [action.yml](action.yml) for more information about variables.

## Developing

To properly bump version:
```bash
npm run tag:patch && git push --follow-tags
```

## Debugging

This action uses "Step Debug Logs" for debug output. You can enable debug
output by creating a new secret variable `ACTIONS_STEP_DEBUG` with
value `true`. [Click here][gh-step-debug] for more details.

[dropbox-token-guide]: https://preventdirectaccess.com/docs/create-app-key-access-token-for-dropbox-account/#access-token
[npm-glob]: https://www.npmjs.com/package/glob
[gh-step-debug]: https://github.com/actions/toolkit/blob/master/docs/action-debugging.md#step-debug-logs
