# Chatbot Image Processing & Hospital Navigation Setup

This guide explains how to set up and use the new chatbot image processing functionality and hospital navigation features.

## 🖼️ Chatbot Image Processing

### Features Added:
- Image upload and analysis in the chatbot
- Support for medical documents and blood test reports
- Basic image analysis (dimensions, file size, format detection)
- Document type detection for medical forms

### Setup Instructions:

1. **Install Python Dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start the Flask Image Processing Server:**
   ```bash
   cd backend
   python start_flask_server.py
   ```
   The Flask server will run on `http://127.0.0.1:5002`

3. **Start the Main Backend Server:**
   ```bash
   cd backend
   npm start
   ```

4. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### How to Use Image Processing:
1. Open the chatbot on any page
2. Click the image upload button (📷)
3. Select an image file (PNG, JPG, JPEG, GIF, BMP)
4. The chatbot will analyze the image and provide information about:
   - Image dimensions and file size
   - Document type detection
   - Suggestions for medical documents

## 🗺️ Hospital Navigation System

### Features Added:
- Hospital location coordinates storage
- "Detect My Location" functionality for hospitals
- Navigation integration with OpenStreetMap
- Route planning from current location to hospital
- Interactive map display

### Database Changes:
The Hospital model now includes:
```javascript
location: {
  city: String,
  state: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  address: String
}
```

### How to Use Hospital Navigation:

#### For Hospitals (Setting Location):
1. Log in to the hospital dashboard
2. Click "Update Location" in the Location Management section
3. Use "Detect My Location" to automatically get coordinates, or manually enter:
   - Latitude (between -90 and 90)
   - Longitude (between -180 and 180)
   - Address (optional)
4. Click "Save Location"

#### For Users (Viewing Hospital Details):
1. Navigate to hospital details page
2. Click the map icon to show the location section
3. Click "Get My Location" to detect your current position
4. Click "Open Navigation" to get directions via OpenStreetMap
5. An embedded map will show the hospital location

### API Endpoints Added:

#### Update Hospital Location:
```
PUT /api/hospitals/location
Headers: Authorization: Bearer <token>
Body: {
  "latitude": number,
  "longitude": number,
  "address": string (optional)
}
```

#### Process Image:
```
POST /api/process-image
Body: FormData with 'file' field
```

## 🔧 Troubleshooting

### Image Processing Issues:
1. **Flask server not starting:**
   - Check if port 5002 is available
   - Ensure all Python dependencies are installed
   - Check Python version (3.7+ required)

2. **Image upload fails:**
   - Verify file type is supported (PNG, JPG, JPEG, GIF, BMP)
   - Check file size (should be reasonable)
   - Ensure Flask server is running on port 5002

### Navigation Issues:
1. **Location detection fails:**
   - Check browser permissions for geolocation
   - Ensure HTTPS is used (required for geolocation in some browsers)
   - Try refreshing the page

2. **Hospital coordinates not showing:**
   - Verify the hospital has updated their location
   - Check the database for coordinate values
   - Use the location update form in hospital dashboard

3. **OpenStreetMap not loading:**
   - Check internet connection
   - Verify the coordinates are valid
   - Try opening the navigation link in a new tab

## 📱 Browser Compatibility

### Image Processing:
- Modern browsers with File API support
- File upload size limits may vary by browser

### Navigation:
- Geolocation requires HTTPS in production
- OpenStreetMap works in all modern browsers
- Mobile browsers have better geolocation accuracy

## 🚀 Production Deployment

### Environment Variables:
```bash
# Flask Server
FLASK_ENV=production
FLASK_DEBUG=0

# Node.js Server
NODE_ENV=production
PORT=5000
```

### Security Considerations:
- Implement file size limits for image uploads
- Add file type validation on the server
- Use HTTPS for geolocation features
- Implement rate limiting for API endpoints

## 📝 Notes

- The Flask server runs independently on port 5002
- Image processing uses OpenCV for analysis
- Navigation uses OpenStreetMap for routing
- All coordinates are stored in decimal degrees format
- The system gracefully handles missing location data

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all servers are running
3. Check the network tab for failed requests
4. Ensure all dependencies are properly installed
