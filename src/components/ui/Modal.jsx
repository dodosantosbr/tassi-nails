export default function Modal({ aberto, onFechar, titulo, children }) {
  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end md:items-center justify-center md:p-4"
      onClick={onFechar}
    >
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl border border-rose-100 w-full md:max-w-md shadow-xl flex flex-col max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar mobile */}
        <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-rose-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-4 border-b border-rose-50 shrink-0">
          <p className="font-serif text-xl font-semibold text-gray-800">
            {titulo}
          </p>
          <button
            onClick={onFechar}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-all text-lg"
          >
            ×
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
