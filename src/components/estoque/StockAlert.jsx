export default function StockAlert({ produtos }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🚨</span>
        <p className="text-sm font-medium text-red-700">
          {produtos.length}{" "}
          {produtos.length === 1 ? "produto precisa" : "produtos precisam"} de
          reposição
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {produtos.map((p) => (
          <span
            key={p.id}
            className="text-xs bg-white border border-red-100 text-red-600 px-3 py-1 rounded-full font-medium"
          >
            {p.nome} — {p.quantidade} un.
          </span>
        ))}
      </div>
    </div>
  );
}
