import os
import cv2
import numpy as np
import mediapipe as mp
from tqdm import tqdm
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import matplotlib.pyplot as plt
import joblib

# Config
DATASET_PATH = "../Model/Dataset/asl_alphabet_train"
MODEL_SAVE_PATH = "../Model/asl_model_landmark.keras"
ENCODER_SAVE_PATH = "../Model/label_encoder.pkl"

# MediaPipe Hand Landmarks
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1)

def extract_landmarks(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return None
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)
    if result.multi_hand_landmarks:
        return np.array([[lm.x, lm.y, lm.z] for lm in result.multi_hand_landmarks[0].landmark]).flatten()
    return None

# Load Dataset
X, y = [], []
for label in tqdm(os.listdir(DATASET_PATH), desc="Loading dataset"):
    class_path = os.path.join(DATASET_PATH, label)
    if not os.path.isdir(class_path): continue
    for img_file in os.listdir(class_path):
        if img_file.lower().endswith(('.png', '.jpg', '.jpeg')):
            img_path = os.path.join(class_path, img_file)
            landmarks = extract_landmarks(img_path)
            if landmarks is not None:
                X.append(landmarks)
                y.append(label)
hands.close()

# Encode labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Train/Val Split
X = np.array(X)
y = np.array(y_encoded)
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, stratify=y)

# Model
model = Sequential([
    Dense(256, activation='relu', input_shape=(X.shape[1],)),
    Dropout(0.3),
    Dense(128, activation='relu'),
    Dropout(0.3),
    Dense(len(le.classes_), activation='softmax')
])
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Callbacks
callbacks = [
    EarlyStopping(patience=5, restore_best_weights=True),
    ReduceLROnPlateau(factor=0.5, patience=3),
    ModelCheckpoint(MODEL_SAVE_PATH, save_best_only=True)
]

# Train
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=50,
    callbacks=callbacks
)

# Save
model.save(MODEL_SAVE_PATH)
joblib.dump(le, ENCODER_SAVE_PATH)

# Plot
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Train')
plt.plot(history.history['val_accuracy'], label='Validation')
plt.legend()
plt.title('Accuracy')

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Train')
plt.plot(history.history['val_loss'], label='Validation')
plt.legend()
plt.title('Loss')
plt.tight_layout()
plt.show()