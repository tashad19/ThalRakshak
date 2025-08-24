# Testing Guide for Image Processing & Navigation Features

This guide will help you test and verify that both the chatbot image processing and hospital navigation features are working correctly.

## 🚀 Quick Start Testing

### 1. Start All Servers

Open **3 separate terminal windows** and run these commands:

**Terminal 1 - Flask Image Processing Server:**
```bash
cd backend
python start_flask_server.py
```
Expected output: `Server will be available at: http://127.0.0.1:5002`

**Terminal 2 - Main Backend Server:**
```bash
cd backend
npm start
```
Expected output: `Server running on port 5000`

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```
Expected output: `Local: http://localhost:5173/`

### 2. Test Flask Server Directly

**Terminal 4 - Test Flask Server:**
```bash
cd backend
python test_flask_server.py
```

This will test:
- ✅ Health endpoint
- ✅ Chat endpoint  
- ✅ Process image endpoint
- ✅ CORS headers

Expected output: `✅ ALL TESTS PASSED`

## 🖼️ Testing Image Processing

### Test 1: Basic Image Upload
1. Open your browser and go to `http://localhost:5173`
2. Click the chatbot icon (bottom right)
3. Click the image upload button (📷)
4. Select any image file (PNG, JPG, etc.)
5. **Expected Result**: Chatbot should analyze the image and provide details

### Test 2: Medical Document Upload
1. Upload a medical document or blood test report image
2. **Expected Result**: Chatbot should detect it as a medical document and provide relevant suggestions

### Test 3: Error Handling
1. Try uploading a non-image file (like a .txt file)
2. **Expected Result**: Should show an error message about file type

## 🗺️ Testing Hospital Navigation

### Test 1: Hospital Location Update
1. Go to `http://localhost:5173/login`
2. Log in as a hospital user
3. Go to the hospital dashboard
4. Click "Update Location" in the Location Management section
5. Click "Detect My Location" (allow browser permissions)
6. Click "Save Location"
7. **Expected Result**: Location should be saved successfully

### Test 2: View Hospital Details
1. In the hospital dashboard, click "View Details"
2. Click the map icon to show the location section
3. Click "Get My Location" (allow browser permissions)
4. Click "Open Navigation"
5. **Expected Result**: Should open OpenStreetMap with navigation directions

### Test 3: Navigation Without Coordinates
1. Create a new hospital account without setting coordinates
2. Try to view details and use navigation
3. **Expected Result**: Should show a message asking to update location

## 🔧 Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:

1. **Check Flask Server:**
   ```bash
   curl -X OPTIONS http://127.0.0.1:5002/api/process-image
   ```
   Should return 200 status

2. **Check Backend Server:**
   ```bash
   curl -X OPTIONS http://localhost:5000/api/process-image
   ```
   Should return 200 status

### Image Processing Not Working
1. **Check Flask Server Logs:**
   Look for errors in Terminal 1 (Flask server)

2. **Check Network Tab:**
   - Open browser DevTools
   - Go to Network tab
   - Upload an image
   - Check if request to `/api/process-image` succeeds

3. **Test Direct Flask API:**
   ```bash
   curl -X POST -F "file=@test_image.jpg" http://127.0.0.1:5002/api/process-image
   ```

### Navigation Not Working
1. **Check Browser Permissions:**
   - Ensure location access is allowed
   - Try refreshing the page

2. **Check Coordinates:**
   - Verify hospital has valid coordinates in database
   - Check browser console for geolocation errors

3. **Test OpenStreetMap:**
   - Manually open: `https://www.openstreetmap.org`
   - Verify internet connection

## 📊 Expected API Responses

### Successful Image Processing Response:
```json
{
  "success": true,
  "response": "📷 **Image Analysis Complete**\n\n📊 **Image Details:**\n• Dimensions: 1920x1080 pixels\n• File Size: 245.67 KB\n• Format: RGB\n\n📄 **Document Type:** Potential medical document or form\n\n💡 **Suggestion:** This appears to be a document...",
  "analysis": {
    "dimensions": "1920x1080 pixels",
    "file_size": "245.67 KB",
    "channels": 3,
    "format": "RGB",
    "document_type": "Potential medical document or form",
    "suggestion": "This appears to be a document..."
  }
}
```

### Successful Location Update Response:
```json
{
  "message": "Location updated successfully",
  "location": {
    "city": "New York",
    "state": "NY",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "address": "123 Main St, New York, NY"
  }
}
```

## 🐛 Common Issues & Solutions

### Issue: "Flask server not starting"
**Solution:**
- Check if port 5002 is available: `lsof -i :5002`
- Kill any process using the port: `kill -9 <PID>`
- Ensure Python dependencies are installed: `pip install -r requirements.txt`

### Issue: "Image upload fails"
**Solution:**
- Check file size (should be < 50MB)
- Verify file type (PNG, JPG, JPEG, GIF, BMP)
- Check Flask server is running on port 5002
- Verify network connectivity

### Issue: "Location detection fails"
**Solution:**
- Check browser permissions for geolocation
- Try using HTTPS (required in some browsers)
- Test on mobile device (better GPS accuracy)
- Check if location services are enabled

### Issue: "OpenStreetMap not loading"
**Solution:**
- Check internet connection
- Verify coordinates are valid (latitude: -90 to 90, longitude: -180 to 180)
- Try opening navigation link in new tab
- Check if OpenStreetMap is accessible in your region

## 📱 Browser Compatibility

### Image Processing:
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Navigation:
- ✅ Chrome 80+ (HTTPS required for geolocation)
- ✅ Firefox 75+ (HTTPS required for geolocation)
- ✅ Safari 13+ (HTTPS required for geolocation)
- ✅ Edge 80+ (HTTPS required for geolocation)

## 🎯 Success Criteria

Your implementation is working correctly if:

1. **Image Processing:**
   - ✅ Can upload images through chatbot
   - ✅ Receives analysis response
   - ✅ Handles different file types correctly
   - ✅ Shows appropriate error messages

2. **Navigation:**
   - ✅ Hospitals can update their location
   - ✅ Location detection works in browser
   - ✅ Navigation opens in OpenStreetMap
   - ✅ Embedded map shows hospital location

3. **Integration:**
   - ✅ No CORS errors in browser console
   - ✅ All API endpoints respond correctly
   - ✅ Error handling works gracefully

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs** in all terminal windows
2. **Use browser DevTools** to check network requests
3. **Run the test script** to verify Flask server
4. **Check this troubleshooting guide**
5. **Verify all servers are running** on correct ports

Remember: The Flask server must be running on port 5002 for image processing to work!
