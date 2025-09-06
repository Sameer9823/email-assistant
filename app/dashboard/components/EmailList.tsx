"use client";

import { EmailCard } from "./EmailCard";

export function EmailList() {
  const emails = [
    { id: 1, subject: "Support: Login Issue", from: "user1@gmail.com", snippet: "I can't log in..." },
    { id: 2, subject: "Billing: Invoice Request", from: "user2@gmail.com", snippet: "Can you send me my invoice?" },
    { id: 3, subject: "Technical: API Down", from: "dev@company.com", snippet: "The API is not responding..." },
  ];

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} />
      ))}
    </div>
  );
}
