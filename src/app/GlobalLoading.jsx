"use client";
import { useSelector } from "react-redux";
export default function Loading() {
  const isLoading = useSelector((state) => state.global.loading);
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-white bg-opacity-70">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}
