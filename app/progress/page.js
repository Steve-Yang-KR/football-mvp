"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// 📊 Chart
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ProgressPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) return;

      console.log("로그인 유저:", u.email);

      const q = query(
        collection(db, "analysisResults"),
        where("userEmail", "==", u.email),
        orderBy("createdAt", "asc")
      );

      const snapshot = await getDocs(q);

      const result = snapshot.docs.map((doc) => {
        const d = doc.data();

        // 🔥 timestamp → 날짜 변환
        const date = d.createdAt?.toDate();

        return {
          date: date
            ? `${date.getMonth() + 1}/${date.getDate()}`
            : "N/A",
          score: d.score,
        };
      });

      console.log("날짜 데이터:", result);

      setData(result);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📈 My Progress</h1>

      {data.length === 0 && (
        <p className="text-gray-500">No data yet</p>
      )}

      {data.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow w-full h-[320px]">

          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="#eee" />

              {/* 날짜 */}
              <XAxis dataKey="date" />

              {/* 점수 */}
              <YAxis domain={[0, 100]} />

              {/* 툴팁 */}
              <Tooltip formatter={(value) => [`${value}점`, "Score"]} />

              {/* 라인 */}
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>
      )}
    </div>
  );
}
