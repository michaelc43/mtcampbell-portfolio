"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [contactOpen, setContactOpen] = useState(false);

  const email = "michael@mtcampbell.com";
  const linkedinUrl = "https://www.linkedin.com/in/michael-campbell-9762ba365";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      alert("Email copied to clipboard");
    } catch {
      // Fallback if clipboard API is blocked
      prompt("Copy email:", email);
    }
  };

  return (
    <>
      <nav
        style={{
          padding: 16,
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18 }}>Michael Campbell</div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/resume">Resume</Link>
          <Link href="/projects">Projects</Link>

          <button className="headerContactBtn" onClick={() => setContactOpen(true)}>
            Contact
          </button>
        </div>
      </nav>

      {children}

      {/* Contact Modal */}
      {contactOpen && (
        <div
          className="contactModalOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Contact"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="contactModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="contactCloseBtn"
              onClick={() => setContactOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <h2 style={{ marginTop: 0 }}>Contact</h2>

            <div className="contactItem">
              <span className="contactLabel">Email:</span>
              <span className="contactValue">{email}</span>

              {/* Copy button (won't open Outlook) */}
              <button className="iconBtn" onClick={copyEmail} title="Copy email">
                📋
              </button>

              {/* Explicit mail app icon (only if clicked) */}
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
      )}
    </>
  );
}
