export default function StatCard({
  icon,
  label,
  value,
  sub,
  subColor = "text-gray-400",
}) {
  return (
    <div className="bg-white rounded-2xl border border-rose-100 p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-rose-400 opacity-5 rounded-bl-full" />
      <p className="text-lg mb-2">{icon}</p>
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="font-serif text-3xl font-semibold text-gray-800 leading-none">
        {value}
      </p>
      {sub && <p className={`text-xs mt-1.5 ${subColor}`}>{sub}</p>}
    </div>
  );
}
