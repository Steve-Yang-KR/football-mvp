"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);

  // 데이터 가져오기
  const fetchRequests = async () => {
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
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ 승인 함수
  const acceptRequest = async (id) => {
    try {
      const refDoc = doc(db, "coachRequests", id);

      await updateDoc(refDoc, {
        status: "accepted",
      });

      alert("요청 승인 완료!");

      fetchRequests(); // 새로고침
    } catch (e) {
      alert("승인 실패: " + e.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>📋 코치 요청 리스트</h1>

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
          <p>요청자: {req.userEmail}</p>

          {/* 상태 표시 */}
          <p>
            상태:
            <b
              style={{
                color:
                  req.status === "accepted"
                    ? "green"
                    : req.status === "rejected"
                    ? "red"
                    : "orange",
              }}
            >
              {" "}{req.status || "pending"}
            </b>
          </p>

          {/* 승인 버튼 */}
          {req.status !== "accepted" && (
            <button onClick={() => acceptRequest(req.id)}>
              ✅ 승인
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
