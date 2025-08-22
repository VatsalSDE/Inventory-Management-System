// Simple test script to verify backend is running
const testBackend = async () => {
  try {
    console.log('🔌 Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:4000/api/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend health check:', healthData);
    } else {
      console.log('❌ Backend health check failed:', healthResponse.status);
    }

    // Test products endpoint (should fail without auth)
    try {
      const productsResponse = await fetch('http://localhost:4000/api/products');
      if (productsResponse.status === 401) {
        console.log('✅ Products endpoint requires authentication (expected)');
      } else {
        console.log('⚠️ Products endpoint response:', productsResponse.status);
      }
    } catch (err) {
      console.log('❌ Products endpoint error:', err.message);
    }

    console.log('\n🎉 Backend test completed!');
    console.log('📝 Next steps:');
    console.log('1. Create a .env file in backend folder');
    console.log('2. Update with your remote database details');
    console.log('3. Run: npm run migrate');
    console.log('4. Run: npm run seed');
    console.log('5. Test login with: admin / admin123');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running on port 4000');
    console.log('2. Check if you can access http://localhost:4000/api/health');
    console.log('3. Verify CORS settings in backend');
  }
};

testBackend();
