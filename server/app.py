from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes and allow requests from specific origin (frontend on port 5173)
CORS(app, origins=["http://localhost:5173"])  # Adjust the origin as per your frontend's URL

# Load models and preprocessors
with open('xgb_model.pkl', 'rb') as f:
    xgb_model = pickle.load(f)

with open('rf_model.pkl', 'rb') as f:
    rf_model = pickle.load(f)

with open('numeric_imputer.pkl', 'rb') as f:
    numeric_imputer = pickle.load(f)

with open('non_numeric_imputer.pkl', 'rb') as f:
    non_numeric_imputer = pickle.load(f)

with open('label_encoders.pkl', 'rb') as f:
    label_encoders = pickle.load(f)

# Check if target_encoder exists
try:
    with open('target_encoder.pkl', 'rb') as f:
        target_encoder = pickle.load(f)
except FileNotFoundError:
    target_encoder = None

# Column names for preprocessing
numeric_columns = ['PM2.5', 'PM10', 'NO', 'NO2', 'NOx', 'NH3', 'CO', 'SO2', 'O3', 'Benzene', 'Toluene', 'Xylene', 'AQI', 'AQI_Bucket']
non_numeric_columns = ['City', 'Date']

def preprocess_input_data(input_data):
    # Convert input_data to DataFrame
    input_df = pd.DataFrame([input_data], columns=numeric_columns + non_numeric_columns)
    
    # Handle missing values for numeric columns
    input_df[numeric_columns] = numeric_imputer.transform(input_df[numeric_columns])
    
    # Handle missing values for non-numeric columns
    input_df[non_numeric_columns] = non_numeric_imputer.transform(input_df[non_numeric_columns])
    
    # Encode categorical columns using label encoders
    for column in non_numeric_columns:
        input_df[column] = label_encoders[column].transform(input_df[column].astype(str))
    
    return input_df

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        model_type = data.get('model_type')
        input_data = data.get('input_data')
        
        # Ensure input_data has all required keys and is in proper format
        if not input_data or len(input_data) != len(numeric_columns) + len(non_numeric_columns):
            return jsonify({'error': 'Invalid input data format'}), 400
        
        # Preprocess input data
        input_data_processed = preprocess_input_data(input_data)
        
        # Ensure the input data is reshaped to fit the model input
        input_data_processed = input_data_processed.values.reshape(1, -1)

        # Predict based on model type
        if model_type == 'xgb':
            prediction = xgb_model.predict(input_data_processed)
        elif model_type == 'rf':
            prediction = rf_model.predict(input_data_processed)
        else:
            return jsonify({'error': 'Invalid model type'}), 400

        # Check if prediction is a classification result (if target_encoder exists)
        if target_encoder:
            prediction = target_encoder.inverse_transform(prediction)
        
        return jsonify({'prediction': prediction[0]})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
