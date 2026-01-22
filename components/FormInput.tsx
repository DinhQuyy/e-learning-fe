import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; // ✅ Thêm error prop
  list?: string;
  autoComplete?: string;
}

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error, // ✅ Destructure error
  list,
  autoComplete,
  ...rest // ✅ Spread remaining props
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        list={list}
        autoComplete={autoComplete}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...rest} // ✅ Apply other HTML attributes
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}