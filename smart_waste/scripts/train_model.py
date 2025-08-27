import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.optimizers import Adam

# -------------------------------
# Dataset paths
# -------------------------------
dataset_dir = os.path.abspath(r"D:\smartmanagerdataset")
categories = ['Hazardous', 'Non-Recyclable', 'Organic', 'Recyclable']

# -------------------------------
# Image parameters
# -------------------------------
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10  # start small, increase later
LEARNING_RATE = 1e-4

# -------------------------------
# Data preprocessing
# -------------------------------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,  # 80-20 split
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.1,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

train_generator = train_datagen.flow_from_directory(
    dataset_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training',
    classes=categories
)

validation_generator = train_datagen.flow_from_directory(
    dataset_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',
    classes=categories
)

# -------------------------------
# Load pretrained MobileNetV2
# -------------------------------
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224,224,3))
base_model.trainable = False  # freeze base

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.3)(x)
x = Dense(128, activation='relu')(x)
predictions = Dense(len(categories), activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

model.compile(optimizer=Adam(learning_rate=LEARNING_RATE),
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# -------------------------------
# Train the model
# -------------------------------
history = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=EPOCHS
)

# -------------------------------
# Save the trained model
# -------------------------------
model.save('smart_waste/model/waste_classifier_model.h5')
print("Model saved at smart_waste/model/waste_classifier_model.h5")
