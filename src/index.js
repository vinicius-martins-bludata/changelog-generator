const generateChangelog = require('./changelog.js');
const fs = require('fs');
const core = require('@actions/core')
const github = require('@actions/github');

(async () => {
  try {
    const token = core.getInput('token');
    const repository = core.getInput('repository');
    const octokit = github.getOctokit(token);
  
    const configLocation = core.getInput('configLocation');
    const configuration = JSON.parse(fs.readFileSync(configLocation));
  
    const data = await fetchCommits(octokit, repository);
    
    const result = generateChangelog(data, configuration);
  
    core.setOutput('changelog', result);
  }
  catch (error) {
    core.setFailed(error.message);
  }
})

async function fetchCommits(octokit, repository) {
  let page = 1;
  let data = []
  let res;

  do {
    res = await octokit.request(`/repos/${repository}/commits`, {
      headers: {
        accept: ' application/vnd.github.v3+json',
      },
      params: {
        per_page: 100,
        page,
      }
    });

    data = [...data, ...res.data];
    page++;
  } while (res && res.data.length != 0);

  return data;
}
