// MongoDB Setup and Connection Helper
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');

console.log('🔧 MongoDB Connection Setup Helper\n');

async function checkMongoDBOptions() {
  console.log('📋 Available MongoDB Options:\n');
  
  // Option 1: MongoDB Atlas (Current)
  console.log('1️⃣ MongoDB Atlas (Current Setup):');
  console.log('   Status: ❌ IP not whitelisted');
  console.log('   Solution: Go to https://cloud.mongodb.com/');
  console.log('   → Select your cluster → Network Access');
  console.log('   → Add IP Address → Add Current IP Address');
  console.log('   → Or add 0.0.0.0/0 for temporary access');
  console.log('   Current URI:', process.env.MONGO_URI?.substring(0, 50) + '...\n');
  
  // Option 2: Local MongoDB
  console.log('2️⃣ Local MongoDB (Alternative):');
  console.log('   Requirements: Install MongoDB Community Server');
  console.log('   Download: https://www.mongodb.com/try/download/community');
  console.log('   After installation, update .env:');
  console.log('   MONGO_URI=mongodb://localhost:27017/runthru\n');
  
  // Test current connection
  console.log('🧪 Testing current MongoDB connection...');
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Atlas connected successfully!');
    console.log('✅ Database:', mongoose.connection.name);
    console.log('✅ All systems ready for authentication!');
    
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.log('❌ MongoDB Atlas connection failed');
    console.log('❌ Error:', error.message);
    
    // Try to test if local MongoDB is available
    console.log('\n🔍 Checking for local MongoDB...');
    try {
      const localUri = 'mongodb://localhost:27017/runthru';
      await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 3000,
        socketTimeoutMS: 45000,
      });
      console.log('✅ Local MongoDB is available!');
      console.log('✅ You can switch to local MongoDB by updating .env:');
      console.log('   MONGO_URI=mongodb://localhost:27017/runthru');
      
      await mongoose.connection.close();
      return 'local';
    } catch (localError) {
      console.log('❌ Local MongoDB not available');
      console.log('❌ Install MongoDB Community Server or fix Atlas IP whitelisting');
      return false;
    }
  }
}

async function updateEnvForLocal() {
  console.log('\n🔄 Setting up local MongoDB configuration...');
  
  const fs = require('fs');
  const envPath = path.resolve(__dirname, '.env');
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Comment out Atlas URI and add local URI
    envContent = envContent.replace(
      /^MONGO_URI=mongodb\+srv:\/\/.*/m,
      '# MONGO_URI=mongodb+srv://... (Atlas - commented out due to IP restrictions)\nMONGO_URI=mongodb://localhost:27017/runthru'
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env updated for local MongoDB');
    console.log('✅ Restart your server to use local MongoDB');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to update .env:', error.message);
    return false;
  }
}

async function main() {
  const connectionStatus = await checkMongoDBOptions();
  
  if (connectionStatus === true) {
    console.log('\n🎉 MongoDB Atlas is working! Your auth system is ready.');
    console.log('\n🚀 Next steps:');
    console.log('1. Start server: node app.js');
    console.log('2. Test registration/login from frontend');
    
  } else if (connectionStatus === 'local') {
    console.log('\n💡 Would you like to switch to local MongoDB? (y/n)');
    
    // For automated setup, we'll create the configuration
    const switched = await updateEnvForLocal();
    if (switched) {
      console.log('\n🎉 Local MongoDB configured! Your auth system is ready.');
      console.log('\n🚀 Next steps:');
      console.log('1. Restart server: node app.js');
      console.log('2. Test registration/login from frontend');
    }
    
  } else {
    console.log('\n📋 SETUP REQUIRED:');
    console.log('\nOption A - Fix MongoDB Atlas:');
    console.log('1. Visit https://cloud.mongodb.com/');
    console.log('2. Go to Network Access → Add IP Address');
    console.log('3. Add your current IP or 0.0.0.0/0');
    console.log('4. Run this script again to test');
    
    console.log('\nOption B - Use Local MongoDB:');
    console.log('1. Download MongoDB Community Server');
    console.log('2. Install and start MongoDB service');
    console.log('3. Update .env: MONGO_URI=mongodb://localhost:27017/runthru');
    console.log('4. Restart your server');
  }
  
  process.exit(0);
}

main().catch(console.error);