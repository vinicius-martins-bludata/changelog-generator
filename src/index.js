const generateChangelog  = require('./changelog.js');
const fs = require('fs');
const axios = require('axios').default;

// import { getInput, setOutput, setFailed } from '@actions/core';
// import { getOctokit } from '@actions/github';

// async function fetchCommits(octokit, repository) {
async function fetchCommits() {
  let page = 1;
  
  let data = []
  let res;

  do {
    // res = await octokit.request(`/repos/vinicius-martins-bludata/changelog-generator/commits`, {
    res = await axios.get(`https://api.github.com/repos/vinicius-martins-bludata/changelog-generator/commits`, {
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

(async () => {
  try {
    // const token = getInput('token');
    // const repository = getInput('repository');
    // const octokit = getOctokit(token);
  
    // const configLocation = getInput('configLocation');
    const configLocation = 'changelog-configuration.json';
    const configuration = JSON.parse(fs.readFileSync(configLocation));
  
    // const data = await fetchCommits(octokit, repository);
    const data = await fetchCommits();
    
    const result = generateChangelog(data, configuration);
    console.log(result);
  
    // setOutput('changelog', result);
  }
  catch (error) {
    console.log(error.message)
    // setFailed(error.message);
  }
})();
