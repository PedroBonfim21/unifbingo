"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  role: "host" | "player";
};

type UsersListProps = {
  roomCode: string;
};

export default function UsersList({ roomCode }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const tokenMatch = typeof window !== "undefined"
          ? document.cookie.match(new RegExp('(^| )token=([^;]+)'))
          : null;
        const token = tokenMatch ? tokenMatch[2] : "";

        const response = await fetch(
          `http://127.0.0.1:8000/api/bingo-rooms/${roomCode}/participants/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        if (!response.ok) {
          setError("Erro ao buscar usuários da sala.");
          setLoading(false);
          return;
        }
        const data = await response.json();
        setUsers(data);
      } catch {
        setError("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    }
    if (roomCode) fetchUsers();
  }, [roomCode]);

  if (loading) {
    return <div className="text-gray-500">Carregando jogadores...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-purple-800">Jogadores na Sala</h2>
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center px-4 py-2">
            <span className="font-medium text-gray-700">{user.name}</span>
            {user.role === "host" && (
              <span className="text-xs text-white bg-purple-600 px-2 py-0.5 rounded-full">
                Host
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}