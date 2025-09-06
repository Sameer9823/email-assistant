"use client";

import { motion } from "framer-motion";

export function EmailPreviewModal({ email, onClose }: any) {
  if (!email) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full shadow-xl border border-gray-700">
        <h2 className="text-xl font-bold mb-2 text-white">{email.subject}</h2>
        <p className="text-gray-400 mb-4">From: {email.from}</p>
        <p className="text-gray-200">{email.snippet}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-500 text-white hover:scale-105 transition"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
