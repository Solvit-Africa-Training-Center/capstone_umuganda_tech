import React, { useState, useRef } from "react";
import Inputinfo from "./Inputinfo";
import { MdOutlineFileUpload } from "react-icons/md";

const Information: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    sector: "",
    role: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear error
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrors((prev) => ({ ...prev, proof: "" }));
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.sector) newErrors.sector = "Please select a sector";
    if (!formData.role) newErrors.role = "Please select a role";
    if (!file) newErrors.proof = "Proof of authority is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      // Prepare multipart form data
      const payload = new FormData();
      payload.append("firstName", formData.firstName);
      payload.append("lastName", formData.lastName);
      payload.append("email", formData.email);
      payload.append("sector", formData.sector);
      payload.append("role", formData.role);
      if (file) {
        payload.append("proof", file);
      }

      const response = await fetch(
        "https://umuganda-tech-backend.onrender.com/api/users/auth/complete-registration/",
        {
          method: "POST",
          body: payload, // ✅ Send as multipart form-data
        }
      );

      if (response.ok) {
        alert("🎉 Registration completed successfully. Await SMS confirmation.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          sector: "",
          role: "",
        });
        setFile(null);
      } else {
        const err = await response.json();
        alert(`❌ Registration failed: ${err.message || "Try again later."}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-[#FAF7F2] p-8 rounded-lg flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-6">
        Official Information
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col w-full max-w-lg">
        {/* First Name */}
        <Inputinfo
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />

        {/* Last Name */}
        <Inputinfo
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />

        {/* Email */}
        <Inputinfo
          name="email"
          type="email"
          label="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        {/* Sector Dropdown */}
        <div className="relative">
          <select
            id="sector"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            className={`peer w-full px-4 pt-5 pb-2 border rounded-lg bg-white text-gray-700 
              focus:outline-none focus:ring-2 appearance-none ${
                errors.sector
                  ? "border-red-500 ring-red-200"
                  : "border-gray-300 focus:border-orange-500 focus:ring-orange-300"
              }`}
          >
            <option value="" disabled hidden>
              Select Sector
            </option>
            <option value="Niboye">Niboye</option>
            <option value="Other">Other</option>
          </select>
          <label
            htmlFor="sector"
            className={`absolute left-3 px-1 bg-[#FAF7F2] transition-all
              ${
                formData.sector
                  ? "top-[-0.5rem] text-xs text-orange-600"
                  : "top-4 text-base text-gray-400"
              }
              peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-orange-600`}
          >
            Select Sector
          </label>
          {errors.sector && (
            <p className="text-red-500 text-sm mt-1">{errors.sector}</p>
          )}
        </div>

        {/* Role Dropdown */}
        <div className="relative">
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`peer w-full px-4 pt-5 pb-2 border rounded-lg bg-white text-gray-700 
              focus:outline-none focus:ring-2 appearance-none ${
                errors.role
                  ? "border-red-500 ring-red-200"
                  : "border-gray-300 focus:border-orange-500 focus:ring-orange-300"
              }`}
          >
            <option value="" disabled hidden>
              Choose your role
            </option>
            <option value="Umuganda Leader">Umuganda Leader</option>
            <option value="Cell Executive Secretary">Cell Executive Secretary</option>
            <option value="Sector Administrator">Sector Administrator</option>
            <option value="Local Council Leader">Local Council Leader</option>
          </select>
          <label
            htmlFor="role"
            className={`absolute left-3 px-1 bg-[#FAF7F2] transition-all
              ${
                formData.role
                  ? "top-[-0.5rem] text-xs text-orange-600"
                  : "top-4 text-base text-gray-400"
              }
              peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-orange-600`}
          >
            Choose your role
          </label>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        {/* Upload Proof of Authority */}
        <div
          onClick={handleFileClick}
          className={`flex items-center justify-between w-full px-4 py-4 border rounded-lg bg-white cursor-pointer hover:bg-gray-50 ${
            errors.proof
              ? "border-red-500"
              : "border-gray-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-300"
          }`}
        >
          <span className={file ? "text-gray-700" : "text-gray-500"}>
            {file ? file.name : "Proof of Authority (Upload)"}
          </span>
          <MdOutlineFileUpload size={22} />
          <input
            type="file"
            ref={fileInputRef}
            name="proof"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {errors.proof && (
          <p className="text-red-500 text-sm mt-1">{errors.proof}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        <p className="text-sm text-gray-500 text-center mt-2">
          Your account will be activated after a quick verification process. You
          will receive an SMS confirmation.
        </p>
      </form>
    </div>
  );
};

export default Information;
