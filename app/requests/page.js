"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);

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
      console.error(e);
      alert("데이터 불러오기 실패");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📋 코치 요청 리스트</h1>

      {requests.length === 0 && <p>요청이 없습니다.</p>}

      {requests.map((req) => (
        <div key={req.id} style={{
          border: "1px solid #ddd",
          padding: 10,
          marginTop: 10
        }}>
          <h3>{req.coachName}</h3>
          <p>{req.specialty}</p>
          <p>{req.userEmail}</p>
        </div>
      ))}
    </div>
  );
}
