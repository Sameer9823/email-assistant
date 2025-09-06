"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export function useEmails() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await axios.get("/api/emails");
        setEmails(res.data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

  return { emails, loading, error };
}
