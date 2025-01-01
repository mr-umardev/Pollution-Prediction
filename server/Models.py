import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from xgboost import XGBRegressor
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder
from math import sqrt
import pickle

# Load dataset
data = pd.read_csv('/content/Dataset.csv')

# Separate numeric and non-numeric columns
numeric_columns = data.select_dtypes(include=['number']).columns
non_numeric_columns = data.select_dtypes(exclude=['number']).columns

# Handle missing values for numeric columns
numeric_imputer = SimpleImputer(strategy='mean')
data[numeric_columns] = numeric_imputer.fit_transform(data[numeric_columns])

# Handle missing values for non-numeric columns
non_numeric_imputer = SimpleImputer(strategy='most_frequent')
data[non_numeric_columns] = non_numeric_imputer.fit_transform(data[non_numeric_columns])

# Encode categorical features using LabelEncoder
label_encoders = {}
for column in non_numeric_columns:
    encoder = LabelEncoder()
    data[column] = encoder.fit_transform(data[column].astype(str))
    label_encoders[column] = encoder

# Separate features (X) and target (y)
X = data.iloc[:, :-1]
y = data.iloc[:, -1]

# Encode the target if it's categorical
if y.dtype == 'object' or y.dtype.name == 'category':
    target_encoder = LabelEncoder()
    y = target_encoder.fit_transform(y)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# XGBoost Model
xgb_model = XGBRegressor()
xgb_model.fit(X_train, y_train)
xgb_predictions = xgb_model.predict(X_test)
xgb_rmse = sqrt(mean_squared_error(y_test, xgb_predictions))
xgb_r2 = r2_score(y_test, xgb_predictions)
print(f"XGBoost RMSE: {xgb_rmse}")
print(f"XGBoost R² Score: {xgb_r2}")

# Random Forest Regressor Model
rf_model = RandomForestRegressor()
rf_model.fit(X_train, y_train)
rf_predictions = rf_model.predict(X_test)
rf_rmse = sqrt(mean_squared_error(y_test, rf_predictions))
rf_r2 = r2_score(y_test, rf_predictions)
print(f"Random Forest RMSE: {rf_rmse}")
print(f"Random Forest R² Score: {rf_r2}")

# Save models and preprocessors for webpage linking
with open('xgb_model.pkl', 'wb') as f:
    pickle.dump(xgb_model, f)

with open('rf_model.pkl', 'wb') as f:
    pickle.dump(rf_model, f)

with open('numeric_imputer.pkl', 'wb') as f:
    pickle.dump(numeric_imputer, f)

with open('non_numeric_imputer.pkl', 'wb') as f:
    pickle.dump(non_numeric_imputer, f)

with open('label_encoders.pkl', 'wb') as f:
    pickle.dump(label_encoders, f)

if 'target_encoder' in locals():
    with open('target_encoder.pkl', 'wb') as f:
        pickle.dump(target_encoder, f)












