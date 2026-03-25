const CORES = [
  "border-l-rose-400",
  "border-l-amber-400",
  "border-l-emerald-400",
];
const FUNDOS = ["bg-rose-50", "bg-amber-50", "bg-emerald-50"];

export default function TimeSlots({ horarios, agendamentos, onSlotClick }) {
  return (
    <div className="flex flex-col gap-1">
      {horarios.map((hora, i) => {
        const appt = agendamentos.find((a) => a.hora?.slice(0, 5) === hora);
        const cor = i % 3;

        return (
          <div
            key={hora}
            className="flex items-center gap-4 py-2 border-b border-rose-50 last:border-0"
          >
            <span className="text-xs text-gray-300 w-10 shrink-0">{hora}</span>

            {appt ? (
              <div
                onClick={() => onSlotClick(appt)}
                className={`flex-1 rounded-xl px-4 py-2.5 border-l-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm transition-all ${FUNDOS[cor]} ${CORES[cor]}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {appt.nome}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {appt.servico}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1.5 inline-block
                      ${appt.status === "confirmado" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-rose-600">
                    R$ {appt.valor}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 h-10 rounded-xl border-2 border-dashed border-rose-100 flex items-center px-4 cursor-pointer hover:border-rose-300 hover:bg-rose-50 transition-all group">
                <span className="text-xs text-gray-300 group-hover:text-rose-400 transition-all">
                  + disponível
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
