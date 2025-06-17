"use client";

import { useState, useEffect } from "react";
import BingoBoard from "@/components/bingoBoard";

export default function RoomPage() {
  const bingoCardCookie = getCookie("bingoCard");
  const [isHost, setIsHost] = useState(false);
  const [token, setToken] = useState<string>("");
  const [marked, setMarked] = useState<Array<number | "FREE">>(["FREE"]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bingoBoard, setBingoBoard] = useState<Array<number | "FREE">>([]);
  const [sortedNumbers, setSortedNumbers] = useState<Array<number>>([]);

  const mountBingoBoard = () => {
    if (bingoCardCookie) {
      const boardFromApi = bingoCardCookie.split(",");
      setBingoBoard(
        boardFromApi.map((item) => (item === "X" ? "FREE" : Number(item)))
      );
    }
  };

  function getCookie(name: string) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  }

  const getToken = () => {
    if (token) return;
    if (typeof window !== "undefined") {
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      const token = match ? decodeURIComponent(match[2]) : "";
      setToken(token);
    }
  };

  const handleSetHost = async () => {
    try {
      const match = document.cookie.match(new RegExp("(^| )role=([^;]+)"));
      const role = match ? match[2] : "";
      setIsHost(role === "host" || role === "admin");
    } catch (error) {
      console.error("Erro ao definir o host:", error);
    }
  };

  const getSessionId = () => {
    if (sessionId) return;
    if (typeof window !== "undefined") {
      const match = document.cookie.match(
        new RegExp("(^| )gameSessionID=([^;]+)")
      );
      const sessionId = match ? match[2] : "";
      setSessionId("eee74d07-1fd9-4e96-85ca-5c0c657e13e9");
      console.log("Session ID:", sessionId);
    }
  };

  const getMarkedNumbers = async () => {
    const storedMarkedNumbers = localStorage.getItem("markedNumbers");
    if (storedMarkedNumbers) {
      setMarked(JSON.parse(storedMarkedNumbers));
      setCurrentNumber(
        JSON.parse(storedMarkedNumbers)[
          JSON.parse(storedMarkedNumbers).length - 1
        ]
      );
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

      const updatedSortedNumbers = [...sortedNumbers, data.number].sort(
        (a, b) => a - b
      );
      setSortedNumbers(updatedSortedNumbers);

      localStorage.setItem(
        "sortedNumbers",
        JSON.stringify(updatedSortedNumbers)
      );
    }
  };

  const handleMark = () => {
    if (currentNumber !== null && !marked.includes(currentNumber)) {
      const updatedMarked = [...marked, currentNumber];
      setMarked(updatedMarked);
      localStorage.setItem("markedNumbers", JSON.stringify(updatedMarked));
    }
  };

  const handleRefreshListNumbers = async () => {
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

      // const markedNumbers = numbers.map(
      //   (num: { number: number }) => num.number
      // );
      // localStorage.setItem("markedNumbers", JSON.stringify(markedNumbers));
    }
  };

  const getSortedNumbers = () => {
    const storedSortedNumbers = localStorage.getItem("sortedNumbers");
    if (storedSortedNumbers) {
      setSortedNumbers(JSON.parse(storedSortedNumbers));
      setCurrentNumber(
        JSON.parse(storedSortedNumbers)[
          JSON.parse(storedSortedNumbers).length - 1
        ]
      );
    }
  };

  useEffect(() => {
    handleSetHost();
    getToken();
    getSessionId();
    mountBingoBoard();
    getMarkedNumbers();
    handleRefreshListNumbers();
    getSortedNumbers();
  }, []);

  return (
    <div className="min-h-screen bg-purple-900 p-4 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Cartela */}
          <div className="flex-1 flex flex-col items-center space-y-4">
            {!isHost && (
              <h2 className="text-xl font-bold text-purple-800">Sua Cartela</h2>
            )}
            <BingoBoard board={bingoBoard} markedNumbers={marked} />
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
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full"
                onClick={handleDrawNumber}
              >
                gerar numero
              </button>
            )}
            {isHost && (
              <div className="grid grid-cols-5 gap-2">
                {sortedNumbers.map((number) => (
                  <div
                    key={number}
                    className="bg-purple-100 text-purple-800 text-center font-bold rounded-lg p-2"
                  >
                    {number}
                  </div>
                ))}
              </div>
            )}
            {!isHost && (
              <button
                onClick={handleMark}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full"
              >
                Marcar Número
              </button>
            )}
            {!isHost && (
              <button
                onClick={handleRefreshListNumbers}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full"
              >
                atualizar lista de numeros
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
