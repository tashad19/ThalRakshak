#!/usr/bin/env python3
"""
Flask Server for Image Processing
This script starts the Flask server that handles image processing for the chatbot.
"""

import os
import sys
from chatbot_api import app

if __name__ == "__main__":
    print("Starting Flask Image Processing Server...")
    print("Server will be available at: http://127.0.0.1:5002")
    print("Press Ctrl+C to stop the server")
    
    try:
        app.run(debug=True, host="127.0.0.1", port=5002)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1)
