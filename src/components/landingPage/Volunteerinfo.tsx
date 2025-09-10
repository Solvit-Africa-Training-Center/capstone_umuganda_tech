import React, { useState, } from "react";
import Inputinfo from "./Inputinfo";


const Volunteerinfo: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    skills: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});


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
    <div className="w-full mx-auto bg-[#FAF7F2] p-8 rounded-lg  flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-6">
        Official Information
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
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
          name="email"
          type="email"
          label="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        

         <div className="relative">
          <select
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className={`peer w-full px-4 pt-5 pb-2 border rounded-lg bg-white text-gray-700 
              focus:outline-none focus:ring-2 appearance-none ${
                errors.role
                  ? "border-red-500 ring-red-200"
                  : "border-gray-300 focus:border-orange-500 focus:ring-orange-300"
              }`}
          >
            <option value="" disabled hidden>Choose your role</option>
            <option value="Umuganda Leader">Heavy lifting</option>
            <option value="Cell Executive Secretary">Digging</option>
            <option value="Sector Administrator">planting</option>
            <option value="Local Council Leader">wedding</option>
            <option value="Umuganda Leader">Carpentry</option>
            <option value="Cell Executive Secretary">Masonry/Bricklaying</option>
            <option value="Sector Administrator">painting</option>
          </select>
          <label
            htmlFor="skills"
            className={`absolute left-3 px-1 bg-[#FAF7F2] transition-all
              ${formData.skills
                ? "top-[-0.5rem] text-xs text-orange-600"
                : "top-4 text-base text-gray-400"}
              peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-orange-600`}
          >
            Choose your role
          </label>
          {errors.skills && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          Complete Registration
        </button>
      </form>
    </div>
  );
};

export default Volunteerinfo;
