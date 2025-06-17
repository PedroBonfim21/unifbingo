"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const routes = [
  { href: "/", label: "Início" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Registrar" },
  { href: "/join", label: "Entrar em Sala" },
  { href: "/create_room", label: "Criar sala" },
  { href: "/lobby", label: "Lobby" },
  { href: "/room", label: "Sala" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    if (typeof document !== "undefined") {
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
    }
    router.replace("/login");
  };

  const isLogged = typeof window !== "undefined" && localStorage.getItem("token");

  return (
    <nav className="bg-purple-800 text-white py-4 relative">
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold">
          UniFBingo
        </Link>

        {/* Menu Hamburguer (Mobile) */}
        <div className="md:hidden flex items-center gap-2">
          {/* Logout fora do menu hamburguer */}
          {isLogged && (
            <button onClick={handleLogout} className="hover:text-purple-200 text-sm px-2 py-1 rounded">
              Logout
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
            aria-label="Abrir menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Links (Desktop) */}
        <div className="hidden md:flex space-x-6 items-center">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="hover:text-purple-200">
              {route.label}
            </Link>
          ))}
          {isLogged && (
            <button onClick={handleLogout} className="hover:text-purple-200 text-sm px-2 py-1 rounded">
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Links (Mobile - dropdown animado sobreposto) */}
      <div
        className={`
          md:hidden bg-purple-700 transition-all duration-1000 ease-in-out overflow-hidden
          absolute left-0 top-full w-full z-50
          ${isOpen ? "max-h-96 opacity-100 py-2" : "max-h-0 opacity-0 py-0"}
        `}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="flex flex-col items-center space-y-4">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className="hover:text-purple-200">
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}