import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/protectedRoute";
import { Suspense } from "react";

// Importa dinamicamente o componente cliente com SSR desativado
const RoomClient = dynamic(() => import("./Roomclient"), { ssr: false });

export default function RoomPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Carregando Sala...</div>}>
        <RoomClient />
      </Suspense>
    </ProtectedRoute>
  );
}