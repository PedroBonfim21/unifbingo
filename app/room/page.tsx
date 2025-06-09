/* vai receber o componente Bingo_board que vai estar com a cartela do bingo */
"use client";

import { useState } from "react";
import BingoBoard from "@/components/bingoBoard";

const mockBoard: Array<number | "FREE"> = [
  5, 18, 31, 49, 60,
  12, 23, 39, 50, 66,
  3, 20, "FREE", 52, 72,
  8, 25, 33, 55, 63,
  1, 16, 30, 48, 70
];

const mockPlayers = [
  { id: 1, name: "Você" },
  { id: 2, name: "Maria" },
  { id: 3, name: "João" },
  { id: 4, name: "Lucas" },
];

export default function RoomPage() {
  const [marked, setMarked] = useState<Array<number | "FREE">>(["FREE"]);
  const currentNumber = 33;

  const handleMark = () => {
    if (!marked.includes(currentNumber)) {
      setMarked([...marked, currentNumber]);
    }
  };

  return (
    <div className="min-h-screen bg-purple-900 p-4 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Cartela */}
          <div className="flex-1 flex flex-col items-center space-y-4">
            <h2 className="text-xl font-bold text-purple-800">Sua Cartela</h2>
            <BingoBoard board={mockBoard} markedNumbers={marked} />
            <button
              onClick={handleMark}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Marcar Número
            </button>
          </div>

          {/* Painel lateral */}
          <div className="w-full md:w-64 space-y-4">
            <div className="bg-purple-100 rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold text-purple-800">Número Atual</h3>
              <div className="text-4xl font-bold text-purple-700 mt-2">
                {currentNumber}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Jogadores</h3>
              <ul className="space-y-1">
                {mockPlayers.map((player) => (
                  <li
                    key={player.id}
                    className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-700"
                  >
                    {player.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
