"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HousePlus } from "lucide-react";

export default function PlusButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      let token = "";
      if (typeof window !== "undefined") {
        const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
        token = match ? match[2] : "";
      }

      if (!token) {
        alert("Você precisa estar logado para criar uma sala.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/bingo-rooms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ name: "Sala" }),
      });

      if (!response.ok) {
        alert("Erro ao criar sala.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      router.push(`/lobby?roomCode=${data.room_code}&roomId=${data.id}`);
    } catch (error) {
      console.error("Failed to connect to server or create room:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreateRoom}
      disabled={loading}
      className="
        bg-purple-700 hover:bg-purple-800 text-white rounded-full
        "
      aria-label="Criar sala"
    >
      <HousePlus
        size={32}
        className="
          sm:w-10 sm:h-10
          md:w-12 md:h-12
          lg:w-16 lg:h-16
        "
      />
    </button>
  );
}