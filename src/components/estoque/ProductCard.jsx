export default function ProductCard({ produto, onClick }) {
  const { nome, categoria, quantidade, minimo } = produto;

  const pct = Math.min((quantidade / (minimo * 2)) * 100, 100);
  const isLow = quantidade <= minimo;
  const isWarn = quantidade <= minimo * 1.5 && !isLow;

  const barColor = isLow
    ? "bg-red-400"
    : isWarn
      ? "bg-amber-400"
      : "bg-emerald-400";
  const tagStyle = isLow
    ? "bg-red-50 text-red-600"
    : isWarn
      ? "bg-amber-50 text-amber-600"
      : "bg-emerald-50 text-emerald-700";
  const tagLabel = isLow ? "Estoque baixo" : isWarn ? "Atenção" : "OK";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-rose-100 p-5 cursor-pointer hover:border-rose-200 hover:-translate-y-0.5 hover:shadow-md transition-all"
    >
      <p className="text-xs text-gray-300 uppercase tracking-widest mb-1">
        {categoria}
      </p>
      <p className="text-sm font-medium text-gray-800 mb-4">{nome}</p>

      <div className="h-1 bg-rose-50 rounded-full mb-2">
        <div
          className={`h-1 rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {quantidade} un.
          </p>
          <p className="text-xs text-gray-300 mt-0.5">mín. {minimo}</p>
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${tagStyle}`}
        >
          {tagLabel}
        </span>
      </div>
    </div>
  );
}
