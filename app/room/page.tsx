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

  const getSessionId = async () => {
    if (!isHost) {
      const response = await fetch(`http://localhost:8000/api/game-sessions/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("token")}`,
        },
      });
      const data = await response.json();
      const sessionID = data[data.length - 1]?.id;
      setSessionId(sessionID);
      console.log("Session ID:", sessionID);

      localStorage.setItem("sessionId", sessionID);
    }
    if (typeof window !== "undefined") {
      const sessionId = localStorage.getItem("sessionId");
      setSessionId(sessionId);
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

  const nextNumber = async () => {
    console.log("Session ID:", sessionId);

    if (sessionId === undefined) {
      nextNumber();
      return;
    }

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

    if (!response.ok) {
      console.error("Erro ao buscar números sorteados:", response.statusText);
      return;
    }

    const serverNumbers = await response.json();
    interface ServerNumber {
      number: number;
    }
    const serverSortedNumbers: number[] = (serverNumbers as ServerNumber[]).map(
      (item: ServerNumber) => item.number
    );

    if (
      sortedNumbers.length === 0 ||
      JSON.stringify(sortedNumbers) !== JSON.stringify(serverSortedNumbers)
    ) {
      const remainingNumbers = serverSortedNumbers.filter(
        (num) => !marked.includes(num)
      );

      if (remainingNumbers.length > 0) {
        const nextNum = remainingNumbers[0];
        setCurrentNumber(nextNum);
        setMarked([...marked, nextNum]);
        localStorage.setItem(
          "markedNumbers",
          JSON.stringify([...marked, nextNum])
        );
      } else {
        console.log(
          "Todos os números foram marcados. Consultando novamente..."
        );
      }
    } else {
      console.log("Não há novos números disponíveis.");
    }
  };

  const handleRefreshListNumbers = async () => {
    const token = getCookie("token");
    if (token && sessionId) {
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

      if (!response.ok) {
        console.error("Erro ao buscar números sorteados:", response.statusText);
        return;
      }
      const numbers = await response.json();
      setCurrentNumber(numbers[numbers.length - 1].number);
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
        {/* Número Atual sempre no topo */}
        <div className="w-full md:w-64 mx-auto mb-4">
          <div className="bg-purple-100 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-purple-800">
              Número Atual
            </h3>
            <div className="text-4xl font-bold text-purple-700 mt-2">
              {currentNumber}
            </div>
          </div>
        </div>

        {/* Cartela centralizada */}
        <div className="flex flex-col items-center space-y-4">
          {!isHost && (
            <h2 className="text-xl font-bold text-purple-800">Sua Cartela</h2>
          )}
          <BingoBoard board={bingoBoard} markedNumbers={marked} />
        </div>

        {/* Botões e números sorteados (sempre embaixo) */}
        <div className="w-full flex flex-col items-center space-y-2 mt-6">
          {isHost && (
            <>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full md:w-64"
                onClick={handleDrawNumber}
              >
                Gerar número
              </button>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {sortedNumbers.map((number) => (
                  <div
                    key={number}
                    className="bg-purple-100 text-purple-800 text-center font-bold rounded-lg p-2"
                  >
                    {number}
                  </div>
                ))}
              </div>
            </>
          )}
          {!isHost && (
            <>
              <button
                onClick={handleMark}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full md:w-64"
              >
                Marcar Número
              </button>
              <button
                onClick={nextNumber}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full md:w-64"
              >
                Próximo número
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
