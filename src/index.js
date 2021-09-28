import generateChangelog from './changelog.js';
import { readFileSync } from 'fs';
const core = require('@actions/core')
import { getOctokit } from '@actions/github';

try {
  const token = core.getInput('token');
  const repository = core.getInput('repository');
  const octokit = getOctokit(token);

  const configLocation = core.getInput('configLocation');
  const configuration = JSON.parse(readFileSync(configLocation));

  const data = await fetchCommits(octokit, repository);
  
  const changelog = generateChangelog(data, configuration);

  core.setOutput('changelog', changelog);
}
catch (error) {
  core.setFailed(error.message);
}

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
