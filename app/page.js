"use client";

import { useState } from "react";
import { auth, storage } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 회원가입
  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입 성공!");
    } catch (e) {
      alert(e.message);
    }
  };

  // 로그인
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공!");
    } catch (e) {
      alert(e.message);
    }
  };

  // 영상 업로드
  const uploadVideo = async (file) => {
    if (!file) return;

    try {
      const storageRef = ref(storage, `videos/${file.name}`);
      await uploadBytes(storageRef, file);
      alert("업로드 성공!");
    } catch (e) {
      alert("업로드 실패: " + e.message);
    }
  };

  // AI 분석
  const analyze = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          drill: "dribbling",
          duration: "1 min",
        }),
      });

      const data = await res.json();

      // JSON 파싱
      const parsed = JSON.parse(data.result);

      setResult(parsed);
    } catch (e) {
      alert("AI 분석 실패: " + e.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h1>⚽ AI Football App</h1>

      {/* 로그인 */}
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />
      <br /><br />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />
      <br /><br />

      <button onClick={signUp}>회원가입</button>
      <button onClick={login} style={{ marginLeft: 10 }}>로그인</button>

      <br /><br />

      {/* 영상 업로드 */}
      <input
        type="file"
        accept="video/*"
        onChange={(e) => uploadVideo(e.target.files[0])}
      />

      <br /><br />

      {/* AI 분석 */}
      <button onClick={analyze} disabled={loading}>
        {loading ? "AI 분석 중..." : "AI 분석"}
      </button>

      {/* 결과 UI */}
      {result && (
        <div style={{
          marginTop: 20,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 10,
          background: "#f9f9f9"
        }}>
          <h2>⚽ AI 분석 결과</h2>

          {/* 점수 */}
          <h3>점수: {result.score}</h3>

          {/* 프로그레스 바 */}
          <div style={{
            height: 10,
            background: "#eee",
            borderRadius: 5,
            overflow: "hidden",
            marginBottom: 10
          }}>
            <div style={{
              width: `${result.score}%`,
              height: "100%",
              background: "green"
            }} />
          </div>

          {/* 강점 */}
          <h4>✅ 강점</h4>
          <ul>
            {result.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          {/* 개선점 */}
          <h4>⚠️ 개선점</h4>
          <ul>
            {result.improvements.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
