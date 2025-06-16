"use client";

import { useSearchParams, useRouter } from "next/navigation";
import UsersList from "./users_list";
import { useState, useEffect } from "react";

export default function LobbyClient() {


  const searchParams = useSearchParams();
  const router = useRouter();
  const roomCode = searchParams.get("roomCode") || "";
  const roomId = searchParams.get("roomId") || "";

  const [isHost, setIsHost] = useState(false);

  const handleSetHost = async () => {
    try {
      const match = document.cookie.match(new RegExp('(^| )role=([^;]+)'));
      const role = match ? match[2] : "";
      setIsHost(role === "host" || role === "admin");
    } catch (error) {
      console.error("Erro ao definir o host:", error);
    }
  };
  useEffect(() => {
    handleSetHost();
  }, []);

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
      localStorage.setItem("gameSessionID", data.session);
      document.cookie = `gameSessionID=${data.session}; path=/;`;
      // Redireciona para a página da sala do jogo usando o room uuid retornado
      router.push(`/room?roomCode=${roomCode}&roomId=${data.room}`);
    } catch {
      alert("Erro ao conectar com o servidor.");
    }
  };
  const handleGenCard = async () => {
    try {
        let token = "";
        if (typeof window !== "undefined") {
          const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
          token = match ? match[2] : "";
        }

        const response = await fetch(`http://localhost:8000/api/bingo-cards/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}` // se usar autenticação
          },
          body: JSON.stringify({ room: roomId })
        });
        
        if (!response.ok) {
          alert("Erro ao gerar a cartela.");
          return;
        }
        const data = await response.json();
        localStorage.setItem("bingoCard", data.numbers);
        document.cookie = `bingoCard=${data.numbers}; path=/;`;
        
        // Redireciona para a página da sala do jogo usando o room uuid retornado
        router.push(`/room?roomCode=${roomCode}&roomId=${data.room}`);
    } catch {
      alert("Erro ao conectar com o servidor.");
    }
    }
      

  return (
    <>
      <div className="text-center mt-4">
        <h1 className="text-2xl font-bold text-purple-800">Sala de Espera</h1>
        <p className="text-sm text-gray-500 mt-1">
          Código da Sala: <span className="font-mono">{roomCode}</span>
        </p>
      </div>
      <UsersList roomCode={roomCode} />
      {!isHost && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Você não é o host desta sala. Aguarde o host iniciar o jogo.
        </div>
      )}
      {isHost && (
        <button
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
          onClick={handleStartGame}
        >
          Iniciar Jogo
        </button>
      )}
      {/* Exibe o valor do cookie "role" */}
      <button
        className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition mt-4"
        onClick={handleGenCard}
      >
        Gerar cartela
      </button>
      <div className="mt-4 text-center text-sm text-gray-600">
        {typeof window !== "undefined" && (
          <>
            Role do participante:{" "}
            <span className="font-mono">
              {(() => {
                const match = document.cookie.match(new RegExp('(^| )role=([^;]+)'));
                return match ? decodeURIComponent(match[2]) : "Não encontrado";
              })()}
            </span>
            
          </>
        )}
      </div>
    </>
  );
}