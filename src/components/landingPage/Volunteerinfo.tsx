import React, { useState, useRef } from "react";
import Inputinfo from "./Inputinfo";
import { MdOutlineFileUpload } from "react-icons/md";

const Volunteerinfo: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    skills: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear error when user types/selects
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        proof: e.target.files![0].name,
      }));
      setErrors((prev) => ({ ...prev, proof: "" }));
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.skills) newErrors.proof = "Proof of authority is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", formData);
      alert("Form submitted successfully ✅");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#FAF7F2] p-8 rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Official Information
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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

         <Inputinfo
          name="skills"
          type="skills"
          label="Choose  your  skill"
          value={formData.skills}
          onChange={handleChange}
          error={errors.skills}
        />

     

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          Submit
        </button>

        <p className="text-sm text-gray-500 text-center mt-2">
          Your account will be activated after a quick verification process. You
          will receive an SMS confirmation.
        </p>
      </form>
    </div>
  );
};

export default Volunteerinfo;
