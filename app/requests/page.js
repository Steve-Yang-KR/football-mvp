"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);

  // 요청 데이터 가져오기
  const fetchRequests = async () => {
    try {
      const q = query(
        collection(db, "coachRequests"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(data);
    } catch (e) {
      alert("데이터 불러오기 실패: " + e.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>📋 코치 요청 리스트</h1>

      {requests.length === 0 && <p>요청이 없습니다.</p>}

      {requests.map((req) => (
        <div
          key={req.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15,
            marginTop: 10,
            background: "#fff",
          }}
        >
          <h3>{req.coachName}</h3>
          <p>전문 분야: {req.specialty}</p>
          <p>평점: ⭐ {req.rating}</p>
          <p>요청자: {req.userEmail}</p>
          <p style={{ fontSize: 12, color: "#666" }}>
            {req.createdAt?.seconds
              ? new Date(req.createdAt.seconds * 1000).toLocaleString()
              : ""}
          </p>
        </div>
      ))}
    </div>
  );
}
