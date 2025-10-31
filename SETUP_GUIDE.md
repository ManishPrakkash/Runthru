# RunThru - AI Code Explanation Platform

A modern, Matrix-themed code explanation platform that helps developers understand, refactor, and debug their code using AI assistance.

## 🚀 Features

- **Terminal-Style UI**: Immersive Matrix-themed interface with terminal aesthetics
- **Code Explanation**: Get detailed explanations of your code snippets
- **Code Refactoring**: AI-powered suggestions for improving your code
- **Debugging Assistance**: Identify and fix issues in your code
- **File Upload**: Support for multiple programming languages
- **User Authentication**: Secure login and registration system
- **History Tracking**: View and replay your previous code sessions
- **Audio Explanations**: Text-to-speech for code explanations
- **Visual Data**: Interactive visualizations for complex algorithms

## 🛠️ Tech Stack

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **CodeMirror** for code editing
- **React Markdown** for rich text rendering
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 📋 Prerequisites

Before running the application, make sure you have:

1. **Node.js** (version 16 or higher)
2. **MongoDB** (running locally or connection string)
3. **npm** or **yarn** package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Runthru-Ai-Code-Debug
```

### 2. Environment Configuration

Create environment files for both frontend and backend:

#### Backend Environment (server/.env)
```env
MONGO_URI=mongodb://localhost:27017/runthru
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

#### Frontend Environment (Runthru/.env)
```env
VITE_SERVER_URL=http://localhost:5000
```

### 3. Install Dependencies

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd Runthru
npm install
```

### 4. Start the Application

#### Option 1: Using Startup Scripts
- **Linux/Mac**: `./start.sh`
- **Windows**: `start.bat`

#### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd Runthru
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api

## 🎮 Usage

### 1. Authentication
- Register a new account or login with existing credentials
- The terminal-style interface will guide you through the process

### 2. Code Analysis
- Paste your code in the editor or upload a file
- Choose from three actions:
  - **Explain**: Get detailed code explanations
  - **Refactor**: Receive refactoring suggestions
  - **Debug**: Identify and fix potential issues

### 3. History
- View your previous code sessions
- Replay any previous analysis
- Track your learning progress

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Code Processing
- `POST /api/explain` - Get code explanation
- `POST /api/explain/refactor` - Get refactoring suggestions
- `POST /api/explain/debug` - Get debugging assistance
- `POST /api/explain/upload` - Upload code file

### History
- `GET /api/history` - Get user's code history

## 🎨 Customization

### Theme Customization
The Matrix theme can be customized in `Runthru/tailwind.config.js`:

```javascript
colors: {
  'matrix-green': '#39ff14',
  'matrix-dark': '#0D130D',
  'matrix-darker': '#050a05',
}
```

### Font Customization
The terminal font (VT323) can be changed in `Runthru/src/index.css`:

```css
font-family: 'VT323', monospace;
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGO_URI in server/.env

2. **Port Already in Use**
   - Change PORT in server/.env
   - Update VITE_SERVER_URL in Runthru/.env accordingly

3. **CORS Issues**
   - Verify the server URL configuration
   - Check that both servers are running on correct ports

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET configuration

### Development Tips

- Use browser dev tools to monitor API calls
- Check server logs for backend errors
- Use React DevTools for frontend debugging

## 📁 Project Structure

```
Runthru-Ai-Code-Debug/
├── Runthru/                 # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── context/        # React context providers
│   │   └── hooks/          # Custom React hooks
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Backend Node.js application
│   ├── controllers/         # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/         # Custom middleware
│   └── utils/             # Utility functions
├── start.sh               # Linux/Mac startup script
├── start.bat              # Windows startup script
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Happy Coding! 🎉**








