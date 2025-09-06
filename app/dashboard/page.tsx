"use client";

import { motion } from "framer-motion";
import { EmailList } from "./components/EmailList";
import { AnalyticsCharts } from "./components/AnalyticsCharts";
import { ResponseEditor } from "./components/ResponseEditor";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-gray-700 bg-black/40 backdrop-blur-lg sticky top-0 z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          ✉️ SmartMail Dashboard
        </h1>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white hover:scale-105 transition">
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left: Email List */}
        <motion.div
          className="lg:col-span-2 bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <EmailList />
        </motion.div>

        {/* Right: Analytics */}
        <motion.div
          className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-gray-700"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnalyticsCharts />
        </motion.div>
      </main>

      {/* Response Editor (sticky bottom panel) */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-gray-700 p-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ResponseEditor />
      </motion.div>
    </div>
  );
}
