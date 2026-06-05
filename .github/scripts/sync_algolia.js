const fs = require('fs');
const path = require('path');

const WIDGET_DIR = process.argv[2];
const DRY_RUN = process.env.DRY_RUN === '1';

if (!WIDGET_DIR) {
  console.error("Usage: node sync_algolia.js <widget-folder-name>");
  process.exit(1);
}

const appId = process.env.APP_ID;
const apiKey = process.env.API_KEY;

if (!DRY_RUN && (!appId || !apiKey)) {
  console.error("APP_ID and API_KEY environment variables are required.");
  process.exit(1);
}

function readFileSafely(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8').trim();
    }
  } catch (error) {
    console.warn(`Could not read ${filePath}`);
  }
  return '';
}

function getFallbackData(widgetDir) {
  // Try to find a version folder like 'v1', 'v1.0.0', etc.
  const files = fs.readdirSync(widgetDir);
  const versionFolder = files.find(f => f.startsWith('v') && fs.statSync(path.join(widgetDir, f)).isDirectory());

  let title = '';
  let shortDesc = '';
  let longDesc = '';

  if (versionFolder) {
    const vPath = path.join(widgetDir, versionFolder);
    const pkgPath = path.join(vPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        // don't use 'v1', 'v1.0.0' as title from package.json if it is just a version folder package.json
        if (pkg.name && !pkg.name.startsWith('v')) title = pkg.name;
        if (pkg.description) shortDesc = pkg.description;
      } catch (e) {
        // ignore
      }
    }
    const readmePath = path.join(vPath, 'readme.md');
    if (!longDesc && fs.existsSync(readmePath)) {
       longDesc = fs.readFileSync(readmePath, 'utf8').trim();
       if (!shortDesc) {
         // get first few lines
         shortDesc = longDesc.split('\n').slice(0, 3).join(' ').substring(0, 200);
       }
       if (!title) {
         // extract from # Title
         const match = longDesc.match(/^#\s+(.*)/);
         if (match) title = match[1];
       }
    }
  }

  // Fallback to root readme
  const rootReadmePath = path.join(widgetDir, 'readme.md');
  if (fs.existsSync(rootReadmePath)) {
     const rootReadme = fs.readFileSync(rootReadmePath, 'utf8').trim();
     if (!longDesc) longDesc = rootReadme;
     if (!shortDesc) {
         shortDesc = rootReadme.split('\n').slice(0, 3).join(' ').substring(0, 200);
     }
     if (!title || title.startsWith('v')) { // avoid titles like 'v1'
         const match = rootReadme.match(/^#\s+(.*)/);
         if (match) title = match[1];
     }
  }

  return { title, shortDesc, longDesc };
}

async function syncWidget() {
  const titlePath = path.join(WIDGET_DIR, 'title.md');
  const shortDescPath = path.join(WIDGET_DIR, 'short_description.md');
  const longDescPath = path.join(WIDGET_DIR, 'long_description.md');
  const widgetIdPath = path.join(WIDGET_DIR, 'widget-id.md');

  let title = readFileSafely(titlePath);
  let shortDesc = readFileSafely(shortDescPath);
  let longDesc = readFileSafely(longDescPath);

  // Use widget-id.md as the unique key, fallback to WIDGET_DIR
  let widgetId = readFileSafely(widgetIdPath);
  if (!widgetId) {
    widgetId = WIDGET_DIR;
  }

  if (!title || !shortDesc || !longDesc) {
    const fallback = getFallbackData(WIDGET_DIR);
    if (!title) title = fallback.title || WIDGET_DIR;
    if (!shortDesc) shortDesc = fallback.shortDesc || 'No description provided';
    if (!longDesc) longDesc = fallback.longDesc || shortDesc;
  }

  const jsdelivrBase = `https://cdn.jsdelivr.net/gh/thomazrd/studio-widgets@main/${WIDGET_DIR}`;

  const payload = {
    objectID: widgetId,
    id: widgetId,
    title: title,
    short_description: shortDesc,
    long_description: longDesc,
    js_link: `${jsdelivrBase}/dist/build.js`,
    print_link: `${jsdelivrBase}/print.png`
  };

  console.log('Payload to send:', JSON.stringify(payload, null, 2));

  if (DRY_RUN) {
    console.log('DRY_RUN is set. Skipping Algolia sync.');
    return;
  }

  const indexName = 'widgets';
  // Use non-DSN endpoint for writes
  const url = `https://${appId}.algolia.net/1/indexes/${indexName}/${widgetId}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'X-Algolia-Application-Id': appId,
        'X-Algolia-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to sync to Algolia: ${response.status} ${response.statusText}`);
      console.error(errorText);
      process.exit(1);
    }

    const data = await response.json();
    console.log(`Successfully synced ${WIDGET_DIR} to Algolia. Response:`, data);

  } catch (error) {
    console.error('Error communicating with Algolia:', error);
    process.exit(1);
  }
}

syncWidget();
