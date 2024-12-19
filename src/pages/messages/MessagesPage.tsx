import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatList } from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

interface ChatUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export default function MessagesPage() {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 flex">
        <div className="w-80 border-r">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold">Mensagens</h1>
          </div>
          <ChatList onSelectUser={setSelectedUser} />
        </div>
        <div className="flex-1">
          <ChatWindow selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
}