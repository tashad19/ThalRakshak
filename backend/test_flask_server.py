#!/usr/bin/env python3
"""
Test script for Flask Image Processing Server
This script tests the Flask server endpoints to ensure they're working correctly.
"""

import requests
import json
import os

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        response = requests.get('http://127.0.0.1:5002/health')
        print(f"Health endpoint status: {response.status_code}")
        print(f"Health response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health endpoint error: {e}")
        return False

def test_chat_endpoint():
    """Test the chat endpoint"""
    try:
        data = {"message": "I need blood urgently"}
        response = requests.post('http://127.0.0.1:5002/chat', json=data)
        print(f"Chat endpoint status: {response.status_code}")
        print(f"Chat response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Chat endpoint error: {e}")
        return False

def test_process_image_endpoint():
    """Test the process-image endpoint with a dummy image"""
    try:
        # Create a simple test image
        from PIL import Image
        import io
        
        # Create a simple test image
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {'file': ('test.png', img_bytes, 'image/png')}
        response = requests.post('http://127.0.0.1:5002/api/process-image', files=files)
        
        print(f"Process image endpoint status: {response.status_code}")
        print(f"Process image response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Process image endpoint error: {e}")
        return False

def test_cors_headers():
    """Test CORS headers"""
    try:
        response = requests.options('http://127.0.0.1:5002/api/process-image')
        print(f"CORS test status: {response.status_code}")
        print(f"CORS headers: {dict(response.headers)}")
        return response.status_code == 200
    except Exception as e:
        print(f"CORS test error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Flask Image Processing Server...")
    print("=" * 50)
    
    # Test all endpoints
    tests = [
        ("Health Endpoint", test_health_endpoint),
        ("Chat Endpoint", test_chat_endpoint),
        ("Process Image Endpoint", test_process_image_endpoint),
        ("CORS Headers", test_cors_headers),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\nTesting {test_name}...")
        result = test_func()
        results.append((test_name, result))
        print(f"{test_name}: {'✅ PASS' if result else '❌ FAIL'}")
    
    print("\n" + "=" * 50)
    print("Test Summary:")
    for test_name, result in results:
        print(f"{test_name}: {'✅ PASS' if result else '❌ FAIL'}")
    
    all_passed = all(result for _, result in results)
    print(f"\nOverall: {'✅ ALL TESTS PASSED' if all_passed else '❌ SOME TESTS FAILED'}")
