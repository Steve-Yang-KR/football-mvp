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

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 로그인
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 완료");
    } catch (e) {
      alert(e.message);
    }
  };

  // 회원가입
  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입 완료");
    } catch (e) {
      alert(e.message);
    }
  };

  // 업로드
  const uploadVideo = async (file) => {
    if (!file) return;

    const storageRef = ref(storage, `videos/${file.name}`);
    await uploadBytes(storageRef, file);

    alert("업로드 완료");
  };

  // 분석
  const analyze = async () => {
    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        drill: "dribbling",
        duration: "1 min",
      }),
    });

    const data = await res.json();

    await addDoc(collection(db, "analysisResults"), {
      userEmail: email,
      score: data.result.score,
      createdAt: serverTimestamp(),
    });

    alert("분석 완료");

    setLoading(false);
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
      <div className="bg-white p-6 rounded-xl shadow">
        <input type="file" onChange={(e) => uploadVideo(e.target.files[0])} />

        <button
          onClick={analyze}
          className="ml-2 bg-green-500 text-white px-3 py-1"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </div>
  );
}
