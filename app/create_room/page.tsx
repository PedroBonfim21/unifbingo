import CreateRoomForm from "./form";

export default function CreateRoomPage() {
  return (
    <div className="min-h-screen bg-purple-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-purple-800 mb-6">
          Criar Sala de Bingo
        </h1>
        <CreateRoomForm />
      </div>
    </div>
  );
}