import os
from keras.models import load_model

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'waste_classifier_model.h5')

model = load_model(MODEL_PATH)
