"use client";

import { motion } from "framer-motion";

export function EmailCard({ email }: { email: { id: number; subject: string; from: string; snippet: string } }) {
  return (
    <motion.div
      className="p-4 rounded-xl bg-gray-900/70 hover:bg-gray-800/80 border border-gray-700 cursor-pointer shadow-md hover:shadow-lg transition"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-lg font-semibold text-white">{email.subject}</h3>
      <p className="text-sm text-gray-400">{email.from}</p>
      <p className="text-sm text-gray-300 mt-1">{email.snippet}</p>
    </motion.div>
  );
}
