const generateChangelog = require('./changelog.js');
const fs = require('fs');
const { default: axios } = require('axios');

(async () => {
  try {
    const repository = 'vinicius-martins-bludata/changelog-generator';
    const configLocation = 'changelog-configuration.json';
    const configuration = JSON.parse(fs.readFileSync(configLocation));
  
    const data = await fetchCommits(repository);
    const result = generateChangelog(data, configuration);
    console.log(result);
  }
  catch (error) {
    console.error(error.message);
  }
})();

async function fetchCommits(repository) {
  let page = 1;
  let data = []
  let res;

  do {
    res = await axios.get(`https://api.github.com/repos/${repository}/commits`, {
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
