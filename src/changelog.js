import { DateTime } from 'luxon';

const escapeLine = '\r\n';
export default function generateChangelog(data, configuration) {
  let changelog = '## Changelog';

  changelog += formatCategorizedCommits(data, configuration);
  changelog += formatUncategorizedCommits(data, configuration);

  return changelog;
}

function formatCategorizedCommits(data, configuration) {
  let changelog = "";

  for (const category of configuration.categories) {
    const validCommits = getCategoryCommits(data, category.label);
    if (!validCommits || validCommits.length == 0) continue;
    
    changelog += escapeLine.repeat(2);
    changelog += `### ${category.title}`;
    changelog += escapeLine.repeat(2);

    for (const item of validCommits) {
      changelog += formatRow(item, configuration);
    }
  }
  return changelog;
}

function getCategoryCommits(data, categoryLabel) {
  const categories = categoryLabel.map(c => new RegExp('^' + c, 'i'));
  return data.filter(item => categories.some(c => c.test(item.commit.message)));
}

function formatUncategorizedCommits(data, configuration) {
  let changelog = "";

  const remainingCommits = getRemainingCommits(data, configuration);
  if (!remainingCommits || remainingCommits.length == 0) return changelog;
  
  changelog += escapeLine.repeat(2);
  changelog += `### ${configuration.defaultCategory}`;
  changelog += escapeLine.repeat(2);

  for (const item of remainingCommits) {
    changelog += formatRow(item, configuration);
  }
  return changelog;
}

function getRemainingCommits(data, configuration) {
  const allCategoryLabels = configuration.categories.map(c => c.label).flat();
  const categories = allCategoryLabels.map(c => new RegExp('^' + c, 'i'));
  return data.filter(item => !categories.some(c => c.test(item.commit.message)));
}

function formatRow(item, configuration) {
  const { commit } = item;
  const commitDate = formatDate(commit.author.date, configuration.dateTimeFormat);
  
  let row = `${commitDate} - ${commit.message} ([${item.sha}]${item.html_url})`;
  row += escapeLine;
  return row;
}

function formatDate(date, format) {
  return DateTime.fromISO(date).toFormat(format); 
}