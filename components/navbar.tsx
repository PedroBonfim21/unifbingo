"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const routes = [
  { href: "/", label: "Início" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Registrar" },
  { href: "/join", label: "Entrar em Sala" },
  { href: "/lobby", label: "Lobby" },
  { href: "/room", label: "Sala" },
];

export default function Navbar() {
  const router = useRouter();
  // Checa o token apenas no render, sem useEffect
  let isLogged = false;
  if (typeof window !== "undefined" && localStorage.getItem("token")) {
    isLogged = true;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    router.replace("/login");
  };

  return (
    <nav className="w-full flex gap-2 px-4 py-3 border-b bg-white mb-6 items-center">
      <div className="flex gap-2 flex-1">
        {routes.map((route) => (
          <Link key={route.href} href={route.href} passHref>
            <Button variant="outline" className="text-sm">
              {route.label}
            </Button>
          </Link>
        ))}
      </div>
      {isLogged && (
        <Button
          variant="destructive"
          className="text-sm"
          onClick={handleLogout}
        >
          Logout
        </Button>
      )}
    </nav>
  );
}