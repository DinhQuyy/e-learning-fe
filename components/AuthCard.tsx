import React from "react";

export default function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-md w-full mx-auto bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>
      {children}
    </div>
  );
}
