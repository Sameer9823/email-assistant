"use client";

export function ResponseEditor() {
  return (
    <div className="flex items-center gap-3">
      <textarea
        placeholder="Write your response..."
        className="flex-1 rounded-xl bg-gray-800 border border-gray-700 p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:scale-105 transition">
        Send
      </button>
    </div>
  );
}
