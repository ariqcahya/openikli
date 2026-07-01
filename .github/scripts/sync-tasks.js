const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

const token = process.env.GITHUB_TOKEN;
const repoFullName = process.env.REPOSITORY;
if (!token || !repoFullName) {
  console.error("Missing GITHUB_TOKEN or REPOSITORY environment variables.");
  process.exit(1);
}

const [owner, repo] = repoFullName.split('/');
const octokit = new Octokit({ auth: token });

async function main() {
  const tasksPath = path.join(process.cwd(), 'TASKS.md');
  if (!fs.existsSync(tasksPath)) {
    console.error("TASKS.md not found.");
    return;
  }

  const content = fs.readFileSync(tasksPath, 'utf8');
  
  // Find all sections matching ## Phase X — [Name]
  const phases = [];
  const regex = /## Phase\s+(\d+)\s*—\s*([^\n\r]+)/g;
  let match;
  const indices = [];

  while ((match = regex.exec(content)) !== null) {
    indices.push({
      index: match.index,
      number: match[1],
      name: match[2].trim(),
      fullTitle: `[OpenIKLI] Phase ${match[1]} — ${match[2].trim()}`
    });
  }

  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].index;
    const end = (i + 1 < indices.length) ? indices[i + 1].index : content.length;
    
    let body = content.substring(start, end).trim();
    
    // Remove the heading line
    const headingLineRegex = /^## Phase\s+\d+\s*—\s*[^\n\r]+/i;
    body = body.replace(headingLineRegex, '').trim();

    // Remove trailing horizontal rule
    body = body.replace(/---$/, '').trim();

    // Map custom task list statuses to GitHub-compatible markdown checkboxes with status emojis
    body = body.split('\n').map(line => {
      // Map in-progress [~] -> [ ] 🔄
      if (line.match(/^\s*[-*+]\s+\[~\]/)) {
        return line.replace(/\[~\]/, '[ ] 🔄');
      }
      // Map needs review [!] -> [ ] ⚠️
      if (line.match(/^\s*[-*+]\s+\[!\]/)) {
        return line.replace(/\[!\]/, '[ ] ⚠️');
      }
      return line;
    }).join('\n');

    phases.push({
      title: indices[i].fullTitle,
      body: body
    });
  }

  console.log(`Found ${phases.length} phases in TASKS.md.`);

  // Fetch all open issues to check for duplicates
  let existingIssues = [];
  try {
    let page = 1;
    while (true) {
      const { data } = await octokit.issues.listForRepo({
        owner,
        repo,
        state: 'open',
        per_page: 100,
        page: page
      });
      if (data.length === 0) break;
      existingIssues = existingIssues.concat(data);
      page++;
    }
  } catch (err) {
    console.error("Error fetching existing issues:", err.message);
    process.exit(1);
  }

  for (const phase of phases) {
    const existing = existingIssues.find(issue => issue.title === phase.title);
    
    if (existing) {
      console.log(`Updating existing issue: "${phase.title}"`);
      await octokit.issues.update({
        owner,
        repo,
        issue_number: existing.number,
        body: phase.body
      });
    } else {
      console.log(`Creating new issue: "${phase.title}"`);
      await octokit.issues.create({
        owner,
        repo,
        title: phase.title,
        body: phase.body
      });
    }
  }

  console.log("Sync complete!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
