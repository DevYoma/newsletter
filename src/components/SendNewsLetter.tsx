// src/components/SendNewsletter.tsx
import React, { useState } from "react";

export default function SendNewsLetter() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, content }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Newsletter sent successfully!"); 
        setMessage(data.message);
        setSubject("");
        setContent("");
      } else {
        throw new Error(data.message || "Failed to send newsletter");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send newsletter. Please try again.");
      setMessage(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "2rem",
        border: "1px dashed black",
        display: "flex",
        flexDirection: "column",
        width: "70%",
      }}
    >
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Newsletter Subject"
        required
        style={{
          marginBottom: "1rem",
        }}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Newsletter Content (HTML)"
        required
        style={{
          marginBottom: "1rem",
        }}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Newsletter"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
