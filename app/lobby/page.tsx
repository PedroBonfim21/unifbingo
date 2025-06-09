import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import LobbyClient from "./LobbyClient";

export default function LobbyPage() {
  const isHost = true; // ajuste conforme sua lógica

  return (
    <div className="min-h-screen bg-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 space-y-6 relative">
        {/* Botão de voltar */}
        <Link
          href="/join"
          className="absolute top-4 left-4 text-purple-600 hover:text-purple-800 flex items-center gap-1 text-sm"
        >
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <LobbyClient isHost={isHost} />
      </div>
    </div>
  );
}