"use client";

import { useState } from "react";
import { auth, storage, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { calculateSimilarity } from "../lib/similarity";

// 📊 Chart
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [similarity, setSimilarity] = useState([]);
  const [loading, setLoading] = useState(false);

  // 회원가입
  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입 완료");
    } catch (e) {
      alert(e.message);
    }
  };

  // 로그인
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 완료");
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
      alert("업로드 완료");
    } catch (e) {
      alert("업로드 실패");
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
        }),
      });

      const data = await res.json();

      setResult(data.result);

      // 🔥 유사도 계산
      const sim = calculateSimilarity(data.result.styleData);
      setSimilarity(sim);

      // 🔥 DB 저장
      await addDoc(collection(db, "analysisResults"), {
        userEmail: email,
        score: data.result.score,
        createdAt: serverTimestamp(),
      });

    } catch (e) {
      alert("AI 분석 실패");
    }

    setLoading(false);
  };

  // 📊 차트 데이터
  const getChartData = () => {
    if (!result) return [];

    return [
      { subject: "Speed", value: result.styleData?.dribblingSpeed || 0 },
      { subject: "Control", value: result.styleData?.control || 0 },
      { subject: "Agility", value: result.styleData?.agility || 0 },
    ];
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Login */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <input
          placeholder="Email"
          className="border p-2 mr-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          className="border p-2 mr-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} className="bg-blue-500 text-white px-3 py-1 mr-2">
          Login
        </button>

        <button onClick={signUp} className="bg-gray-500 text-white px-3 py-1">
          Sign Up
        </button>
      </div>

      {/* Upload */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <input type="file" onChange={(e) => uploadVideo(e.target.files[0])} />

        <button
          onClick={analyze}
          className="ml-2 bg-green-500 text-white px-3 py-1"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* 결과 */}
      {result && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="font-semibold mb-4">Performance</h3>

          <div className="text-3xl font-bold text-green-600 mb-4">
            {result.score}
          </div>

          <div className="w-full h-[200px]">
            <ResponsiveContainer>
              <RadarChart data={getChartData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar
                  dataKey="value"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <h4 className="mt-4 font-semibold">Strengths</h4>
          <ul className="list-disc ml-5">
            {result.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          <h4 className="mt-4 font-semibold">Improvements</h4>
          <ul className="list-disc ml-5">
            {result.improvements.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔥 선수 유사도 */}
      {similarity.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">⚽ Player Similarity</h3>

          {similarity.map((s, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between">
                <span>{s.player}</span>
                <span>{s.score}%</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${s.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
