const fs = require('fs');
const path = require('path');

// Mock simple API key from the user's curl command
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaWNfaWQiOiIyNDgwNTAxOCIsImV4cCI6MTc1MzY4NjA0NH0.Fi6CV5CvMuYQo-N-PbhaUdLdWZGM_tbubnkruNVaZik';
const THERAPIST_ID = '36360480751';

async function test() {
  const FormData = require('form-data');
  const form = new FormData();
  form.append('therapist_id', THERAPIST_ID);
  
  // Creates a simple text file to test the upload
  const testFilePath = path.join(__dirname, 'dummy.txt');
  fs.writeFileSync(testFilePath, 'dummy file content');
  form.append('file', fs.createReadStream(testFilePath));

  console.log('Sending request to https://server.innersparkafrica.us/api/v1/th/upload');
  
  try {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch('https://server.innersparkafrica.us/api/v1/th/upload', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        // Let form-data set its boundary
        ...form.getHeaders()
      },
      body: form
    });
    
    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Response:', text);
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
