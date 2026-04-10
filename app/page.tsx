"use client";

import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState("");

  async function getFeedback() {
    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        drillType: "dribbling",
        level: "beginner"
      })
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>⚽ AI Football Platform</h1>

      <button onClick={getFeedback}>
        Get AI Feedback
      </button>

      <pre>{result}</pre>
    </div>
  );
}
