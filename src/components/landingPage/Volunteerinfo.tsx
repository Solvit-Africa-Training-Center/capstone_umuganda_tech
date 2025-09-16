import React, { useState } from "react";
import Inputinfo from "./Inputinfo";
// import { AuthResponse } from "../../types"; 
import Registerheader from "./Registerheader";
import type { AuthResponse } from "../../types";

// Form state type (only fields needed for registration API)
interface RegistrationFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

const Volunteerinfo: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  // Validate before submitting
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationFormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form -> call backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiMessage(null);

    try {
      const response = await fetch(
        "https://umuganda-tech-backend.onrender.com/api/users/auth/complete-registration/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: formData.phoneNumber,
            password: formData.password,
            first_name: formData.firstName,
            last_name: formData.lastName,
          }),
        }
      );

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        setApiMessage(data.message || "Registration failed");
        return;
      }

      setApiMessage(data.message || "Registration completed successfully ✅");

      // Store tokens and user
      if (data.access) localStorage.setItem("access", data.access);
      if (data.refresh) localStorage.setItem("refresh", data.refresh);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

    } catch (error: any) {
      setApiMessage(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
         <Registerheader />
    <div className="w-full  bg-[#FAF7F2] p-8 rounded-lg flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-6">Complete Registration</h1>

      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
        <Inputinfo
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />

        <Inputinfo
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />

        <Inputinfo
          name="phoneNumber"
          type="text"
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
        />

        <Inputinfo
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold rounded-lg transition ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {loading ? "Processing..." : "Complete Registration"}
        </button>
      </form>

      {apiMessage && (
        <p className="mt-4 text-center text-sm text-gray-700">{apiMessage}</p>
      )}
    </div>
    </div>
     
  );
};

export default Volunteerinfo;
