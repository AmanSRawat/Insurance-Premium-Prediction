import React, { useState } from "react";
import axios from "axios";

const InputForm = () => {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    smoker: false,
    region: "",
    sex: "",
    children: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Backend error:", data);
    alert("Failed to get prediction.");
    return;
  }

  alert("Predicted Premium: ®️" + data["Predicted Insurance"]);
} catch (error) {
  console.error("Fetch error:", error);
  alert("Network error.");
}
};

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Insurance Premium Predictor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Height (m)</label>
          <input
            type="number"
            step="0.01"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Smoker</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="smoker"
                value="true"
                checked={formData.smoker === true}
                onChange={() => setFormData({ ...formData, smoker: true })}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="smoker"
                value="false"
                checked={formData.smoker === false}
                onChange={() => setFormData({ ...formData, smoker: false })}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label className="block font-medium">Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">-- Select Region --</option>
            <option value="southwest">Southwest</option>
            <option value="southeast">Southeast</option>
            <option value="northwest">Northwest</option>
            <option value="northeast">Northeast</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Sex</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">-- Select Gender --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Children</label>
          <input
            type="number"
            name="children"
            value={formData.children}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Predict Premium
        </button>
      </form>

      {result && (
        <div className="mt-4 text-green-700 font-semibold">
          Predicted Insurance Premium: ₹ {result.toFixed(2)}
        </div>
      )}

      {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
    </div>
  );
};

export default InputForm;