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

  // AI 분석 + 저장
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

      // 결과 세팅
      setResult(data.result);

      // 🔥 분석 결과 저장
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
      { subject: "Skill", value: Number(result.score) || 0 },
      { subject: "Control", value: 75 },
      { subject: "Speed", value: 70 },
      { subject: "Stamina", value: 65 },
      { subject: "Technique", value: 80 },
    ];
  };

  // 코치 매칭
  const matchCoaches = () => {
    if (!result) return [];

    return coaches
      .map((coach) => {
        let score = coach.rating * 10;

        if (result.improvements.join(" ").includes(coach.specialty)) {
          score += 50;
        }

        return { ...coach, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 2);
  };

  // 코치 요청
  const requestCoach = async (coach) => {
    try {
      await addDoc(collection(db, "coachRequests"), {
        coachName: coach.name,
        specialty: coach.specialty,
        rating: coach.rating,
        userEmail: email,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("코치 요청 완료!");
    } catch (e) {
      alert("요청 실패");
    }
  };

  return (
    
      {/* Sidebar */}
      <div className="w-60 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">⚽ AI Football</h2>

        <nav className="space-y-4">
          <p className="text-gray-300">Dashboard</p>

          <Link href="/requests" className="block hover:text-blue-400">
            📋 Requests
          </Link>

          <Link href="/progress" className="block hover:text-blue-400">
            📈 Progress
          </Link>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 p-8">

        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Login */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="font-semibold mb-4">Login</h3>

          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded mb-3"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex gap-2">
            <button className="bg-gray-800 text-white px-4 py-2 rounded" onClick={signUp}>
              Sign Up
            </button>

            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={login}>
              Login
            </button>
          </div>
        </div>

        {/* Upload */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="font-semibold mb-4">Upload Training</h3>

          <input type="file" onChange={(e) => uploadVideo(e.target.files[0])} />

          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            onClick={analyze}
          >
            {loading ? "Analyzing..." : "Run AI Analysis"}
          </button>
        </div>

        {/* Result + Chart */}
        {result && (
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="font-semibold mb-4">Performance Overview</h3>

            <div className="text-4xl font-bold text-green-600 mb-4">
              {result.score}
            </div>

            <div className="w-full bg-gray-200 h-3 rounded mb-6">
              <div
                className="bg-green-500 h-3 rounded"
                style={{ width: `${result.score}%` }}
              />
            </div>

            {/* Radar Chart */}
            <div className="w-full h-[250px]">
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

            <h4 className="font-semibold mt-6">Strengths</h4>
            <ul className="list-disc ml-5 mb-4">
              {result.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h4 className="font-semibold">Improvements</h4>
            <ul className="list-disc ml-5">
              {result.improvements.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Coaches */}
        {result && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Recommended Coaches</h3>

            {matchCoaches().map((coach) => (
              <div
                key={coach.id}
                className="border p-4 rounded mb-3 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-bold">{coach.name}</h4>
                  <p className="text-sm text-gray-500">{coach.specialty}</p>
                </div>

                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => requestCoach(coach)}
                >
                  Request
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
  );
}
