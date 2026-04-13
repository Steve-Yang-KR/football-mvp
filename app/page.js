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

  return (
    <div style={{ padding: 20 }}>
      <h1>⚽ AI Football App</h1>

      {/* 이메일 */}
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      {/* 비밀번호 */}
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      {/* 버튼 */}
      <button onClick={signUp}>회원가입</button>
      <button onClick={login}>로그인</button>

      <br /><br />

      {/* 영상 업로드 */}
      <input
        type="file"
        accept="video/*"
        onChange={(e) => uploadVideo(e.target.files[0])}
      />
    </div>
  );
}
