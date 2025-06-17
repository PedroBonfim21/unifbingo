"use client";

import { useState, useEffect } from "react";
import BingoBoard from "@/components/bingoBoard";
import ProtectedRoute from "@/components/protectedRoute";

// Recupera o valor do cookie bingoCard - gerar componente BingoBoard para nao realizar a requisição aqui
function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function RoomPage() {
  const [isHost, setIsHost] = useState(false);

  const handleSetHost = async () => {
    try {
      const match = document.cookie.match(new RegExp("(^| )role=([^;]+)"));
      const role = match ? match[2] : "";
      setIsHost(role === "host" || role === "admin");
    } catch (error) {
      console.error("Erro ao definir o host:", error);
    }
  };
  const bingoCardCookie = getCookie("bingoCard");

  useEffect(() => {
    handleSetHost();
    getToken();
    mountBingoBoard();
    getMarkedNumbers();
    handleRefreshListNumbers();
  });

  const [token, setToken] = useState<string>("");
  const [marked, setMarked] = useState<Array<number | "FREE">>(["FREE"]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const sessionId = "7a32aba1-73b6-4015-ad07-9e42777d9717";
  const [bingoBoard, setBingoBoard] = useState<Array<number | "FREE">>([]);

  const mountBingoBoard = () => {
    if (bingoCardCookie) {
      const boardFromApi = bingoCardCookie.split(","); // agora é string[]
      setBingoBoard(
        boardFromApi.map((item) => (item === "X" ? "FREE" : Number(item)))
      );
    }
  };
  const getToken = () => {
    if (token) return;
    if (typeof window !== "undefined") {
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      const token = match ? decodeURIComponent(match[2]) : "";
      setToken(token);
    }
  };

  const getMarkedNumbers = async () => {
    const storedMarkedNumbers = localStorage.getItem("markedNumbers");
    if (storedMarkedNumbers) {
      setMarked(JSON.parse(storedMarkedNumbers));
    }
  };

  const handleDrawNumber = async () => {
    if (!sessionId) return;
    const response = await fetch(
      `http://localhost:8000/api/game-sessions/${sessionId}/draw-next/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setCurrentNumber(data.number);
    }
  };

  const handleMark = () => {
    if (currentNumber !== null && !marked.includes(currentNumber)) {
      setMarked([...marked, currentNumber]);
    }
  };
  const handleRefreshListNumbers = async (mark: boolean = false) => {
    mountBingoBoard();
    const token = getCookie("token");
    if (token) {
      const response = await fetch(
        `http://localhost:8000/api/drawn-numbers/?session=${sessionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      const numbers = await response.json();
      setCurrentNumber(numbers[numbers.length - 1].number);
      const markedNumbers = numbers.map(
        (num: { number: number }) => num.number
      );
      if (mark) {
        setMarked(markedNumbers);
        localStorage.setItem("markedNumbers", JSON.stringify(markedNumbers));
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-purple-900 p-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-6 space-y-6">
          {/* Use flex-col-reverse on mobile, flex-row on larger screens */}
          <div className="flex flex-col-reverse md:flex-row md:items-start gap-6">
            {/* Cartela */}
            <div className="flex-1 flex flex-col items-center space-y-4">
              <h2 className="text-xl font-bold text-purple-800">Sua Cartela</h2>
              <BingoBoard
                board={bingoBoard}
                markedNumbers={marked}
              />
              <button
                onClick={handleMark}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Marcar Número
              </button>
              <button
                onClick={() => handleRefreshListNumbers(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                atualizar lista de numeros
              </button>
            </div>

            {/* Painel lateral */}
            <div className="w-full md:w-64 space-y-4">
              <div className="bg-purple-100 rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold text-purple-800">
                  Número Atual
                </h3>
                <div className="text-4xl font-bold text-purple-700 mt-2">
                  {currentNumber}
                </div>
              </div>

              {isHost && (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  onClick={handleDrawNumber}
                >
                  gerar numero
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}