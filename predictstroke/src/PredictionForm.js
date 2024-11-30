import React, { useState, useEffect } from "react";
import "./PredictionForm.css";

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    hypertension: false,
    heartDisease: false,
    workType: "",
    smokingStatus: "",
    avgGlucoseLevel: "",
    bmi: "",  // Thêm BMI vào formData
    residenceType: "",
    maritalStatus: "",
  });

  // Hàm tính toán BMI và cập nhật vào formData
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;  // Chuyển chiều cao sang mét
      const bmiValue = formData.weight / (heightInMeters * heightInMeters);
      setFormData(prevData => ({
        ...prevData,
        bmi: bmiValue.toFixed(2),  // Cập nhật BMI vào formData
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        bmi: "",  // Nếu thiếu chiều cao hoặc cân nặng, đặt lại BMI
      }));
    }
  }, [formData.height, formData.weight]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Đảm bảo BMI có giá trị trong formData
    if (!formData.bmi) {
      alert("Vui lòng nhập chiều cao và cân nặng.");
      return;
    }
  
    try {
      const response = await fetch("http://your-api-url/predict", {
        method: "POST", // Sử dụng phương thức POST
        headers: {
          "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dưới dạng JSON
        },
        body: JSON.stringify(formData), // Chuyển formData thành JSON
      });
  
      if (!response.ok) {
        throw new Error("Có lỗi khi gửi yêu cầu");
      }
  
      const result = await response.json(); // Nhận dữ liệu phản hồi từ server
      console.log("Kết quả dự đoán:", result);
  
      // Xử lý kết quả dự đoán từ server (Ví dụ hiển thị thông báo)
      alert(`Kết quả dự đoán: ${result.prediction}`);
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };
  

  return (
    <div className="prediction-form">
      <h1>Dự đoán đột quỵ</h1>
      <form onSubmit={handleSubmit}>
        {/* Thông tin cá nhân */}
        <fieldset>
          <legend>Thông tin cá nhân</legend>
          {/* Giới tính */}
          <label>
            Giới tính:
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Chọn</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </label>

          {/* Tuổi */}
          <label>
            Tuổi:
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </label>

          {/* Loại công việc */}
          <label>
            Loại công việc:
            <select
              name="workType"
              value={formData.workType}
              onChange={handleChange}
            >
              <option value="">Chọn</option>
              <option value="Private">Công ty tư nhân</option>
              <option value="Self-employed">Làm nghề tự do</option>
              <option value="Government Job">Công chức</option>
              <option value="Children">Trẻ em</option>
              <option value="Never Worked">Chưa từng làm việc</option>
            </select>
          </label>

          {/* Tình trạng hôn nhân */}
          <label>
            Tình trạng hôn nhân:
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
            >
              <option value="">Chọn</option>
              <option value="Single">Độc thân</option>
              <option value="Married">Đã kết hôn</option>
              <option value="Divorced">Ly dị</option>
            </select>
          </label>
        </fieldset>

        {/* Nơi ở hiện tại */}
        <fieldset>
          <legend>Thông tin nơi cư trú</legend>
          {/* Loại cư trú */}
          <label>
            Loại cư trú:
            <select
              name="residenceType"
              value={formData.residenceType}
              onChange={handleChange}
            >
              <option value="">Chọn</option>
              <option value="Urban">Thành thị</option>
              <option value="Rural">Nông thôn</option>
            </select>
          </label>
        </fieldset>

        {/* Thông tin sức khỏe */}
        <fieldset>
          <legend>Thông tin sức khỏe</legend>

          {/* Bệnh tim */}
          <label>
            Bệnh tim:
            <input
              type="checkbox"
              name="heartDisease"
              checked={formData.heartDisease}
              onChange={handleChange}
            />
          </label>

          {/* Tình trạng hút thuốc */}
          <label>
            Tình trạng hút thuốc:
            <select
              name="smokingStatus"
              value={formData.smokingStatus}
              onChange={handleChange}
            >
              <option value="">Chọn</option>
              <option value="Formerly smoked">Đã từng hút thuốc</option>
              <option value="Never smoked">Chưa từng hút thuốc</option>
              <option value="Smokes">Đang hút thuốc</option>
            </select>
          </label>

          {/* Tăng huyết áp */}
          <label>
            Tăng huyết áp:
            <input
              type="checkbox"
              name="hypertension"
              checked={formData.hypertension}
              onChange={handleChange}
            />
          </label>
        </fieldset>

        {/* Chỉ số y tế */}
        <fieldset>
          <legend>Chỉ số y tế</legend>

          {/* Mức đường huyết trung bình */}
          <label>
            Mức đường huyết trung bình:
            <input
              type="number"
              name="avgGlucoseLevel"
              step="0.1"
              value={formData.avgGlucoseLevel}
              onChange={handleChange}
            />
          </label>

          {/* Chiều cao */}
          <label>
            Chiều cao (cm):
            <input
              type="number"
              name="height"
              step="0.1"
              value={formData.height}
              onChange={handleChange}
            />
          </label>

          {/* Cân nặng */}
          <label>
            Cân nặng (kg):
            <input
              type="number"
              name="weight"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
            />
          </label>

          {/* Hiển thị BMI */}
          {formData.bmi && (
            <div>
              <strong>Chỉ số BMI: {formData.bmi}</strong>
            </div>
          )}
        </fieldset>

        {/* Nút dự đoán */}
        <button type="submit">Dự đoán</button>
      </form>
    </div>
  );
};

export default PredictionForm;
