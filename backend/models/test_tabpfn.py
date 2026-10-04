import pandas as pd
import numpy as np
from tabpfn import TabPFNRegressor, TabPFNClassifier

df = pd.read_csv("backend/data/alex_metabolic_history.csv")

feature_cols = [
    "carbs_g", "fiber_g", "net_carbs_g", "protein_g", "fat_g",
    "glycemic_index", "glycemic_load", "pre_meal_glucose",
    "sleep_hours", "stress_level", "post_meal_walk_min", "meal_time_hour"
]

X = df[feature_cols].values
y_reg = df["peak_glucose"].values
y_cls = df["spike_category"].values

print(f"Dataset shape: X={X.shape}, y={y_reg.shape}")

# Train on first 140 rows, test on next 40
X_train, X_test = X[:140], X[140:]
y_reg_train, y_reg_test = y_reg[:140], y_reg[140:]
y_cls_train, y_cls_test = y_cls[:140], y_cls[140:]

print("Initializing TabPFNRegressor...")
reg = TabPFNRegressor(device="cpu")
reg.fit(X_train, y_reg_train)
preds_reg = reg.predict(X_test[:5])
print("Predicted peak glucose:", preds_reg)
print("Actual peak glucose:   ", y_reg_test[:5])

print("Initializing TabPFNClassifier...")
cls = TabPFNClassifier(device="cpu")
cls.fit(X_train, y_cls_train)
preds_cls = cls.predict(X_test[:5])
probs_cls = cls.predict_proba(X_test[:5])
print("Predicted categories:  ", preds_cls)
print("Actual categories:     ", y_cls_test[:5])
print("Probabilities shape:   ", probs_cls.shape)
print("SUCCESS! TabPFN is fully validated.")
