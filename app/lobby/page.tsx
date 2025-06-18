import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import LobbyClient from "./LobbyClient";
import ProtectedRoute from "@/components/protectedRoute";
import { Suspense } from "react"; // Import Suspense

export default function LobbyPage() {
  return (
    <ProtectedRoute>
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

          {/* Wrap LobbyClient in Suspense */}
          <Suspense fallback={<div>Carregando Lobby...</div>}>
            <LobbyClient />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}