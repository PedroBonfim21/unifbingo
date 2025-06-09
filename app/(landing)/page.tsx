import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-2">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-10 flex flex-col items-center w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-4 text-center">Unifbingo</h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 text-center max-w-md">
          O Unifbingo é a forma mais divertida de engajar sua turma! Crie, compartilhe e jogue bingos personalizados para eventos, aulas e confraternizações.
        </p>
        <Button
          variant="secondary"
          size="lg"
          className=""
        >
          <Link href="/sign-in">
            Entrar
          </Link>
        </Button>
      </div>
      <footer className="mt-12 text-xs sm:text-sm text-gray-500 text-center">
        &copy; {new Date().getFullYear()} Unifbingo. Todos os direitos reservados.
      </footer>
    </div>
  );
}