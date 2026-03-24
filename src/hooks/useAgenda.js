import { useApp } from "../context/AppContext";

function isMesmoDia(dataISO, date) {
  const d = new Date(dataISO + "T00:00:00");
  return (
    d.getDate() === date.getDate() &&
    d.getMonth() === date.getMonth() &&
    d.getFullYear() === date.getFullYear()
  );
}

export function useAgenda(diaSelecionado = new Date()) {
  const {
    agendamentos,
    adicionarAgendamento,
    confirmarAgendamento,
    cancelarAgendamento,
  } = useApp();

  const agendamentosDoDia = agendamentos.filter((a) =>
    a.data ? isMesmoDia(a.data, diaSelecionado) : false,
  );

  const confirmados = agendamentosDoDia.filter(
    (a) => a.status === "confirmado",
  ).length;
  const pendentes = agendamentosDoDia.filter(
    (a) => a.status === "pendente",
  ).length;
  const totalDia = agendamentosDoDia.reduce(
    (acc, a) => acc + Number(a.valor),
    0,
  );

  return {
    agendamentos,
    agendamentosDoDia,
    confirmados,
    pendentes,
    totalDia,
    adicionarAgendamento,
    confirmarAgendamento,
    cancelarAgendamento,
  };
}
