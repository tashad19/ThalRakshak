# Chatbot Setup Guide

## 🚀 Quick Start

### 1. Start the Flask API Server

Navigate to the backend directory and start the Flask server:

```bash
cd backend
pip install -r requirements.txt
python chatbot_api.py
```

The API will be available at `http://localhost:5000`

### 2. Start the Frontend

In a new terminal, navigate to the frontend directory and start the development server:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🎯 Features

### ✅ **Functional Chatbot**
- **Real-time API Integration**: Connects to Flask backend for intent classification
- **Smart Intent Detection**: Recognizes blood requests, donation info, and Thalassemia queries
- **Interactive Responses**: Provides relevant links and information
- **Error Handling**: Graceful fallbacks when API is unavailable

### 🎨 **Improved UI/UX**
- **Better Positioning**: Chatbot window has proper margins and doesn't touch screen edges
- **Translucent Overlay**: Background overlay is now gray and translucent instead of black
- **Responsive Design**: Works perfectly on mobile and desktop
- **Smooth Animations**: Enhanced transitions and visual feedback

### 🔧 **Technical Improvements**
- **Async Message Handling**: Proper async/await for API calls
- **Loading States**: Visual feedback during message sending
- **Link Rendering**: Clickable links in bot responses
- **Error Recovery**: Toast notifications for connection issues

## 🧪 Testing the Chatbot

### Test Messages:
1. **"I need blood urgently"** → Blood request response
2. **"How to become a donor?"** → Donation info response  
3. **"Tell me about Thalassemia"** → Thalassemia information
4. **"Hello"** → General navigation response

### Quick Actions:
- Click the floating chat button to open the chatbot
- Use the quick action buttons for common queries
- Try voice input (if supported by browser)
- Upload images (acknowledgment only)

## 🔧 API Endpoints

### POST `/chat`
Send a message and get intent classification:

```json
{
  "message": "I need blood urgently"
}
```

Response:
```json
{
  "intent": "blood_request",
  "response": "I understand you need blood urgently. Please visit our emergency blood request page 👉 [Emergency Blood Request](https://bloodconnection.com/emergency)"
}
```

### GET `/health`
Check API status:
```json
{
  "status": "healthy",
  "message": "Chatbot API is running"
}
```

## 🎨 UI Improvements Made

### **Chatbot Window**
- ✅ Added margins (`mr-4 mb-4`) to prevent touching screen edges
- ✅ Rounded corners (`rounded-tl-2xl rounded-bl-2xl`) for modern look
- ✅ Better shadow and positioning

### **Background Overlay**
- ✅ Changed from `bg-black bg-opacity-50` to `bg-gray-600 bg-opacity-30`
- ✅ Now translucent gray instead of opaque black
- ✅ Better visual hierarchy

### **Message Handling**
- ✅ Async API integration with proper error handling
- ✅ Loading spinners during message sending
- ✅ Clickable links in bot responses
- ✅ Intent labels and better message formatting

## 🚀 Production Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend
```bash
cd backend
# Update API URL in chatbot-widget.tsx for production
# Deploy to your preferred hosting service (Heroku, AWS, etc.)
```

## 🔧 Configuration

### Update API URL
In `frontend/components/chatbot/chatbot-widget.tsx`, update the API URL:
```javascript
const response = await fetch('YOUR_PRODUCTION_API_URL/chat', {
  // ... rest of the code
});
```

### Environment Variables
Create `.env` files for different environments:
```bash
# .env.development
VITE_API_URL=http://localhost:5000

# .env.production  
VITE_API_URL=https://your-api-domain.com
```

## 🎉 Success!

Your chatbot is now fully functional with:
- ✅ Real API integration
- ✅ Beautiful, responsive UI
- ✅ Proper error handling
- ✅ Modern animations and interactions
- ✅ Medical-themed design

The chatbot will help users with blood donation requests, donor registration, and Thalassemia information!
