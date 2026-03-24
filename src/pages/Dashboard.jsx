import { useState } from "react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/dashboard/StatCard";
import PieChart from "../components/dashboard/PieChart";

const CORES_SERVICO = {
  Manutenção: "#e11d5a",
  Acrílico: "#ff9db6",
  Gel: "#f43f72",
  Acrigel: "#fb7aa8",
};

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

  // Ganhos por serviço calculados dinamicamente
  const ganhosPorServico = Object.entries(
    agendamentosFiltrados.reduce((acc, a) => {
      if (!a.servico || !a.valor) return acc;
      acc[a.servico] = (acc[a.servico] || 0) + Number(a.valor);
      return acc;
    }, {}),
  ).map(([label, value]) => ({
    label,
    value,
    color: CORES_SERVICO[label] ?? "#e11d5a",
  }));

  const totalGanhos = ganhosPorServico.reduce((acc, g) => acc + g.value, 0);

  const labelPeriodo = {
    hoje: "de hoje",
    semana: "desta semana",
    mês: "deste mês",
  }[periodo];

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-[#fff1f5] via-white to-[#ffe4ec]">
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Visão geral {labelPeriodo}
          </p>
        </div>

        <div className="flex gap-2 bg-white/70 backdrop-blur-md p-1 rounded-full border border-white/60 shadow-lg">
          {["hoje", "semana", "mês"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300
                ${
                  periodo === p
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md scale-105"
                    : "text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <div className="transform hover:scale-[1.02] transition">
          <StatCard
            icon="💰"
            label="Ganhos"
            value={`R$ ${totalDia}`}
            sub={`Total ${labelPeriodo}`}
            subColor="text-emerald-500"
          />
        </div>
        <div className="transform hover:scale-[1.02] transition">
          <StatCard
            icon="📅"
            label="Agendamentos"
            value={totalAgendamentos}
            sub={`${confirmados} confirmados`}
          />
        </div>
        <div className="transform hover:scale-[1.02] transition">
          <StatCard
            icon="⏳"
            label="Pendentes"
            value={pendentes}
            sub="Aguardando confirmação"
          />
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD GRÁFICO */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-semibold text-gray-800">
              Ganhos por serviço
            </p>
            <span className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full font-medium">
              Atualizado
            </span>
          </div>

          {ganhosPorServico.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-300">
              <span className="text-6xl mb-4">📊</span>
              <p className="text-sm">Nenhum dado {labelPeriodo}</p>
            </div>
          ) : (
            <PieChart data={ganhosPorServico} total={totalGanhos} />
          )}
        </div>

        {/* CARD LISTA */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-semibold text-gray-800">
              Agendamentos {labelPeriodo}
            </p>
            <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              {totalAgendamentos} itens
            </span>
          </div>

          {agendamentosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-300">
              <span className="text-6xl mb-4">📅</span>
              <p className="text-sm">Nenhum agendamento {labelPeriodo}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {agendamentosFiltrados.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 border border-transparent hover:border-rose-100"
                >
                  <div className="w-12 text-center">
                    <span className="text-xs font-semibold text-gray-500">
                      {a.hora}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {a.nome}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.servico}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-rose-600">
                      R$ {a.valor}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block
                      ${
                        a.status === "confirmado"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
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
