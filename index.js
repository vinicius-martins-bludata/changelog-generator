import generateChangelog from './changelog.js';
import { readFileSync } from 'fs';
import { getInput, setOutput, setFailed } from '@actions/core';
import { getOctokit } from '@actions/github';

try {
  const token = getInput('token');
  const repository = getInput('repository');
  const octokit = getOctokit(token);
  
  const configLocation = getInput('configLocation');
  const configuration = JSON.parse(readFileSync(configLocation));

  const data = await fetchCommits(octokit, repository);
  
  const changelog = generateChangelog(data, configuration);

  setOutput('changelog', changelog);
}
catch (error) {
  setFailed(error.message);
}

async function fetchCommits(octokit, owner, repository) {
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
