import RegisterForm from "./form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-purple-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-purple-800 mb-6">
          Criar Conta
        </h1>
        <RegisterForm />
        <p className="pt-6 text-sm text-center text-gray-600">
          Já tem uma conta?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Faça login
          </a>
      </p>
      </div>
    </div>
  );
};
