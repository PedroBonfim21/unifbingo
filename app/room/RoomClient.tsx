"use client"; // Esta diretiva é crucial

import { useState, useEffect, useCallback } from "react";
import BingoBoard from "@/components/bingoBoard";

// Função auxiliar para cookies, segura para SSR (verifica 'window' antes de acessar 'document')
function getCookie(name: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

export default function RoomClient() {
  const [isHost, setIsHost] = useState(false);
  const [token, setToken] = useState<string>("");
  const [marked, setMarked] = useState<Array<number | "FREE">>(["FREE"]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bingoBoard, setBingoBoard] = useState<Array<number | "FREE">>([]);
  const [sortedNumbers, setSortedNumbers] = useState<Array<number>>([]);

  const mountBingoBoard = useCallback(() => {
    const bingoCardCookie = getCookie("bingoCard");
    if (bingoCardCookie) {
      const boardFromApi = bingoCardCookie.split(",");
      setBingoBoard(
        boardFromApi.map((item) => (item === "X" ? "FREE" : Number(item)))
      );
    }
  }, []);

  const getToken = useCallback(() => {
    if (token) return;
    const currentToken = getCookie("token");
    if (currentToken) {
      setToken(currentToken);
    }
  }, [token]);

  const handleSetHost = useCallback(() => {
    try {
      const role = getCookie("role");
      setIsHost(role === "host" || role === "admin");
    } catch (error) {
      console.error("Erro ao definir o host:", error);
    }
  }, []);

  const getSessionId = useCallback(async () => {
    if (sessionId) return;
    if (typeof window !== "undefined") {
      const storedSessionId = localStorage.getItem("sessionId");
      if (storedSessionId) {
        setSessionId(storedSessionId);
        console.log("Session ID from localStorage:", storedSessionId);
        return;
      }
    }

    const currentToken = getCookie("token");
    if (!currentToken) {
      console.error("No token found to fetch game sessions.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/game-sessions/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${currentToken}`,
        },
      });
      if (!response.ok) {
        console.error("Failed to fetch game sessions:", response.statusText);
        return;
      }
      const data = await response.json();
      const sessionID = data[data.length - 1]?.id;
      if (sessionID) {
        setSessionId(sessionID);
        console.log("Session ID from API:", sessionID);
        if (typeof window !== "undefined") {
          localStorage.setItem("sessionId", sessionID);
        }
      }
    } catch (error) {
      console.error("Erro ao obter o ID da sessão:", error);
    }
  }, [sessionId]);


  const getMarkedNumbers = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedMarkedNumbers = localStorage.getItem("markedNumbers");
      if (storedMarkedNumbers) {
        const parsedMarked = JSON.parse(storedMarkedNumbers);
        setMarked(parsedMarked);
        if (parsedMarked.length > 0) {
          setCurrentNumber(parsedMarked[parsedMarked.length - 1]);
        }
      }
    }
  }, []);

  const handleDrawNumber = useCallback(async () => {
    if (!sessionId || !token) return;
    try {
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
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "sortedNumbers",
            JSON.stringify(updatedSortedNumbers)
          );
        }
      } else {
        console.error("Erro ao sortear número:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao conectar para sortear número:", error);
    }
  }, [sessionId, token, sortedNumbers]);

  const handleMark = useCallback(() => {
    if (currentNumber !== null && !marked.includes(currentNumber)) {
      const updatedMarked = [...marked, currentNumber];
      setMarked(updatedMarked);
      if (typeof window !== "undefined") {
        localStorage.setItem("markedNumbers", JSON.stringify(updatedMarked));
      }
    }
  }, [currentNumber, marked]);

  const nextNumber = useCallback(async () => {
    console.log("Session ID:", sessionId);

    if (!sessionId || !token) {
      console.log("Session ID or token not available yet for nextNumber.");
      return;
    }

    try {
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
        sortedNumbers.length !== serverSortedNumbers.length ||
        JSON.stringify(sortedNumbers) !== JSON.stringify(serverSortedNumbers)
      ) {
        setSortedNumbers(serverSortedNumbers.sort((a, b) => a - b));

        const newNumbers = serverSortedNumbers.filter(
          (num) => !marked.includes(num)
        );

        if (newNumbers.length > 0) {
          const nextNum = newNumbers[newNumbers.length - 1];
          setCurrentNumber(nextNum);
          const updatedMarked = [...marked, nextNum];
          setMarked(updatedMarked);
          if (typeof window !== "undefined") {
            localStorage.setItem("markedNumbers", JSON.stringify(updatedMarked));
            localStorage.setItem("sortedNumbers", JSON.stringify(serverSortedNumbers.sort((a, b) => a - b)));
          }
        } else {
          console.log("Todos os números foram marcados ou não há novos números.");
        }
      } else {
        console.log("Não há novos números disponíveis no servidor.");
      }
    } catch (error) {
      console.error("Erro ao conectar para buscar próximos números:", error);
    }
  }, [sessionId, token, marked, sortedNumbers]);


  /* const handleRefreshListNumbers = useCallback(async () => {
    const currentToken = getCookie("token");
    if (currentToken && sessionId) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/drawn-numbers/?session=${sessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${currentToken}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Erro ao buscar números sorteados:", response.statusText);
          return;
        }
        const numbers = await response.json();
        if (numbers.length > 0) {
          setCurrentNumber(numbers[numbers.length - 1].number);
          setSortedNumbers(numbers.map((item: {number: number}) => item.number).sort((a, b) => a - b));
        }
      } catch (error) {
        console.error("Erro ao conectar para refrescar a lista de números:", error);
      }
    }
  }, [sessionId]); */

  const getSortedNumbers = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedSortedNumbers = localStorage.getItem("sortedNumbers");
      if (storedSortedNumbers) {
        const parsedSorted = JSON.parse(storedSortedNumbers);
        setSortedNumbers(parsedSorted);
        if (parsedSorted.length > 0) {
          setCurrentNumber(parsedSorted[parsedSorted.length - 1]);
        }
      }
    }
  }, []);

  useEffect(() => {
    handleSetHost();
    getToken();
    getSessionId();
    mountBingoBoard();
    getMarkedNumbers();
    getSortedNumbers();
  }, [handleSetHost, getToken, getSessionId, mountBingoBoard, getMarkedNumbers, getSortedNumbers]);


  useEffect(() => {
    if (sortedNumbers.length > 0 && currentNumber === null) {
      setCurrentNumber(sortedNumbers[sortedNumbers.length - 1]);
    }
  }, [sortedNumbers, currentNumber]);


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