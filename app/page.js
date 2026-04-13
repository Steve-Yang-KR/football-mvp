"use client";

import { useState } from "react";
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

  // 코치 데이터
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
      const parsed = JSON.parse(data.result);

      setResult(parsed);
    } catch (e) {
      alert("AI 분석 실패: " + e.message);
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

  // 🔥 코치 요청 저장 (핵심)
  const requestCoach = async (coach) => {
    try {
      await addDoc(collection(db, "coachRequests"), {
        coachName: coach.name,
        specialty: coach.specialty,
        rating: coach.rating,
        userEmail: email,
        createdAt: serverTimestamp(),
      });

      alert("코치 요청 완료!");
    } catch (e) {
      alert("요청 실패: " + e.message);
    }
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
      <button onClick={login} style={{ marginLeft: 10 }}>
        로그인
      </button>

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

      {/* AI 결과 */}
      {result && (
        <div style={{
          marginTop: 20,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 10,
          background: "#f9f9f9"
        }}>
          <h2>⚽ AI 분석 결과</h2>

          <h3>점수: {result.score}</h3>

          <div style={{
            height: 10,
            background: "#eee",
            borderRadius: 5,
            overflow: "hidden"
          }}>
            <div style={{
              width: `${result.score}%`,
              height: "100%",
              background: "green"
            }} />
          </div>

          <h4>✅ 강점</h4>
          <ul>
            {result.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h4>⚠️ 개선점</h4>
          <ul>
            {result.improvements.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 코치 추천 */}
      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>🎯 추천 코치</h2>

          {matchCoaches().map((coach) => (
            <div key={coach.id} style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              marginTop: 10
            }}>
              <h3>{coach.name}</h3>
              <p>전문 분야: {coach.specialty}</p>
              <p>평점: ⭐ {coach.rating}</p>
              <p>매칭 점수: {coach.matchScore}</p>

              <button onClick={() => requestCoach(coach)}>
                코치 요청
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
