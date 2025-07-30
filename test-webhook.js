// Test script to verify webhook endpoints
const testPilotWebhook = async () => {
  console.log('Testing pilot webhook endpoint...');
  
  try {
    const response = await fetch('https://primary-w2wb-edtechstudio.up.railway.app/webhook/pilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        company: 'Test Company',
        website: 'https://test.com'
      }),
    });

    console.log('Response status:', response.status);
    const data = await response.text();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Pilot webhook test PASSED');
    } else {
      console.log('❌ Pilot webhook test FAILED');
    }
  } catch (error) {
    console.error('❌ Pilot webhook test ERROR:', error);
  }
};

const testToolCallWebhook = async () => {
  console.log('\nTesting toolCall webhook endpoint...');
  
  try {
    const formData = new FormData();
    formData.append('callId', 'test-call-id');
    formData.append('name', 'Test User');
    formData.append('phone', '+1234567890');
    formData.append('email', 'test@example.com');

    const response = await fetch('https://primary-w2wb-edtechstudio.up.railway.app/webhook/toolCall', {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });

    console.log('Response status:', response.status);
    console.log('Response type:', response.type);
    
    if (response.type === 'opaque') {
      console.log('✅ ToolCall webhook test PASSED (no-cors mode)');
    } else {
      console.log('❌ ToolCall webhook test FAILED');
    }
  } catch (error) {
    console.error('❌ ToolCall webhook test ERROR:', error);
  }
};

// Run tests
testPilotWebhook();
testToolCallWebhook(); 