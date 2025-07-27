# RunThru - AI-Powered Code Explanation and Visualization Tool

A comprehensive web application that provides AI-powered code explanation, debugging, refactoring, and **step-by-step dry run visualization** with voice explanations.

## 🚀 Features

### Core Features
- **Code Explanation**: AI-powered explanations of code functionality
- **Code Debugging**: Automatic error detection and correction suggestions
- **Code Refactoring**: Performance and readability improvement suggestions
- **File Upload**: Support for uploading code files
- **History**: Save and review past code analyses

### 🎯 NEW: Dry Run Feature
- **Step-by-step Visualization**: Interactive visual representation of code execution
- **Dynamic Programming Support**: Specialized visualization for DP algorithms
- **Voice Explanations**: Browser-based text-to-speech for each step
- **Interactive Controls**: Play, pause, step forward/backward, speed control
- **Multiple Algorithm Types**: Array traversal, binary search, sorting, graph algorithms
- **Real-time Variable Tracking**: See variable changes at each step

## 🛠️ Technology Stack

### Frontend
- **React 18** with Hooks
- **Tailwind CSS** for styling
- **P5.js** for interactive visualizations
- **Framer Motion** for animations
- **CodeMirror** for code editing

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Google Gemini AI** for code analysis
- **JWT** for authentication
- **Multer** for file uploads

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google Gemini API key

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd runthru_starter_template
```

### 2. Backend Setup
```bash
cd server
npm install
```

### 3. Frontend Setup
```bash
cd ../Runthru
npm install
```

### 4. Environment Configuration

Create a `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Runthru
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🎮 How to Use

### Basic Usage
1. **Register/Login**: Create an account or log in
2. **Enter Code**: Paste your code in the editor or upload a file
3. **Choose Action**: Click one of the action buttons:
   - **Explain Code**: Get AI explanation
   - **Debug Code**: Find and fix errors
   - **Refactor Code**: Get improvement suggestions
   - **Dry Run**: Step-by-step visualization ⭐

### Dry Run Feature
1. **Enter Algorithm Code**: Paste any algorithm (DP, sorting, search, etc.)
2. **Click "Dry Run"**: The system will analyze your code
3. **Watch Visualization**: See step-by-step execution
4. **Listen to Explanation**: Click play for voice narration
5. **Control Playback**: Use play/pause, step forward/backward, speed control

### Supported Algorithm Types
- **Dynamic Programming**: Fibonacci, LCS, Knapsack, Coin Change
- **Array Traversal**: Sum, find, filter operations
- **Binary Search**: Standard binary search algorithms
- **Sorting**: Bubble sort, merge sort, quick sort
- **Graph Algorithms**: BFS, DFS, shortest path
- **Tree Algorithms**: Tree traversal, BST operations

## 📁 Project Structure

```
runthru_starter_template/
├── Runthru/                    # Frontend React app
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── AudioPlayer.jsx # Browser-based TTS
│   │   │   ├── Visualizer.jsx  # Interactive visualizations
│   │   │   └── ...
│   │   ├── services/           # API services
│   │   └── ...
│   └── package.json
├── server/                     # Backend Node.js app
│   ├── controllers/            # Route controllers
│   │   └── explainController.js # Dry run logic
│   ├── utils/                  # Utility functions
│   │   ├── gptHelper.js        # AI integration
│   │   └── ttsHelper.js        # Text-to-speech
│   ├── examples/               # Sample code examples
│   │   └── dp_examples.txt     # DP algorithm examples
│   └── package.json
└── README.md
```

## 🧪 Testing

### Test Dry Run Feature
```bash
cd server
node test_dryrun.js
```

### Sample Code Examples
Check `server/examples/dp_examples.txt` for ready-to-test algorithms:
- Fibonacci with memoization
- Longest Common Subsequence
- Coin Change Problem
- Binary Search
- Bubble Sort
- Knapsack Problem

## 🔧 Configuration

### Customizing Visualizations
The visualizer supports different algorithm types. To add new types:
1. Update `gptHelper.js` with new algorithm detection
2. Add visualization logic in `Visualizer.jsx`
3. Update the switch statement in the draw function

### TTS Configuration
The app uses browser-based TTS (Web Speech API) which:
- ✅ No external dependencies
- ✅ Works offline
- ✅ Free to use
- ✅ Supports multiple voices and speeds

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MONGO_URI in .env
   - Ensure MongoDB is running

2. **Gemini API Error**
   - Verify your GEMINI_API_KEY
   - Check API quota limits

3. **TTS Not Working**
   - Ensure browser supports Web Speech API
   - Check browser permissions

4. **Visualization Not Loading**
   - Check browser console for errors
   - Verify code syntax

### Browser Compatibility
- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for code analysis
- P5.js for visualization capabilities
- Web Speech API for text-to-speech
- React and Node.js communities

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Test with sample code from examples
4. Create an issue in the repository

---

**Happy Coding! 🚀**
