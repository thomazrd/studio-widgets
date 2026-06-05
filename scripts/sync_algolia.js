const fs = require('fs');
const path = require('path');
const https = require('https');

function getFileContent(filePath, defaultValue) {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8').trim();
    }
    return defaultValue;
}

async function syncWidget(widgetName, appId, apiKey) {
    const widgetDir = path.join(__dirname, '..', widgetName);

    if (!fs.existsSync(widgetDir) || !fs.statSync(widgetDir).isDirectory()) {
        console.error(`Widget directory ${widgetDir} not found.`);
        process.exit(1);
    }

    const title = getFileContent(path.join(widgetDir, 'title.md'), widgetName);
    const shortDesc = getFileContent(path.join(widgetDir, 'short_description.md'), "Short description not provided.");
    const longDesc = getFileContent(path.join(widgetDir, 'long_description.md'), "Long description not provided.");

    const payload = {
        id: widgetName,
        title: title,
        short_description: shortDesc,
        long_description: longDesc,
        js_link: `https://cdn.jsdelivr.net/gh/thomazrd/studio-widgets@main/${widgetName}/dist/build.js`,
        print_link: `https://cdn.jsdelivr.net/gh/thomazrd/studio-widgets@main/${widgetName}/print.png`
    };

    const indexName = "widgets";

    const dataString = JSON.stringify(payload);

    console.log(`Payload to send: ${JSON.stringify(payload, null, 2)}`);

    if (appId === "dummy_app_id") {
        console.log("Dummy APP_ID detected, skipping real HTTP request.");
        return;
    }

    const options = {
        hostname: `${appId}.algolia.net`,
        port: 443,
        path: `/1/indexes/${indexName}/${widgetName}`,
        method: 'PUT',
        headers: {
            'X-Algolia-Application-Id': appId,
            'X-Algolia-API-Key': apiKey,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(dataString)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`Successfully synced ${widgetName} to Algolia.`);
                    resolve();
                } else {
                    console.error(`Failed to sync ${widgetName}. Status: ${res.statusCode}, Response: ${responseData}`);
                    reject(new Error(`Failed to sync. Status: ${res.statusCode}`));
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Error syncing ${widgetName}: ${e.message}`);
            reject(e);
        });

        req.write(dataString);
        req.end();
    });
}

const widgetName = process.argv[2];
const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_API_KEY;

if (!widgetName) {
    console.error("Usage: node sync_algolia.js <widget_name>");
    process.exit(1);
}

if (!appId || !apiKey) {
    console.error("Error: ALGOLIA_APP_ID and ALGOLIA_API_KEY environment variables must be set.");
    process.exit(1);
}

syncWidget(widgetName, appId, apiKey).catch(() => process.exit(1));
