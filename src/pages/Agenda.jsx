import { useState } from "react";
import { useAgenda } from "../hooks/useAgenda";
import CalendarMini from "../components/agenda/CalendarMini";
import TimeSlots from "../components/agenda/TimeSlots";
import Modal from "../components/ui/Modal";

const HORARIOS = [
  "08:00",
  "09:00",
  "10:00",
  "10:30",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "16:30",
  "17:00",
  "18:00",
];

const SERVICOS = ["Manutenção", "Acrílico", "Gel", "Acrigel"];

export default function Agenda() {
  const [diaSelecionado, setDiaSelecionado] = useState(new Date());
  const [calAberto, setCalAberto] = useState(false);

  const {
    agendamentos,
    agendamentosDoDia,
    confirmados,
    pendentes,
    totalDia,
    adicionarAgendamento,
    confirmarAgendamento,
    cancelarAgendamento,
  } = useAgenda(diaSelecionado);

  const [modalAberto, setModalAberto] = useState(false);
  const [modalDetalhe, setModalDetalhe] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    servico: "",
    hora: "",
    valor: "",
    status: "pendente",
    data: new Date().toISOString().split("T")[0],
  });

  function handleNovoAgendamento() {
    if (!form.nome || !form.hora || !form.servico) return;
    adicionarAgendamento(form);
    setForm({
      nome: "",
      telefone: "",
      servico: "",
      hora: "",
      valor: "",
      status: "pendente",
      data: diaSelecionado.toISOString().split("T")[0],
    });
    setModalAberto(false);
  }

  function handleConfirmar(id) {
    confirmarAgendamento(id);
    setModalDetalhe(null);
  }

  function handleCancelar(id) {
    cancelarAgendamento(id);
    setModalDetalhe(null);
  }

  function handleDiaSelect(dia) {
    setDiaSelecionado(dia);
    setCalAberto(false);
  }

  return (
    <div className="p-4 md:p-8">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-rose-100 p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Total do dia
          </p>
          <p className="font-serif text-2xl md:text-3xl font-semibold text-gray-800">
            R$ {totalDia}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-rose-100 p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Confirmados
          </p>
          <p className="font-serif text-2xl md:text-3xl font-semibold text-emerald-600">
            {confirmados}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-rose-100 p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Pendentes
          </p>
          <p className="font-serif text-2xl md:text-3xl font-semibold text-amber-500">
            {pendentes}
          </p>
        </div>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
        {/* Calendário — desktop sempre visível, mobile collapsible */}
        <div className="md:block">
          {/* Botão toggle só no mobile */}
          <button
            onClick={() => setCalAberto((v) => !v)}
            className="md:hidden w-full flex items-center justify-between bg-white border border-rose-100 rounded-2xl px-4 py-3 mb-2 text-sm font-medium text-gray-700"
          >
            <span>
              📅{" "}
              {diaSelecionado.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
              })}
            </span>
            <span className="text-gray-400 text-xs">
              {calAberto ? "▲ Fechar" : "▼ Ver calendário"}
            </span>
          </button>

          <div className={`${calAberto ? "block" : "hidden"} md:block`}>
            <CalendarMini
              diaSelecionado={diaSelecionado}
              onDiaSelect={handleDiaSelect}
              agendamentos={agendamentos}
            />
          </div>
        </div>

        {/* TimeSlots */}
        <div className="bg-white rounded-2xl border border-rose-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="font-serif text-base md:text-lg font-semibold text-gray-800">
              {diaSelecionado.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </p>
            <button
              onClick={() => {
                setForm({
                  nome: "",
                  telefone: "",
                  servico: "",
                  hora: "",
                  valor: "",
                  status: "pendente",
                  data: diaSelecionado.toISOString().split("T")[0],
                });
                setModalAberto(true);
              }}
              className="px-3 md:px-4 py-2 bg-rose-600 text-white text-xs md:text-sm font-medium rounded-xl hover:bg-rose-700 transition-all"
            >
              + Novo
            </button>
          </div>

          <TimeSlots
            horarios={HORARIOS}
            agendamentos={agendamentosDoDia}
            onSlotClick={(appt) => appt && setModalDetalhe(appt)}
          />
        </div>
      </div>

      {/* Modal novo agendamento */}
      <Modal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        titulo="Novo Agendamento"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
              Nome da cliente
            </label>
            <input
              type="text"
              placeholder="Ex: Maria Silva"
              value={form.nome}
              onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
              className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
              Telefone
            </label>
            <input
              type="text"
              placeholder="(00) 00000-0000"
              value={form.telefone}
              onChange={(e) =>
                setForm((p) => ({ ...p, telefone: e.target.value }))
              }
              className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
                Serviço
              </label>
              <select
                value={form.servico}
                onChange={(e) =>
                  setForm((p) => ({ ...p, servico: e.target.value }))
                }
                className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all bg-white"
              >
                <option value="">Selecionar...</option>
                {SERVICOS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
                Horário
              </label>
              <select
                value={form.hora}
                onChange={(e) =>
                  setForm((p) => ({ ...p, hora: e.target.value }))
                }
                className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all bg-white"
              >
                <option value="">Selecionar...</option>
                {HORARIOS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
              Valor (R$)
            </label>
            <input
              type="number"
              placeholder="0,00"
              value={form.valor}
              onChange={(e) =>
                setForm((p) => ({ ...p, valor: e.target.value }))
              }
              className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all"
            />
          </div>
          <button
            onClick={handleNovoAgendamento}
            className="w-full bg-rose-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-rose-700 transition-all mt-1"
          >
            Confirmar agendamento
          </button>
        </div>
      </Modal>

      {/* Modal detalhe */}
      {modalDetalhe && (
        <Modal
          aberto={!!modalDetalhe}
          onFechar={() => setModalDetalhe(null)}
          titulo="Detalhes do Agendamento"
        >
          <div className="flex flex-col gap-4">
            <div className="bg-rose-50 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-base">
                {modalDetalhe.nome}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">
                {modalDetalhe.telefone}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Serviço", value: modalDetalhe.servico },
                { label: "Horário", value: modalDetalhe.hora },
                { label: "Valor", value: `R$ ${modalDetalhe.valor}` },
                { label: "Status", value: modalDetalhe.status },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-gray-800 capitalize">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
              <span className="text-base">🔔</span>
              <p className="text-xs text-rose-700">
                Lembrete será enviado 1h antes do horário.
              </p>
            </div>
            <div className="flex gap-3 mt-1">
              {modalDetalhe.status === "pendente" && (
                <button
                  onClick={() => handleConfirmar(modalDetalhe.id)}
                  className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all"
                >
                  Confirmar
                </button>
              )}
              <button
                onClick={() => handleCancelar(modalDetalhe.id)}
                className="flex-1 bg-red-50 text-red-500 border border-red-100 py-2.5 rounded-xl text-sm font-medium hover:bg-red-100 transition-all"
              >
                Cancelar agendamento
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
