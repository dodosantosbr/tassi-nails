export default function CategoryFilter({ categorias, ativa, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-sm border transition-all
            ${
              ativa === cat
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white text-gray-400 border-gray-200 hover:border-rose-300 hover:text-rose-500"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
