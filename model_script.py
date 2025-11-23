import tensorflow as tf
import numpy as np

def load_model():
    """Load the trained model from a .h5 file."""
    return tf.keras.models.load_model('model.h5')

def preprocess_input(input_data):
    """Preprocess input data (e.g., reshape, normalize) for model prediction."""
    # Assuming input_data is a JSON list that needs to be reshaped to (128, 128, 3)
    # You might need to adjust this depending on your model's expected input.
    input_array = np.array(input_data, dtype=np.float32)
    input_array = np.reshape(input_array, (1, 128, 128, 3))  # Adjust as needed
    input_array /= 255.0  # Normalize if your model was trained on normalized data
    return input_array

def make_prediction(model, processed_data):
    """Generate prediction from the processed data using the loaded model."""
    prediction = model.predict(processed_data)
    return prediction.tolist()  # Convert numpy array to list for JSON serialization

if __name__ == "__main__":
    model = load_model()
    # Example input; replace with real data as needed
    example_input = np.random.rand(128, 128, 3).tolist()  # Generate dummy input
    processed_data = preprocess_input(example_input)
    prediction = make_prediction(model, processed_data)
    print("Prediction:", prediction)
