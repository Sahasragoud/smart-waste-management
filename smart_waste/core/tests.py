from django.test import TestCase

import os
dataset_dir = os.path.abspath(r"D:\smartmanagerdataset")
print("Dataset directory:", dataset_dir)

for category in ['Hazardous', 'Non-Recyclable', 'Organic', 'Recyclable']:
    path = os.path.join(dataset_dir, category)
    if os.path.exists(path):
        print(category, "images:", os.listdir(path)[:5])  # show first 5 files
    else:
        print("Folder not found:", path)
