"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinForm() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!roomCode) return;

    setLoading(true);

    try {
      // Recupera o token do cookie
      let token = "";
      if (typeof window !== "undefined") {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        token = match ? match[2] : "";
      }
      

      const response = await fetch(
        `http://127.0.0.1:8000/api/bingo-rooms/?room_code=${roomCode}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      ); //ok

      if (!response.ok) {
        setError("Erro ao buscar sala.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        setError("Sala não encontrada.");
        setLoading(false);
        return;
      }
      const joinRoom = await fetch(
        `http://127.0.1:8000/api/join-room/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ room: data[0].id }),
          method: "POST",
        }
      );
      // Sala existe, redireciona para o lobby
      if (!joinRoom.ok) {
        setError(joinRoom.statusText || "Erro ao entrar na sala.");
        setLoading(false);
        return;
      };
      localStorage.setItem("room_code", roomCode);
      document.cookie = `room_code=${roomCode}; path=/;`;
      localStorage.setItem("room_id", data[0].id);
      document.cookie = `room_id=${data[0].id}; path=/;`;
      const roomId = data[0].id;
      router.push(`/lobby?roomCode=${roomCode}&roomId=${roomId}`);
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Código da sala"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-center tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-purple-600"
        required
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-purple-700 text-white font-semibold py-2 rounded-lg hover:bg-purple-800 transition"
        disabled={loading}
      >
        {loading ? "Verificando..." : "Entrar"}
      </button>
    </form>
  );
}