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
  // Unify to one state variable name
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
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

  // Renamed to fetchAndSetGameSessionId for clarity and combined logic
  const fetchAndSetGameSessionId = useCallback(async () => {
    // Prefer the state variable if already set
    if (gameSessionId) {
      console.log("Game Session ID already in state:", gameSessionId);
      return;
    }

    if (typeof window !== "undefined") {
      // Try to get from localStorage first
      const storedGameSessionId = localStorage.getItem("gameSessionId");
      if (storedGameSessionId) {
        setGameSessionId(storedGameSessionId);
        console.log("Game Session ID from localStorage:", storedGameSessionId);
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
      const latestSessionId = data[data.length - 1]?.id; // Ensure this matches your API response structure
      if (latestSessionId) {
        setGameSessionId(latestSessionId);
        console.log("Game Session ID from API:", latestSessionId);
        if (typeof window !== "undefined") {
          // Store consistently with the chosen key
          localStorage.setItem("gameSessionId", latestSessionId);
        }
      } else {
        console.error("No session ID found in API response.");
      }
    } catch (error) {
      console.error("Erro ao obter o ID da sessão:", error);
    }
  }, [gameSessionId]); // Dependency updated

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
    // Use the state variable gameSessionId, which should be populated by fetchAndSetGameSessionId
    if (!gameSessionId || !token) {
      console.error("Game Session ID or Token is missing. Cannot draw number.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/game-sessions/${gameSessionId}/draw-next/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Use the token state variable
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
  }, [gameSessionId, token, sortedNumbers]); // Dependency updated

  const handleMark = useCallback(() => {
    // This call is likely redundant here if fetchAndSetGameSessionId is called on mount
    // It's also async, so it doesn't guarantee the cookie/localStorage is set before needed
    // Consider if handleMark genuinely needs to re-fetch the session ID or just use the current state
    // For now, I'll remove it as gameSessionId should be in state by this point.
    // getGameSessionId(); // Removed this line

    if (currentNumber !== null && !marked.includes(currentNumber)) {
      const updatedMarked = [...marked, currentNumber];
      setMarked(updatedMarked);
      if (typeof window !== "undefined") {
        localStorage.setItem("markedNumbers", JSON.stringify(updatedMarked));
      }
    }
  }, [currentNumber, marked]);

  // Removed getGameSessionId as its logic is now combined into fetchAndSetGameSessionId
  // const getGameSessionId = useCallback(async() => { /* ... */ }, []);

  const nextNumber = useCallback(async () => {
    // Ensure the session ID and token are available
    // Instead of re-fetching here, rely on the state being populated by useEffect
    if (!gameSessionId || !token) {
      console.error("Game Session ID or Token is null/undefined. Cannot fetch drawn numbers.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/drawn-numbers/?session=${gameSessionId}`, // Use the gameSessionId state
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`, // Use the token state
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
        JSON.stringify(sortedNumbers) !== JSON.stringify(serverSortedNumbers.sort((a, b) => a - b))
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
  }, [gameSessionId, token, marked, sortedNumbers]); // Dependencies updated

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
    // Initial data fetching when the component mounts
    handleSetHost();
    getToken();
    fetchAndSetGameSessionId(); // Call the combined function
    mountBingoBoard();
    getMarkedNumbers();
    getSortedNumbers();
  }, [handleSetHost, getToken, fetchAndSetGameSessionId, mountBingoBoard, getMarkedNumbers, getSortedNumbers]);


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
              {/* This button previously called getGameSessionId, which is now fetchAndSetGameSessionId.
                  It might be redundant if the session ID is already handled by useEffect.
                  Consider if you still need a manual trigger for this. */}
              {/* <button
                onClick={fetchAndSetGameSessionId} // Changed function name
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition w-full md:w-64"
              >
                SessionGame
              </button> */}
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