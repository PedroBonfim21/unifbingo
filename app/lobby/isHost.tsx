import { useEffect, useState } from "react";

export function useIsHost(): boolean | undefined {
  const [isHost, setIsHost] = useState<boolean>();

  useEffect(() => {
    async function fetchUserRole() {
      
      try {
      // Recupera o token do cookie
      let token = "";
      if (typeof window !== "undefined") {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        token = match ? match[2] : "";
      }
        const response = await fetch(`http://127.0.0.1:8000/api/users/:id/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}` // se usar autenticação
          },
        });
        if (!response.ok) {
          throw new Error("Erro ao buscar o papel do usuário.");
        }
        const data = await response.json();
        setIsHost(data.role === "host");
    }
      catch (error) {
        console.error("Erro ao buscar o papel do usuário:", error);
        setIsHost(false);
      }
    }
    fetchUserRole();
  }, []);

  return isHost;
}