import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
import os

# Load the new landmark-based model
MODEL_PATH = "Model/asl_model_landmark.keras"
model = tf.keras.models.load_model(MODEL_PATH)

# Original class names (what the model was trained on)
ORIGINAL_CLASSES = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ") + ["del", "space", "nothing"]

# Word mapping for each letter/sign
WORD_MAPPING = {
    "A": "How",     "B": "Are",      "C": "You",       "D": "I",
    "E": "Am",      "F": "Fine",      "G": "About",      "H": "Hat",
    "I": "Ice",       "J": "Juice",     "K": "Kite",      "L": "Lion",
    "M": "Mouse",     "N": "Nest",      "O": "Orange",    "P": "Pen",
    "Q": "Queen",     "R": "Rabbit",    "S": "Sun",       "T": "Tree",
    "U": "Umbrella",  "V": "Van",       "W": "Water",     "X": "Xray",
    "Y": "Yellow",    "Z": "Zebra",
    "del": "Delete",  "space": "Space", "nothing": "Nothing"
}

# MediaPipe hands setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.6)
mp_drawing = mp.solutions.drawing_utils

# Webcam stream
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)

    prediction_text = "No hand detected"

    if results.multi_hand_landmarks:
        h, w, _ = frame.shape
        hand_landmarks = results.multi_hand_landmarks[0]

        # Draw landmarks
        mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        # Extract landmark coordinates
        landmark_list = [[lm.x, lm.y, lm.z] for lm in hand_landmarks.landmark]
        flat_input = np.array(landmark_list).flatten().reshape(1, -1)

        # Predict
        prediction = model.predict(flat_input)
        class_index = np.argmax(prediction[0])
        confidence = float(prediction[0][class_index])
        
        # Get the original class (letter) and map it to a word
        original_class = ORIGINAL_CLASSES[class_index]
        word = WORD_MAPPING[original_class]

        prediction_text = f"{word} ({confidence*100:.1f}%)"

    # Display result
    cv2.putText(frame, prediction_text, (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 200, 0), 2)
    cv2.imshow("ASL Real-Time Predictor", frame)

    if cv2.waitKey(1) & 0xFF == 27:  # ESC to exit
        break

cap.release()
cv2.destroyAllWindows()