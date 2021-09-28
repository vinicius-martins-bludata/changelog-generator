import generateChangelog from './changelog.js';
import axios from 'axios';
import { readFileSync } from 'fs';
// import { getInput, setOutput, setFailed } from '@actions/core';
// import { getOctokit } from '@actions/github';

// async function fetchCommits(octokit, repository) {
async function fetchCommits() {
  let page = 1;
  
  let data = []
  let res;

  do {
    res = await axios.get(`/repos/vinicius-martins-bludata/changelog-generator/commits`, {
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

try {
  // const token = getInput('token');
  // const repository = getInput('repository');
  // const octokit = getOctokit(token);

  // const configLocation = getInput('configLocation');
  const configLocation = 'changelog-configuration.json';
  const configuration = JSON.parse(readFileSync(configLocation));

  // const data = await fetchCommits(octokit, repository);
  const data = await fetchCommits();
  
  const result = generateChangelog(data, configuration);
  console.log(result);

  setOutput('changelog', result);
}
catch (error) {
  setFailed(error.message);
}
