import { useState } from "react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/dashboard/StatCard";
import PieChart from "../components/dashboard/PieChart";

const mockGanhos = [
  { label: "Manutenção", value: 120, color: "#e11d5a" },
  { label: "Acrílico", value: 200, color: "#ff9db6" },
  { label: "Gel/Acrigel", value: 120, color: "#f43f72" },
];

function isMesmoDia(dataISO, date) {
  const d = new Date(dataISO + "T00:00:00");
  return (
    d.getDate() === date.getDate() &&
    d.getMonth() === date.getMonth() &&
    d.getFullYear() === date.getFullYear()
  );
}

function isMesmaSemana(dataISO) {
  const hoje = new Date();
  const d = new Date(dataISO + "T00:00:00");
  const diaSemana = hoje.getDay();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - diaSemana);
  inicioSemana.setHours(0, 0, 0, 0);
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);
  fimSemana.setHours(23, 59, 59, 999);
  return d >= inicioSemana && d <= fimSemana;
}

function isMesmoMes(dataISO) {
  const hoje = new Date();
  const d = new Date(dataISO + "T00:00:00");
  return (
    d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear()
  );
}

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("hoje");
  const { agendamentos } = useApp();
  const hoje = new Date();

  const agendamentosFiltrados = agendamentos.filter((a) => {
    if (!a.data) return false;
    if (periodo === "hoje") return isMesmoDia(a.data, hoje);
    if (periodo === "semana") return isMesmaSemana(a.data);
    if (periodo === "mês") return isMesmoMes(a.data);
    return false;
  });

  const confirmados = agendamentosFiltrados.filter(
    (a) => a.status === "confirmado",
  ).length;
  const pendentes = agendamentosFiltrados.filter(
    (a) => a.status === "pendente",
  ).length;
  const totalDia = agendamentosFiltrados.reduce(
    (acc, a) => acc + Number(a.valor),
    0,
  );
  const totalAgendamentos = agendamentosFiltrados.length;

  const totalGanhos = mockGanhos.reduce((acc, g) => acc + g.value, 0);

  const labelPeriodo = {
    hoje: "de hoje",
    semana: "desta semana",
    mês: "deste mês",
  }[periodo];

  return (
    <div className="p-4 md:p-8">
      {/* Filtro de período */}
      <div className="flex gap-2 mb-6">
        {["hoje", "semana", "mês"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all
              ${
                periodo === p
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-white text-gray-400 border-gray-200 hover:border-rose-300 hover:text-rose-500"
              }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard
          icon="💰"
          label="Ganhos"
          value={`R$ ${totalDia}`}
          sub={`Total ${labelPeriodo}`}
          subColor="text-emerald-500"
        />
        <StatCard
          icon="📅"
          label="Agendamentos"
          value={totalAgendamentos}
          sub={`${confirmados} confirmados`}
        />
        <StatCard
          icon="⏳"
          label="Pendentes"
          value={pendentes}
          sub="Aguardando confirmação"
        />
        <StatCard
          icon="⭐"
          label="Avaliação média"
          value="4.9"
          sub="Baseado em 38 avaliações"
        />
      </div>

      {/* Gráfico + Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-rose-100 p-6">
          <p className="font-serif text-lg font-semibold text-gray-800 mb-4">
            Ganhos por serviço
          </p>
          <PieChart data={mockGanhos} total={totalGanhos} />
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-6">
          <p className="font-serif text-lg font-semibold text-gray-800 mb-4">
            Agendamentos {labelPeriodo}
          </p>
          {agendamentosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300">
              <span className="text-4xl mb-2">📅</span>
              <p className="text-sm">Nenhum agendamento {labelPeriodo}</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {agendamentosFiltrados.map((a, i) => (
                <div
                  key={a.id}
                  className={`flex items-center gap-4 py-3 ${i < agendamentosFiltrados.length - 1 ? "border-b border-rose-50" : ""}`}
                >
                  <span className="text-xs text-gray-400 w-10 shrink-0">
                    {a.hora}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {a.nome}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.servico}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-rose-600">
                      R$ {a.valor}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block
                      ${a.status === "confirmado" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                    >
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
