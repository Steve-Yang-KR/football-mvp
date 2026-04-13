"use client";

import { useEffect, useState, useRef } from "react";
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

  const bottomRef = useRef(null);

  // 로그인 + 채팅방
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

  // 메시지
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

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [selectedRoom]);

  // 메시지 보내기
  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "messages"), {
      roomId: selectedRoom.id,
      sender: user.email,
      text,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div className="flex h-[80vh] gap-4">

      {/* 채팅방 리스트 */}
      <div className="w-1/3 bg-white rounded-xl shadow p-4 overflow-y-auto">
        <h3 className="font-bold mb-4">💬 Chats</h3>

        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className={`p-3 rounded cursor-pointer mb-2 ${
              selectedRoom?.id === room.id
                ? "bg-blue-100"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="font-semibold">{room.coachName}</div>
            <div className="text-sm text-gray-500">
              Tap to chat
            </div>
          </div>
        ))}
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 bg-white rounded-xl shadow flex flex-col">

        {selectedRoom ? (
          <>
            {/* 헤더 */}
            <div className="p-4 border-b font-bold">
              {selectedRoom.coachName}
            </div>

            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((m, i) => {
                const isMe = m.sender === user.email;

                return (
                  <div
                    key={i}
                    className={`flex ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[70%] ${
                        isMe
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* 입력창 */}
            <div className="p-3 border-t flex gap-2">
              <input
                className="flex-1 border rounded px-3 py-2"
                placeholder="메시지 입력..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="bg-blue-600 text-white px-4 rounded"
                onClick={sendMessage}
              >
                전송
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            채팅방을 선택하세요
          </div>
        )}
      </div>
    </div>
  );
}
