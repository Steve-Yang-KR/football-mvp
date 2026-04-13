"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // 로그인 감지 + 채팅방 불러오기
  useEffect(() => {
    auth.onAuthStateChanged((u) => {
      if (!u) return;
      setUser(u);

      const q = query(
        collection(db, "chatRooms"),
        where("userEmail", "==", u.email)
      );

      onSnapshot(q, (snapshot) => {
        const roomList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomList);
      });
    });
  }, []);

  // 메시지 불러오기
  useEffect(() => {
    if (!selectedRoom) return;

    const q = query(
      collection(db, "messages"),
      where("roomId", "==", selectedRoom.id),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedRoom]);

  // 메시지 보내기
  const sendMessage = async () => {
    if (!text) return;

    await addDoc(collection(db, "messages"), {
      roomId: selectedRoom.id,
      sender: user.email,
      text,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div className="flex gap-6">

      {/* 채팅방 리스트 */}
      <div className="w-1/3 bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-3">Chat Rooms</h3>

        {rooms.map((room) => (
          <div
            key={room.id}
            className="p-2 border mb-2 cursor-pointer"
            onClick={() => setSelectedRoom(room)}
          >
            {room.coachName}
          </div>
        ))}
      </div>

      {/* 채팅창 */}
      <div className="flex-1 bg-white p-4 rounded shadow">
        {selectedRoom ? (
          <>
            <h3 className="font-bold mb-3">
              Chat with {selectedRoom.coachName}
            </h3>

            <div className="h-[300px] overflow-y-auto border mb-3 p-2">
              {messages.map((m, i) => (
                <div key={i} className="mb-2">
                  <b>{m.sender}:</b> {m.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 border p-2"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white px-4"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a chat</p>
        )}
      </div>

    </div>
  );
}
