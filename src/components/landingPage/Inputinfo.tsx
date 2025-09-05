import React from "react";

interface InputinfoProps {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const Inputinfo: React.FC<InputinfoProps> = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  error,
}) => {
  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" " // 👈 required for floating effect
        className={`peer w-full px-4 pt-5 pb-2 border rounded-lg bg-white text-gray-700 
          focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-500 ring-red-200"
              : "border-gray-300 focus:border-orange-500 focus:ring-orange-300"
          }`}
      />
      <label
        htmlFor={name}
        className="absolute left-3 px-1 bg-[#FAF7F2] text-gray-400 text-sm transition-all
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                   peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-orange-600"
      >
        {label}
      </label>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Inputinfo;
