import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
import threading
import time

app = Flask(__name__)
CORS(app)

class HandSignRecognizer:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.mp_drawing = mp.solutions.drawing_utils
        
        # Initialize ALL model attributes
        self.model_landmark = None
        self.model_enhanced = None
        self.model_mobilenet = None  # Add this line!
        
        # Load your trained models
        try:
            # Load landmark model
            try:
                self.model_landmark = tf.keras.models.load_model('../Model/asl_model_landmark.keras')
                print("✅ Landmark model loaded successfully")
            except Exception as e:
                print(f"❌ Failed to load landmark model: {e}")
            
            # Load enhanced model
            try:
                self.model_enhanced = tf.keras.models.load_model('../Model/asl_model_enhanced.keras')
                print("✅ Enhanced model loaded successfully")
            except Exception as e:
                print(f"❌ Failed to load enhanced model: {e}")
            
            # Skip MobileNet model (it's empty)
            print("⚠️ Skipping MobileNet model (empty file)")
            
        except Exception as e:
            print(f"❌ Error during model loading: {e}")
    
    def preprocess_frame(self, frame):
        """Preprocess frame for hand detection"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        return rgb_frame
    
    def extract_landmarks(self, hand_landmarks):
        """Extract hand landmarks for model prediction"""
        landmarks = []
        for lm in hand_landmarks.landmark:
            landmarks.extend([lm.x, lm.y, lm.z])
        return np.array(landmarks)

    def predict_sign(self, frame):
        """Predict hand sign from frame"""
        try:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.hands.process(rgb_frame)
            
            predictions = []
            
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    landmarks = self.extract_landmarks(hand_landmarks)
                    # Prepare predictions for each model
                    sign_mapping = {
                        0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E',
                        5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J',
                        10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O',
                        15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T',
                        20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y', 25: 'Z'
                    }

                    # Predict using enhanced model
                    if self.model_landmark:
                        try:
                            landmark_pred = self.model_landmark.predict(landmarks.reshape(1, -1), verbose=0)
                            predicted_class = np.argmax(landmark_pred)
                            confidence = np.max(landmark_pred)
                            
                            predicted_sign = sign_mapping.get(predicted_class, 'Unknown')
                            
                            predictions.append({
                                'sign': predicted_sign,
                                'confidence': float(confidence),
                                'model': 'landmark'
                            })
                            
                        except Exception as e:
                            print(f"Landmark prediction error: {e}")
        
            return {
                'success': True,
                'predictions': predictions,
                'hands_detected': len(predictions)
            }
            #default return if no hands detected
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'predictions': []
            }

# Initialize recognizer
recognizer = HandSignRecognizer()

@app.route('/predict', methods=['POST'])
def predict_hand_sign():
    """API endpoint to predict hand sign from image"""
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to OpenCV format
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Predict
        result = recognizer.predict_sign(frame)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    models_status = {
        'landmark': recognizer.model_landmark is not None,
        'enhanced': recognizer.model_enhanced is not None,
        'mobilenet': recognizer.model_mobilenet is not None
    }
    
    return jsonify({
        'status': 'healthy',
        'models_loaded': models_status,
        'any_model_loaded': any(models_status.values())
    })

@app.route('/test', methods=['GET'])
def test_endpoint():
    """Test endpoint"""
    return jsonify({
        'message': 'Hand Sign Server is running!',
        'status': 'ok'
    })

if __name__ == '__main__':
    print("Starting Hand Sign Recognition Server...")
    app.run(host='0.0.0.0', port=5000, debug=True)