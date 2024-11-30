from flask import Flask, request, jsonify
import pickle
import numpy as np

# Tải mô hình đã huấn luyện
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

# Tạo ứng dụng Flask
app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Stroke Prediction API is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Lấy dữ liệu từ yêu cầu POST
        data = request.get_json()

        # Đảm bảo các trường cần thiết có trong dữ liệu đầu vào
        required_fields = ["bmi", "age", "hypertension", "heart_disease", "avg_glucose_level", "gender"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Chuyển đổi dữ liệu thành định dạng phù hợp cho mô hình
        bmi = data["bmi"]
        age = data["age"]
        hypertension = data["hypertension"]
        heart_disease = data["heart_disease"]
        avg_glucose_level = data["avg_glucose_level"]
        gender = 1 if data["gender"].lower() == "male" else 0  # Giả sử "male" = 1, "female" = 0

        # Tạo mảng đầu vào
        input_features = np.array([[bmi, age, hypertension, heart_disease, avg_glucose_level, gender]])

        # Dự đoán
        prediction = model.predict(input_features)

        # Trả về kết quả
        result = "Stroke" if prediction[0] == 1 else "No Stroke"
        return jsonify({"prediction": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
