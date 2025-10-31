# RunThru Configuration Guide

## Environment Setup Required

### 1. Create Environment Files

Create these files with the following content:

**Root `.env` file:**
```
MONGO_URI=mongodb://localhost:27017/runthru
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
VITE_SERVER_URL=http://localhost:5000
```

**Server `.env` file (server/.env):**
```
MONGO_URI=mongodb://localhost:27017/runthru
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### 2. Required API Keys

- **Gemini API Key**: Get from https://makersuite.google.com/app/apikey
- **MongoDB**: Install MongoDB locally or use MongoDB Atlas

### 3. Installation Steps

1. Install dependencies:
   ```bash
   # Frontend
   cd Runthru
   npm install
   
   # Backend
   cd ../server
   npm install
   ```

2. Start the application:
   ```bash
   # Use the provided start script
   ./start.bat  # Windows
   ./start.sh   # Linux/Mac
   ```

### 4. Access URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 5. Troubleshooting

- Ensure MongoDB is running
- Check that all environment variables are set
- Verify API keys are valid
- Check console for error messages

