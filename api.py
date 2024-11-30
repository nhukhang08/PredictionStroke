from flask import Flask, request, jsonify
import joblib
import pandas as pd

# Tải mô hình từ file pkl
model = joblib.load('rf_model.pkl')

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # Lấy dữ liệu từ yêu cầu HTTP

    # Chuyển dữ liệu thành DataFrame
    df = pd.DataFrame(data)

    # Tiền xử lý dữ liệu theo đúng cách mà bạn đã làm trong chương trình của mình
    label_encoder = {
        'gender': {'Nam': 0, 'Nữ': 1, 'Khác': 2},
        'hypertension': {'Có': 1, 'Không': 0},
        'heart_disease': {'Có': 1, 'Không': 0},
        'ever_married': {'Đã từng kết hôn': 1, 'Chưa từng kết hôn': 0},
        'Residence_type': {'Thành phố': 1, 'Nông thôn': 0},
        'work_type': {'Private': 0, 'Tự kinh doanh': 1, 'Cơ quan nhà nước': 2, 'Trẻ em': 3, 'Thất nghiệp': 4},
        'smoking_status': {'Đã từng hút': 0, 'Chưa bao giờ': 1, 'Đang hút': 2, 'Không rõ': 3}
    }
    
    for column, mapping in label_encoder.items():
        if column in df.columns:
            df[column] = df[column].replace(mapping)
    
    # Dự đoán
    prediction = model.predict(df)
    
    result = "Có khả năng đột quỵ" if prediction[0] == 1 else "Không có khả năng đột quỵ"
    
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
