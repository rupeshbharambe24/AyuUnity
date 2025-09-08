from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS 
from utils.model_loader import load_model, predict_image, load_symptom_models, clean_symptom_text
from utils.gemini_integration import get_medical_suggestions, get_disease_info
import joblib
import pandas as pd
from flask import request, jsonify
from utils.model_loader import load_risk_models, calculate_risk_level
import re
import nltk
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import google.generativeai as genai
import json
import re

app = Flask(__name__)
CORS(app)
CORS(app, resources={
    r"/predict-chronic-risk": {
        "origins": ["http://localhost:3000"]
    }
})

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'dcm'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/analyze/<scan_type>', methods=['POST'])
def analyze_scan(scan_type):
    # Check if scan type is valid
    valid_scan_types = {
        'bone-fracture', 'brain-tumor', 'lung-cancer',
        'renal-malignancy', 'skin-lesions', 'general-scan'
    }
    
    if scan_type not in valid_scan_types:
        return jsonify({
            'error': 'Invalid scan type',
            'message': f"Supported types: {', '.join(valid_scan_types)}"
        }), 400
    
    # File handling
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not (file and allowed_file(file.filename)):
        return jsonify({
            'error': 'File type not allowed',
            'allowed': ALLOWED_EXTENSIONS
        }), 400
    
    try:
        # Save file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Load model with error handling
        try:
            model = load_model(scan_type)
        except Exception as e:
            return jsonify({
                'error': 'Model loading failed',
                'message': str(e)
            }), 500
        
        # Make prediction
        prediction, confidence = predict_image(model, filepath, scan_type)
        
        # Get Gemini info
        try:
            gemini_response = get_medical_suggestions(scan_type, prediction)
            if isinstance(gemini_response, dict):
                disease_info = gemini_response.get('disease_info', 'No additional info')
                recommendations = gemini_response.get('recommendations', [])
            else:
                raise ValueError("Invalid Gemini response format")
        except Exception as e:
            app.logger.error(f"Gemini error: {e}")
            disease_info = "No additional information available"
            recommendations = [
                "Consult with a specialist",
                "Consider follow-up examination",
                "Discuss results with your healthcare provider"
            ]

        # Clean up
        try:
            os.remove(filepath)
        except:
            pass

        return jsonify({
            'prediction': prediction,
            'confidence': float(confidence),
            'severity': 'abnormal' if 'detected' in prediction.lower() else 'normal',
            'details': f"AI analysis indicates: {prediction}",
            'disease_info': disease_info,
            'recommendations': recommendations
        })

    except Exception as e:
        app.logger.error(f"Analysis failed: {str(e)}")
        return jsonify({
            'error': 'Analysis failed',
            'message': str(e)
        }), 500

@app.route('/predict-chronic-risk', methods=['POST'])
def predict_chronic_risk():
    try:
        # Get data from request
        data = request.json
        
        # Validate required fields
        required_fields = ['age', 'gender', 'bmi', 'cholesterol', 
                         'triglycerides', 'hdl', 'ldl', 'creatinine', 'bun']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Convert gender to binary (M=1, F=0)
        gender_bin = 1 if str(data['gender']).upper() in ['M', 'MALE'] else 0
        
        # Create input DataFrame for models
        input_data = pd.DataFrame([{
            'Age': float(data['age']),
            'Gender': gender_bin,
            'BMI': float(data['bmi']),
            'Chol': float(data['cholesterol']),
            'TG': float(data['triglycerides']),
            'HDL': float(data['hdl']),
            'LDL': float(data['ldl']),
            'Cr': float(data['creatinine']),
            'BUN': float(data['bun'])
        }])
        
        # Load models
        diabetes_model, multi_model = load_risk_models()
        
        # Make predictions
        diabetes_prob = diabetes_model.predict_proba(input_data)[0][1]
        multi_probs = multi_model.predict_proba(input_data)
        
        # Get probabilities for each condition and convert to native Python float
        heart_prob = float(multi_probs[1][0][1])
        kidney_prob = float(multi_probs[2][0][1])
        
        # Format results with native Python types
        results = {
            'diabetes': calculate_risk_level(float(diabetes_prob)),
            'heart_disease': calculate_risk_level(heart_prob),
            'kidney_disease': calculate_risk_level(kidney_prob),
            'advice': {
                'diabetes': "Maintain healthy weight and limit sugar intake to prevent diabetes.",
                'heart_disease': "Regular exercise and a balanced diet can help reduce cardiovascular risk.",
                'kidney_disease': "Monitor blood pressure and stay hydrated to support kidney health."
            }
        }
        
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/check-symptoms', methods=['POST'])
def check_symptoms():
    try:
        data = request.get_json()
        symptoms = data.get('symptoms', '').strip()
        
        if not symptoms:
            return jsonify({'error': 'No symptoms provided'}), 400
            
        # Load models and make prediction
        model, tfidf, encoder = load_symptom_models()
        cleaned_text = clean_symptom_text(symptoms)
        vector = tfidf.transform([cleaned_text])
        disease_name = encoder.inverse_transform(model.predict(vector))[0]
        
        # Get Gemini info with error handling
        try:
            gemini_info = get_disease_info(disease_name)
            if not isinstance(gemini_info, dict):
                raise ValueError("Invalid Gemini response format")
        except Exception as e:
            print(f"Gemini error: {e}")
            gemini_info = {
                "description": f"Information about {disease_name}",
                "recommendations": ["Consult a doctor"],
                "severity": "moderate"
            }
        
        return jsonify({
            'disease': disease_name,
            'description': gemini_info.get('description', ''),
            'recommendations': gemini_info.get('recommendations', []),
            'severity': gemini_info.get('severity', 'moderate')
        })
        
    except Exception as e:
        print(f"Endpoint error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
