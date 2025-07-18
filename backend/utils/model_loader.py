import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import os
import joblib
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import nltk
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import re
import json

app = Flask(__name__)

# Define your model architecture (must match training)
class BrainTumorCNN(nn.Module):
    def __init__(self, num_classes=4):
        super(BrainTumorCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(128, 256, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Dropout(0.5),
            nn.Linear(256 * 14 * 14, 512),
            nn.ReLU(),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x
    
class SkinLesionCNN(nn.Module):
    def __init__(self, num_classes=2):
        super(SkinLesionCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(128, 256, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Dropout(0.5),
            nn.Linear(256 * 14 * 14, 512),
            nn.ReLU(),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x
    
def load_model(scan_type):
    """
    Load the appropriate model based on scan type (CPU only)
    """
    model_paths = {
        'brain-tumor': ('models/brain_tumor_model.pth', BrainTumorCNN, 4),
        'skin-lesions': ('models/skin_lesions_model.pth', SkinLesionCNN, 2)
        # Add other models as needed
    }

    if scan_type not in model_paths:
        raise ValueError(f"No model available for scan type: {scan_type}")

    model_path, model_class, num_classes = model_paths[scan_type]

    # Initialize model
    model = model_class(num_classes=num_classes)
    
    # Force CPU device
    device = torch.device("cpu")

    try:
        # Load trained weights (CPU only)
        model.load_state_dict(torch.load(model_path, map_location=device))
        model = model.to(device)
        model.eval()
        return model
    except Exception as e:
        raise RuntimeError(f"Failed to load model for {scan_type}: {str(e)}")

def predict_image(model, image_path, scan_type):
    """
    Make a prediction on an image using the loaded model (CPU only)
    """
    class_names = {
        'brain-tumor': ['glioma', 'meningioma', 'notumor', 'pituitary'],
        'skin-lesions': ['benign', 'malignant']
        # Add other scan types
    }.get(scan_type, ['Normal', 'Abnormal'])

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.5]*3, [0.5]*3)
    ])

    try:
        image = Image.open(image_path).convert('RGB')
        image = transform(image).unsqueeze(0)  # Add batch dimension
        image = image.to(torch.device("cpu"))  # Explicitly use CPU

        with torch.no_grad():
            outputs = model(image)
            probs = torch.nn.functional.softmax(outputs, dim=1)
            confidence, pred_idx = torch.max(probs, 1)

        prediction = class_names[pred_idx.item()]
        confidence = confidence.item()

        # Format prediction for display
        if scan_type == 'brain-tumor':
            if prediction == 'notumor':
                prediction = "No Tumor Detected"
            else:
                prediction = f"{prediction.capitalize()} Tumor Detected"
        elif scan_type == 'skin-lesions':
            prediction = prediction.replace('_', ' ').title()
            prediction = f"{prediction} Detected"

        return prediction, confidence

    except Exception as e:
        raise RuntimeError(f"Error during {scan_type} prediction: {str(e)}")
    
def load_risk_models():
    """Load the chronic disease risk prediction models"""
    try:
        diabetes_model = joblib.load("models/chronic_model.pkl")
        multi_model = joblib.load("models/chronic_multi_model.pkl")
        return diabetes_model, multi_model
    except Exception as e:
        raise Exception(f"Error loading risk models: {str(e)}")

def calculate_risk_level(prob):
    """Convert probability to risk level and percentage"""
    percentage = round(prob * 100, 1)
    if prob < 0.25:
        return {"level": "Low", "percentage": percentage}
    elif prob < 0.5:
        return {"level": "Moderate", "percentage": percentage}
    elif prob < 0.75:
        return {"level": "High", "percentage": percentage}
    else:
        return {"level": "Very High", "percentage": percentage}

def load_symptom_models():
    """Load the symptom checker models and vectorizers"""
    try:
        model = joblib.load("models/s2d_Random_model.pkl")
        tfidf = joblib.load("models/s2d_tfidf_vectorizer.pkl")
        encoder = joblib.load("models/s2d_Label_encoder.pkl")
        return model, tfidf, encoder
    except Exception as e:
        raise Exception(f"Error loading symptom models: {str(e)}")

def clean_symptom_text(text):
    """Clean and preprocess symptom text"""
    lemmatizer = WordNetLemmatizer()
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    words = text.split()
    words = [lemmatizer.lemmatize(word) for word in words if word not in stopwords.words('english')]
    return ' '.join(words)