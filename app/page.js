"use client";

import { useState } from "react";
import Link from "next/link";
import { auth, storage, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const coaches = [
    { id: 1, name: "Carlos", specialty: "dribbling", rating: 4.8 },
    { id: 2, name: "David", specialty: "speed", rating: 4.6 },
    { id: 3, name: "Lee", specialty: "ball control", rating: 4.9 },
  ];

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

      let parsed;
      try {
        parsed = JSON.parse(data.result);
      } catch (e) {
        alert("AI 응답 오류");
        return;
      }

      setResult(parsed);
    } catch (e) {
      alert("AI 분석 실패");
    }

    setLoading(false);
  };

  // 코치 매칭
  const matchCoaches = () => {
    if (!result) return [];

    return coaches
      .map((coach) => {
        let score = 0;
        if (result.improvements.join(" ").includes(coach.specialty)) {
          score += 50;
        }
        score += coach.rating * 10;
        return { ...coach, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 2);
  };

  // 코치 요청
  const requestCoach = async (coach) => {
    await addDoc(collection(db, "coachRequests"), {
      coachName: coach.name,
      specialty: coach.specialty,
      rating: coach.rating,
      userEmail: email,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("요청 완료!");
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Arial"
    }}>

      {/* 사이드바 */}
      <div style={{
        width: 220,
        background: "#111827",
        color: "white",
        padding: 20
      }}>
        <h2>⚽ AI Football</h2>

        <div style={{ marginTop: 20 }}>
          <p>Dashboard</p>
          <Link href="/requests">
            <p style={{ cursor: "pointer" }}>📋 Requests</p>
          </Link>
        </div>
      </div>

      {/* 메인 */}
      <div style={{ flex: 1, padding: 30, background: "#f3f4f6" }}>

        <h1>Dashboard</h1>

        {/* 로그인 카드 */}
        <div style={{
          background: "white",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20
        }}>
          <h3>Login</h3>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />

          <div style={{ marginTop: 10 }}>
            <button onClick={signUp}>Sign Up</button>
            <button onClick={login} style={{ marginLeft: 10 }}>
              Login
            </button>
          </div>
        </div>

        {/* 업로드 카드 */}
        <div style={{
          background: "white",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20
        }}>
          <h3>Upload Training Video</h3>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => uploadVideo(e.target.files[0])}
          />

          <br /><br />

          <button onClick={analyze}>
            {loading ? "Analyzing..." : "Run AI Analysis"}
          </button>
        </div>

        {/* 결과 */}
        {result && (
          <div style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            marginBottom: 20
          }}>
            <h3>Performance Score</h3>

            <h2>{result.score}</h2>

            <div style={{
              height: 10,
              background: "#ddd",
              borderRadius: 5
            }}>
              <div style={{
                width: `${result.score}%`,
                height: "100%",
                background: "green"
              }} />
            </div>

            <h4>Strengths</h4>
            <ul>
              {result.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h4>Improvements</h4>
            <ul>
              {result.improvements.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 코치 추천 */}
        {result && (
          <div style={{
            background: "white",
            padding: 20,
            borderRadius: 10
          }}>
            <h3>Recommended Coaches</h3>

            {matchCoaches().map((coach) => (
              <div key={coach.id} style={{
                border: "1px solid #ddd",
                padding: 10,
                marginTop: 10,
                borderRadius: 8
              }}>
                <h4>{coach.name}</h4>
                <p>{coach.specialty}</p>
                <p>⭐ {coach.rating}</p>

                <button onClick={() => requestCoach(coach)}>
                  Request Coach
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
