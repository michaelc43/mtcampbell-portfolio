"use client";

import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  email: string;
  linkedinUrl: string;
};

export default function ContactModal({ open, onClose, email, linkedinUrl }: Props) {
  if (!open) return null;

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    // Optional: replace with a toast later
    alert("Email copied to clipboard");
  };

  return (
    <div
      className="contactModalOverlay"
      role="dialog"
      aria-modal="true"
      aria-label="Contact"
      onClick={onClose}
    >
      <div className="contactModalContent" onClick={(e) => e.stopPropagation()}>
        <button className="contactCloseBtn" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2>Contact</h2>

        <div className="contactItem">
          <span className="contactLabel">Email:</span>
          <span className="contactValue">{email}</span>

          {/* Copy (won't open Outlook) */}
          <button className="iconBtn" onClick={copyEmail} title="Copy email">
            📋
          </button>

          {/* Optional explicit mailto icon */}
          <a className="iconBtn" href={`mailto:${email}`} title="Open email app">
            ✉️
          </a>
        </div>

        <div className="contactItem">
          <span className="contactLabel">LinkedIn:</span>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            {linkedinUrl.replace(/^https?:\/\//, "")}
          </a>
        </div>
      </div>
    </div>
  );
}
