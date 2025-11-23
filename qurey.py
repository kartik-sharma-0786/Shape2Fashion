import pandas as pd

# Load the consolidated CSV file
data = pd.read_csv("fashion_clothing_details.csv")  # Replace with your actual file name
print(data.head())
print(data.columns)
# Filter data for jeans associated with the Hourglass body shape
filtered_data = data[(data['class_name'] == 'dress') & (data['body_shape'] == 'rectangle')]
print(filtered_data)
