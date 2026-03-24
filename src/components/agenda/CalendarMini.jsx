import { useState } from "react";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function CalendarMini({
  diaSelecionado,
  onDiaSelect,
  agendamentos,
}) {
  const [mes, setMes] = useState(new Date());

  const ano = mes.getFullYear();
  const mesAtual = mes.getMonth();
  const hoje = new Date();

  const primeiroDia = new Date(ano, mesAtual, 1).getDay();
  const diasNoMes = new Date(ano, mesAtual + 1, 0).getDate();
  const diasMesAnterior = new Date(ano, mesAtual, 0).getDate();

  const diasComAgendamento = agendamentos.map((a) => {
    const d = new Date();
    return d.getDate();
  });

  const celulas = [];

  for (let i = primeiroDia - 1; i >= 0; i--) {
    celulas.push({ dia: diasMesAnterior - i, outroMes: true });
  }
  for (let i = 1; i <= diasNoMes; i++) {
    celulas.push({ dia: i, outroMes: false });
  }
  while (celulas.length % 7 !== 0) {
    celulas.push({
      dia: celulas.length - diasNoMes - primeiroDia + 1,
      outroMes: true,
    });
  }

  function isHoje(dia) {
    return (
      dia === hoje.getDate() &&
      mesAtual === hoje.getMonth() &&
      ano === hoje.getFullYear()
    );
  }

  function isSelecionado(dia) {
    return (
      dia === diaSelecionado.getDate() &&
      mesAtual === diaSelecionado.getMonth() &&
      ano === diaSelecionado.getFullYear()
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-rose-100 p-5">
      {/* Header do mês */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-serif text-base font-semibold text-gray-800">
          {MESES[mesAtual]} {ano}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setMes(new Date(ano, mesAtual - 1, 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-rose-100 text-gray-400 hover:border-rose-300 hover:text-rose-500 text-xs transition-all"
          >
            ‹
          </button>
          <button
            onClick={() => setMes(new Date(ano, mesAtual + 1, 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-rose-100 text-gray-400 hover:border-rose-300 hover:text-rose-500 text-xs transition-all"
          >
            ›
          </button>
        </div>
      </div>

      {/* Cabeçalho dias da semana */}
      <div className="grid grid-cols-7 mb-1">
        {DIAS_SEMANA.map((d, i) => (
          <p key={i} className="text-center text-xs text-gray-300 py-1">
            {d}
          </p>
        ))}
      </div>

      {/* Dias */}
      <div className="grid grid-cols-7 gap-y-1">
        {celulas.map((c, i) => (
          <button
            key={i}
            disabled={c.outroMes}
            onClick={() =>
              !c.outroMes && onDiaSelect(new Date(ano, mesAtual, c.dia))
            }
            className={`aspect-square flex items-center justify-center text-xs rounded-full transition-all
              ${c.outroMes ? "text-gray-200 cursor-default" : "cursor-pointer"}
              ${!c.outroMes && isHoje(c.dia) && !isSelecionado(c.dia) ? "bg-rose-100 text-rose-600 font-medium" : ""}
              ${!c.outroMes && isSelecionado(c.dia) ? "bg-rose-600 text-white font-medium" : ""}
              ${!c.outroMes && !isHoje(c.dia) && !isSelecionado(c.dia) ? "text-gray-600 hover:bg-rose-50 hover:text-rose-500" : ""}
            `}
          >
            {c.dia}
          </button>
        ))}
      </div>
    </div>
  );
}
