import google.generativeai as genai
import os
import json

genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

def get_medical_suggestions(scan_type, condition):
    try:
        model = genai.GenerativeModel('models/gemini-1.5-flash')
        
        # Specialized prompt that requests both disease information and recommendations
        prompt = f"""
        For a patient with the following medical scan finding:
        Scan Type: {scan_type.replace('-', ' ').title()}
        Condition: {condition}
        
        Please provide:
        
        1. DISEASE INFORMATION (concise 2-3 sentences):
        - What is this condition?
        - How does it typically occur?
        - Brief overview
        
        2. RECOMMENDATIONS (4 specific items):
        - Type of specialist to consult
        - Recommended diagnostic follow-up
        - Immediate actions or precautions
        - Long-term monitoring suggestions
        
        Format the response clearly with "Disease Information:" and "Recommendations:" sections.
        Keep all information medically accurate but understandable for patients.
        """
        
        response = model.generate_content(prompt)
        text = response.text
        
        # Parse the response into information and recommendations
        disease_info = []
        recommendations = []
        
        current_section = None
        for line in text.split('\n'):
            line = line.strip()
            if not line:
                continue
            if "Disease Information:" in line:
                current_section = "info"
            elif "Recommendations:" in line:
                current_section = "rec"
            else:
                if current_section == "info":
                    disease_info.append(line)
                elif current_section == "rec":
                    # Clean recommendation lines
                    clean_line = line.lstrip('*-• ').strip()
                    if clean_line:
                        recommendations.append(clean_line)
        
        # Fallback if parsing didn't work as expected
        if not disease_info or not recommendations:
            return get_fallback_response(scan_type, condition)
        
        return {
            "disease_info": ' '.join(disease_info),
            "recommendations": recommendations[:4]  # Return max 4 recommendations
        }
    
    except Exception as e:
        print(f"Error getting Gemini response: {str(e)}")
        return get_fallback_response(scan_type, condition)

def get_fallback_response(scan_type, condition):
    """Fallback response when Gemini fails"""
    # Disease information fallbacks
    disease_info = {
        'brain-tumor': {
            'no tumor': "No tumor detected in the brain MRI. This means no abnormal growths were found in the brain tissue.",
            'glioma': "Gliomas are brain tumors that originate from glial cells. They can vary from slow-growing to aggressive forms.",
            'meningioma': "Meningiomas are typically benign tumors arising from the meninges, the membranes surrounding the brain.",
            'pituitary': "Pituitary tumors are growths that develop in the pituitary gland, which regulates hormones in the body."
        },
        'bone-fracture': "A bone fracture is a medical condition where there's a partial or complete break in the continuity of the bone.",
        'lung-cancer': "Lung cancer is a type of cancer that begins in the lungs, often associated with smoking or environmental factors.",
        'default': "This condition involves abnormal findings in medical imaging that may require further evaluation by a specialist."
    }
    
    # Get appropriate disease info
    info = ""
    if scan_type == 'brain-tumor':
        if "no tumor" in condition.lower():
            info = disease_info['brain-tumor']['no tumor']
        elif "glioma" in condition.lower():
            info = disease_info['brain-tumor']['glioma']
        elif "meningioma" in condition.lower():
            info = disease_info['brain-tumor']['meningioma']
        elif "pituitary" in condition.lower():
            info = disease_info['brain-tumor']['pituitary']
        else:
            info = disease_info['brain-tumor']['glioma']  # default brain tumor info
    else:
        info = disease_info.get(scan_type, disease_info['default'])
    
    # Recommendations fallback (same as before)
    if scan_type == 'brain-tumor':
        if "no tumor" in condition.lower():
            recs = [
                "Routine follow-up with primary care physician",
                "Consider repeat MRI in 6-12 months if symptoms persist",
                "Monitor for new neurological symptoms",
                "Maintain healthy lifestyle for brain health"
            ]
        else:
            recs = [
                "Immediate consultation with a neurosurgeon or neurologist",
                "MRI with contrast for further evaluation",
                "Avoid activities that increase intracranial pressure",
                "Schedule follow-up imaging in 3 months"
            ]
    else:
        recs = [
            "Consult with a specialist for detailed interpretation",
            "Consider follow-up imaging if symptoms persist",
            "Discuss results with your healthcare provider",
            "Keep a copy of this analysis for your records"
        ]
    
    return {
        "disease_info": info,
        "recommendations": recs
    }

def get_disease_info(disease_name):
    """Get disease information and recommendations from Gemini"""
    try:
        # Initialize Gemini
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""Provide concise medical information about {disease_name} in this exact JSON format:
        {{
            "description": "A 1-2 sentence description of the disease",
            "recommendations": [
                "3-5 specific recommendations for managing the condition",
                "Include any common OTC medications if applicable"
            ],
            "severity": "low/moderate/high",
            "when_to_see_doctor": "When to seek professional medical help"
        }}
        Keep responses brief and clinically accurate. Only return valid JSON."""
        
        response = model.generate_content(prompt)
        
        # Handle different response formats
        if hasattr(response, 'text'):
            # Newer Gemini versions
            response_text = response.text
        elif hasattr(response, 'result'):
            # Older versions
            response_text = response.result
        else:
            raise ValueError("Unexpected Gemini response format")
        
        # Clean the response (Gemini sometimes adds markdown formatting)
        response_text = response_text.strip().replace('```json', '').replace('```', '').strip()
        
        # Parse JSON
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            # If JSON parsing fails, return the raw text for debugging
            print(f"Failed to parse Gemini response: {response_text}")
            raise ValueError("Invalid JSON response from Gemini")
            
    except Exception as e:
        print(f"Error getting Gemini response: {str(e)}")
        # Return a fallback response
        return {
            "description": f"Information about {disease_name}",
            "recommendations": [
                "Consult with a healthcare provider for proper diagnosis",
                "Rest and stay hydrated",
                "Monitor symptoms for changes"
            ],
            "severity": "moderate",
            "when_to_see_doctor": "If symptoms worsen or persist"
        }