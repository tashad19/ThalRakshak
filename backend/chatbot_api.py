from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import os
from werkzeug.utils import secure_filename
import cv2
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)

# Configure CORS properly for all routes
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
        "supports_credentials": True
    }
})

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_image(image_path):
    """Analyze uploaded image and provide relevant information"""
    try:
        # Read image using OpenCV
        image = cv2.imread(image_path)
        if image is None:
            return "Unable to read the image file."
        
        # Get image properties
        height, width, channels = image.shape
        file_size = os.path.getsize(image_path)
        
        # Basic image analysis
        analysis = {
            "dimensions": f"{width}x{height} pixels",
            "file_size": f"{file_size / 1024:.2f} KB",
            "channels": channels,
            "format": "RGB" if channels == 3 else "Grayscale" if channels == 1 else "Other"
        }
        
        # Check if it looks like a medical document or blood test
        # Convert to grayscale for text detection
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Simple edge detection to check for text-like patterns
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / (width * height)
        
        # Check for potential medical document characteristics
        if edge_density > 0.01:  # High edge density might indicate text
            analysis["document_type"] = "Potential medical document or form"
            analysis["suggestion"] = "This appears to be a document. If it's a blood test report, I can help you understand the results."
        else:
            analysis["document_type"] = "General image"
            analysis["suggestion"] = "This appears to be a general image. For blood-related analysis, please upload medical documents or test reports."
        
        return analysis
        
    except Exception as e:
        return f"Error analyzing image: {str(e)}"

# Simple intent detection using keyword matching
def detect_intent(text):
    text = text.lower()
    
    # Blood request keywords
    if any(word in text for word in ['blood', 'need blood', 'urgent', 'emergency', 'donor', 'donate blood']):
        return "blood_request"
    
    # Donation info keywords
    elif any(word in text for word in ['donate', 'donor', 'how to donate', 'become donor', 'donation']):
        return "donation_info"
    
    # Thalassemia info keywords
    elif any(word in text for word in ['thalassemia', 'thalassemia info', 'what is thalassemia', 'disease']):
        return "thalassemia_info"
    
    # General navigation
    else:
        return "general_navigation"

# Intent responses
intent_responses = {
    "blood_request": "I understand you need blood urgently. Please visit our emergency blood request page 👉 [Emergency Blood Request](https://bloodconnection.com/emergency)",
    "donation_info": "Great! To become a blood donor, please register here 👉 [Donor Registration](https://bloodconnection.com/donate)",
    "thalassemia_info": "Thalassemia is a genetic blood disorder that affects hemoglobin production. Learn more about symptoms, treatment, and support 👉 [Thalassemia Information](https://bloodconnection.com/about)",
    "general_navigation": "Welcome! I'm here to help with blood donation and Thalassemia support. You can ask me about blood requests, donor registration, or Thalassemia information."
}

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Detect intent
        intent = detect_intent(user_message)
        
        # Get response
        response = intent_responses.get(intent, "I'm sorry, I didn't understand that. Please try asking about blood donation or Thalassemia support.")
        
        return jsonify({
            "intent": intent,
            "response": response
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/process-image", methods=["POST", "OPTIONS"])
def process_image():
    # Handle preflight OPTIONS request
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        return response
    
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed. Please upload an image file."}), 400
        
        # Save file securely
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze the image
        analysis = analyze_image(filepath)
        
        # Clean up the uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)
        
        # Generate response based on analysis
        if isinstance(analysis, dict):
            response_text = f"""📷 **Image Analysis Complete**

📊 **Image Details:**
• Dimensions: {analysis.get('dimensions', 'Unknown')}
• File Size: {analysis.get('file_size', 'Unknown')}
• Format: {analysis.get('format', 'Unknown')}

📄 **Document Type:** {analysis.get('document_type', 'Unknown')}

💡 **Suggestion:** {analysis.get('suggestion', 'Please provide more context about this image.')}

🩸 **Blood Connection Tip:** If this is a medical document or blood test report, I can help you understand the results and guide you to appropriate resources."""
        else:
            response_text = f"❌ **Analysis Error:** {analysis}"
        
        response = jsonify({
            "success": True,
            "response": response_text,
            "analysis": analysis
        })
        
        # Add CORS headers
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        
        return response
        
    except Exception as e:
        error_response = jsonify({"error": f"Error processing image: {str(e)}"})
        error_response.headers.add("Access-Control-Allow-Origin", "*")
        error_response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        error_response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        return error_response, 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "message": "Chatbot API is running"})

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5002)
