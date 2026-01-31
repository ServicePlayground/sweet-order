"use client";

import React from "react";
import { ChatRoom } from "@/apps/web-user/features/chat/components/ChatRoom";

export default function ChatRoomPage() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">채팅</h1>
      </div>

      {/* 채팅방 */}
      <ChatRoom />
    </div>
  );
}
