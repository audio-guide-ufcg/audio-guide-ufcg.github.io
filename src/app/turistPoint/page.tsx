import Link from "next/link";
export default function LegacyPoint() {
  return (
    <main className="detail empty">
      <h1>Encontre sua próxima história</h1>
      <p>Selecione um lugar no catálogo para abrir sua página.</p>
      <Link className="primary" href="/">
        Explorar lugares
      </Link>
    </main>
  );
}
