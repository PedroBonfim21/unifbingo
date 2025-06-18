import ProtectedRoute from "@/components/protectedRoute";
import { Suspense } from "react";
import RoomClient from "./Roomclient";

export default function RoomPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Carregando Sala...</div>}>
        <RoomClient />
      </Suspense>
    </ProtectedRoute>
  );
}