const fs = require('fs');
async function test() {
  const token = "eyJhcGlLZXkiOiJza19saXZlXzdkN2Y0NjlmMWNlZGEyZDk3MmYyNTNmZGUyMGY5ZWI3ZDlmYmI5ZjQ2NWUxYmY5NzMzZGNlODNmNzY5ZGZjNDEiLCJhcHBJZCI6IjA4cmx6Zjc4dHMiLCJyZWdpb25zIjpbInNlYTEiXX0=";
  const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
  console.log(decoded);
  
  // Try to use uploadthing api v6
  try {
    const formData = new FormData();
    formData.append('files', new Blob(['test text content']), 'test.txt');
    const res = await fetch('https://api.uploadthing.com/v6/uploadFiles', {
      method: 'POST',
      headers: {
        'x-uploadthing-api-key': decoded.apiKey,
        'x-uploadthing-version': '6.4.0'
      },
      body: formData
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.log(e);
  }
}
test();
