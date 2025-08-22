// Check if backend is running and accessible
const checkBackend = async () => {
  const backendUrl = 'http://localhost:4000';
  
  console.log('🔍 Checking backend status...');
  console.log(`📡 Backend URL: ${backendUrl}`);
  
  try {
    // Test health endpoint
    console.log('\n1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${backendUrl}/api/health`);
    
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log('✅ Health check passed:', data);
    } else {
      console.log('❌ Health check failed:', healthResponse.status, healthResponse.statusText);
    }
    
    // Test if server is responding
    console.log('\n2️⃣ Testing server response...');
    const serverResponse = await fetch(backendUrl);
    
    if (serverResponse.ok) {
      console.log('✅ Server is responding');
    } else {
      console.log('⚠️ Server response:', serverResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm run dev');
    console.log('2. Check if port 4000 is available');
    console.log('3. Verify no firewall blocking the connection');
    console.log('4. Check if another service is using port 4000');
  }
  
  console.log('\n📝 Next steps:');
  console.log('1. Start backend: cd backend && npm run dev');
  console.log('2. Create .env file with correct CORS_ORIGIN=http://localhost:5173');
  console.log('3. Test again');
};

checkBackend();
