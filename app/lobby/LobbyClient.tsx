"use client";

import { useSearchParams, useRouter } from "next/navigation";
import UsersList from "./users_list";

export default function LobbyClient({ isHost }: { isHost: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomCode = searchParams.get("roomCode") || "";
  const roomId = searchParams.get("roomId") || "";

  const handleStartGame = async () => {
    try {
      // Recupera o token do cookie
      let token = "";
      if (typeof window !== "undefined") {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        token = match ? match[2] : "";
      }

      // Cria a game session
      const response = await fetch(`http://127.0.0.1:8000/api/game-sessions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}` // se usar autenticação
        },
        body: JSON.stringify({ room: roomId })
      });

      if (!response.ok) {
        alert("Erro ao iniciar o jogo.");
        return;
      }

      const data = await response.json();
      // Redireciona para a página da sala do jogo usando o room uuid retornado
      router.push(`/room?roomCode=${roomCode}&roomId=${data.room}`);
    } catch {
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <>
      <div className="text-center mt-4">
        <h1 className="text-2xl font-bold text-purple-800">Sala de Espera</h1>
        <p className="text-sm text-gray-500 mt-1">
          Código da Sala: <span className="font-mono">{roomCode}</span>
        </p>
      </div>
      <UsersList roomCode={roomCode} />
      {isHost && (
        <button
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
          onClick={handleStartGame}
        >
          Iniciar Jogo
        </button>
      )}
    </>
  );
}