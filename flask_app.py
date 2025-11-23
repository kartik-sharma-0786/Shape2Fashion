from flask import Flask, request, jsonify
from flask import jsonify, request
import pandas as pd
from PIL import Image
import numpy as np
import tensorflow as tf
import json

app = Flask(__name__)

def load_model():
    """Load the trained model from a .h5 file."""
    return tf.keras.models.load_model('model.h5')

def preprocess_input(image):
    """Preprocess the image to fit the model input shape (128, 128, 3)."""
    # Resize the image to 128x128
    image = image.resize((256, 256))
    # Convert image to numpy array
    image_array = np.array(image)
    # Normalize the image data (if the model was trained on normalized data)
    image_array = image_array.astype('float32') / 255.0
    # Reshape to match the model input
    image_array = np.reshape(image_array, (1, 256, 256, 3))  # Adding batch dimension
    return image_array

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Ensure 'file' key is in the request files
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Open the image with Pillow
        image = Image.open(file.stream)

        # Preprocess the image
        processed_data = preprocess_input(image)

        # Load model and make prediction
        model = load_model()
        prediction = model.predict(processed_data)
        
        # Return the prediction as a response
        return jsonify({"prediction": prediction.tolist()})

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
        
@app.route('/query', methods=['POST'])
def query():
    try:
        # Parse JSON data
        parsed_data = request.get_json()
        if not parsed_data:
            return jsonify({"error": "Invalid or missing JSON data"}), 400

        # Log the received data
        print('Parsed data:', parsed_data)

        # Load the consolidated CSV file
        data = pd.read_csv("data/Dresses/fashion_clothing_details.csv")  # Replace with your actual file name
        # print(data.head())
        # print(data.columns)

        # Initialize a list to store filtered clothing data
        bodyclothes = []

        # Ensure parsed_data['items'] exists and is a list
        if 'items' in parsed_data and isinstance(parsed_data['items'], list):
            for j in parsed_data['items']:
                print(j)
                print(parsed_data['bodyShape'])

                # Filter data for the current item and body shape
                filtered_data = data[(data['class_name'] == j) & (data['body_shape'] == parsed_data['bodyShape'])]
                
                # Append the filtered data to the bodyclothes list
                if not filtered_data.empty:
                    bodyclothes.append(filtered_data.to_dict(orient='records'))  # Convert to dict to make it JSON serializable

                print(filtered_data)

            # Print the intermediate steps to see the data
            print('Bodyclothes:', bodyclothes)

            # Check if data is found and ready to be returned
            if bodyclothes:
                return jsonify({"message": "Data received successfully", "data": bodyclothes}), 200
            else:
                return jsonify({"message": "No data found for the given criteria"}), 404

        else:
            return jsonify({"error": "'items' key is missing or not a list"}), 400

    except Exception as e:
        print('Error:', e)  # This will help us track the exact error
        return jsonify({"error": str(e)}), 400

   
    
    

if __name__ == '__main__':
    app.run(port=5000)
