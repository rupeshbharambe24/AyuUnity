# AyuUnity

A full-stack health-tech web application that combines medical-image analysis, chronic-disease risk prediction, symptom checking, and an LLM-backed assistant in a single dashboard. Built with **Next.js (frontend)** and **Flask (backend)**.

## What it does

The Flask backend exposes three core ML endpoints:

| Endpoint | Task | Model |
|----------|------|-------|
| `POST /analyze/<scan_type>` | Medical image classification (e.g. brain tumor, skin lesion) | PyTorch CNN — `BrainTumorCNN` (4 classes), `SkinLesionCNN` (2 classes) |
| `POST /predict-chronic-risk` | Diabetes + multi-disease chronic-risk scoring from a form input | scikit-learn classifiers (`chronic_model.pkl`, `chronic_multi_model.pkl`) |
| `POST /check-symptoms` | Disease prediction from free-text symptoms | TF-IDF + Random Forest (`s2d_*.pkl`), with Gemini for follow-up suggestions |

Gemini is used for medical suggestions and disease info on top of the model outputs.

## Frontend pages

- `/` — landing
- `/login`, `/register-patient`
- `/patient-dashboard`, `/doctor-dashboard` — role-specific dashboards
- `/scan-analysis` — image upload + result display
- Components for chronic-risk form, symptom checker, prescription list, government schemes, video consultation, emergency button, chatbot

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui (Radix primitives)
- **Backend:** Flask, Flask-CORS
- **ML:** PyTorch (image classification), scikit-learn (tabular + text), TF-IDF
- **NLP:** NLTK preprocessing (stopwords, lemmatizer)
- **LLM:** Google Gemini (`google-generativeai`) for medical suggestions

## Project Structure

```
AyuUnity/
├── backend/
│   ├── app.py                      # Flask routes for all 3 endpoints
│   ├── utils/
│   │   ├── model_loader.py         # PyTorch CNNs + sklearn loaders
│   │   └── gemini_integration.py   # Gemini wrapper
│   ├── models/                     # Trained .pth and .pkl models
│   ├── uploads/                    # Runtime upload folder
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── app/                        # Next.js App Router pages
    ├── components/                 # Domain components + shadcn UI
    ├── public/, styles/, lib/, hooks/
    └── package.json
```

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Set GEMINI_API_KEY

python app.py
```

Backend runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install                       # or pnpm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## Models

The `backend/models/` directory holds the trained model files used at runtime:

| File | Purpose |
|------|---------|
| `brain_tumor_model.pth` | PyTorch CNN — 4-class brain MRI classification |
| `skin_lesions_model.pth` | PyTorch CNN — binary skin lesion classification |
| `chronic_model.pkl` | scikit-learn — diabetes risk |
| `chronic_multi_model.pkl` | scikit-learn — multi-condition chronic risk |
| `s2d_Random_model.pkl` | Random Forest — symptom-to-disease |
| `s2d_tfidf_vectorizer.pkl` | TF-IDF vectorizer for symptom text |
| `s2d_label_encoder.pkl` | Label encoder for disease names |

## Notes

This was built as a hackathon-style prototype. It's a working full-stack demo, not a regulatory-grade clinical tool — none of the models are FDA/CE certified and outputs should not be used for diagnosis.
