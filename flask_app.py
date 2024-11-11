from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf

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

if __name__ == '__main__':
    app.run(port=5000)
