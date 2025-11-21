import React from "react";

export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
      {children}
    </button>
  );
}
