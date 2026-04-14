"use client";

import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export default function LeaderboardPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "analysisResults"),
        orderBy("score", "desc"),
        limit(10)
      );

      const snapshot = await getDocs(q);

      const result = snapshot.docs.map((doc, index) => ({
        rank: index + 1,
        ...doc.data(),
      }));

      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">🏆 Leaderboard</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {data.map((user, i) => (
          <div
            key={i}
            className="flex justify-between border-b py-2"
          >
            <span>
              {user.rank}. {user.userEmail}
            </span>

            <span className="font-bold text-blue-600">
              {user.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
