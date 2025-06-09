export default function UserDetailPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">Detalhes do Usuário</h1>
      <p>Esta página mostra detalhes, permite editar (PUT/PATCH) e deletar (DELETE) um usuário específico via /api/users/&lt;uuid&gt;/.</p>
    </main>
  );
}
