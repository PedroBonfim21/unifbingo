import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-900 px-2">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-10 flex flex-col items-center w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-4 text-center">Unifbingo</h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 text-center max-w-md">
          O Unifbingo foi criado como prototipo para a cadeira de Aplic. de cloudm iot e industria 4.0 do curso de Ciência da computação da Unifbv Wyden.
          Clique abaixo para acessar a plataforma e começar a jogar bingo com seus amigos!
        </p>
        <Button
          size="lg"
          className="bg-green-700 hover:bg-green-800 text-white font-semibold"
        >
          <Link href="/register" className="w-full h-full block pt-2 ">
            Registrar
          </Link>
        </Button>
      </div>
      <footer className="mt-12 text-xs sm:text-sm text-purple-200 text-center">
        &copy; {new Date().getFullYear()} Unifbingo. Todos os direitos reservados.
      </footer>
    </div>
  );
}