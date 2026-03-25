import { useState } from "react";
import { useAgenda } from "../hooks/useAgenda";
import CalendarMini from "../components/agenda/CalendarMini";
import TimeSlots from "../components/agenda/TimeSlots";
import Modal from "../components/ui/Modal";

const HORARIOS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

const SERVICOS = ["Manutenção", "Acrílico", "Gel", "Acrigel"];

function gerarLinkWhatsApp({ telefone, nome, servico, hora, data }) {
  const numero = telefone.replace(/\D/g, "");
  const dataFormatada = new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  const mensagem =
    `Olá ${nome}! 💅 Lembrando do seu agendamento:\n\n` +
    `📅 ${dataFormatada}\n` +
    `⏰ ${hora}\n` +
    `✨ Serviço: ${servico}\n\n` +
    `Qualquer dúvida, é só chamar! 😊`;
  return `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
}

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

  function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 11)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    return valor;
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
        {/* Calendário */}
        <div className="md:block">
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
                setForm((p) => ({
                  ...p,
                  telefone: formatarTelefone(e.target.value),
                }))
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

            {/* 👇 Botão WhatsApp — só aparece se tiver telefone */}
            {modalDetalhe.telefone && (
              <a
                href={gerarLinkWhatsApp(modalDetalhe)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.531 5.845L.057 23.882l6.198-1.448A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.868 9.868 0 01-5.042-1.383l-.361-.214-3.681.861.927-3.584-.235-.368A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.468 0 9.882 4.415 9.882 9.882 0 5.468-4.414 9.882-9.882 9.882z" />
                </svg>
                Enviar lembrete via WhatsApp
              </a>
            )}

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