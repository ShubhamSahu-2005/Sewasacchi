import fetch from 'node-fetch';
import FormData from 'formdata-node';
import {fileFromPath} from 'formdata-node/file-from-path'
import {File} from 'formdata-node/file';

const API_URL = 'http://localhost:3000/api/fundraiser'; // Update this with your actual API URL
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiZDlmNDU3LTU0ZjctNDMxMy1hYjE0LWI1NjgzMjhhZGYwMCIsInJvbGUiOiJkb25vciIsImlhdCI6MTczNTU4NzMzNSwiZXhwIjoxNzM2MTkyM'; // Replace with a valid auth token

async function testFundraiserCreation() {
  const formData = new FormData();
  formData.append('title', 'Test Fundraiser');
  formData.append('description', 'This is a test fundraiser for medical expenses');
  formData.append('goalAmount', '5000');
  formData.append('patientName', 'Jane Doe');
  formData.append('category', 'Medical');
  formData.append('beneficiary', 'Jane Doe');
  formData.append('deadline', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());

  // Add file uploads (replace with actual file paths on your system)
  formData.append('patientImage', await fileFromPath('./test/Screenshot 2.png'));
  formData.append('medicalDocument', await fileFromPath('./test/medical-report.png'));
  formData.append('qrCode', await fileFromPath('./test/Screenshot 2024-12-14 004059.png'));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': `authToken=${AUTH_TOKEN}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Fundraiser created successfully:', data);
      console.log('Fundraiser ID:', data.fundraiserID);
    } else {
      console.error('Failed to create fundraiser:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testFundraiserCreation();