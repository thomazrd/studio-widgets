const { UTApi } = require('uploadthing/server');
const fs = require('fs');
async function test() {
  const utapi = new UTApi({ token: "eyJhcGlLZXkiOiJza19saXZlXzdkN2Y0NjlmMWNlZGEyZDk3MmYyNTNmZGUyMGY5ZWI3ZDlmYmI5ZjQ2NWUxYmY5NzMzZGNlODNmNzY5ZGZjNDEiLCJhcHBJZCI6IjA4cmx6Zjc4dHMiLCJyZWdpb25zIjpbInNlYTEiXX0=" });
  console.log(Object.keys(utapi));
  try {
     const f = new File(["test content"], "test.txt", { type: "text/plain" });
     const res = await utapi.uploadFiles([f]);
     console.log(res);
  } catch(e) {
     console.log(e);
  }
}
test();
