"use client";
import { useState } from "react";
import axios from "axios";

export function useResponse() {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const generateResponse = async (emailBody: string, sentiment: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/respond", { emailBody, sentiment });
      setDraft(res.data.draft);
    } catch (err) {
      console.error("Error generating response:", err);
    } finally {
      setLoading(false);
    }
  };

  return { draft, loading, generateResponse };
}
