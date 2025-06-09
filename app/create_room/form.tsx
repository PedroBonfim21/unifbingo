/* Formulário para criar uma sala de bingo (apenas host ou admin) */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoomForm() {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      let token = "";
      if (typeof window !== "undefined") {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        token = match ? match[2] : "";
      }
      if (!token) {
        setError("Você precisa estar logado para criar uma sala.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/bingo-rooms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          name: roomName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Erro ao criar sala.");
        setLoading(false);
        return;
      }

      // Aguarda o JSON e pega o room_code
      const data = await response.json();
      setSuccess("Sala criada com sucesso!");
      setRoomName(data.room_code);

      // Redireciona para a sala criada usando o room_code retornado
      router.push(`/lobby?roomCode=${data.room_code}&roomId=${data.id}`);
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
        placeholder="Nome da sala"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button
        type="submit"
        className="w-full bg-purple-700 text-white font-semibold py-2 rounded-lg hover:bg-purple-800 transition"
        disabled={loading}
      >
        {loading ? "Criando..." : "Criar Sala"}
      </button>
    </form>
  );
}