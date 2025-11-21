import React from "react";

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
}

export default function FormInput({ label, type = "text", name, placeholder }: FormInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
