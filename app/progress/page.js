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
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);

      const q = query(
        collection(db, "analysisResults"),
        where("userEmail", "==", u.email),
        orderBy("createdAt", "asc")
      );

      const snapshot = await getDocs(q);

      const result = snapshot.docs.map((doc, index) => {
        const d = doc.data();

        return {
          index: index + 1,
          score: d.score,
        };
      });
      
      console.log("데이터:", result);
      
      setData(result);
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">📈 My Progress</h1>

      {data.length === 0 && <p>No data yet</p>}

      {data.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow w-full h-[300px]">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
