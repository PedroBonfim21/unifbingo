import LoginForm from "./form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-purple-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-purple-800 mb-6">
          UniFBingo - Login
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
