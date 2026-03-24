import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const TITLES = {
  "/": { title: "Dashboard", sub: "Visão geral do seu negócio" },
  "/agenda": { title: "Agenda", sub: "Gerencie seus agendamentos" },
  "/estoque": { title: "Estoque", sub: "Controle seus produtos" },
};

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const page = TITLES[pathname] ?? { title: "NailStudio", sub: "" };
  const { agendamentos, produtos } = useApp();
  const [aberto, setAberto] = useState(false);
  const [dispensadas, setDispensadas] = useState([]);

  const pendentes = agendamentos.filter((a) => a.status === "pendente");
  const estoqueBaixo = produtos.filter((p) => p.quantidade <= p.minimo);

  const todasNotificacoes = [
    ...pendentes.map((a) => ({
      id: `ag-${a.id}`,
      icon: "◷",
      texto: `${a.nome} aguarda confirmação`,
      sub: `${a.servico} às ${a.hora}`,
      cor: "text-amber-500",
      bg: "bg-amber-50",
    })),
    ...estoqueBaixo.map((p) => ({
      id: `pr-${p.id}`,
      icon: "◫",
      texto: `${p.nome} com estoque baixo`,
      sub: `${p.quantidade} unidades restantes`,
      cor: "text-rose-500",
      bg: "bg-rose-50",
    })),
  ];

  const notificacoes = todasNotificacoes.filter(
    (n) => !dispensadas.includes(n.id),
  );

  function dispensarUma(id) {
    setDispensadas((prev) => [...prev, id]);
  }

  function dispensarTodas() {
    setDispensadas(todasNotificacoes.map((n) => n.id));
    setAberto(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-rose-100 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Botão hamburguer mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-rose-100 text-gray-400 hover:border-rose-300 hover:text-rose-500 transition-all"
        >
          ☰
        </button>
        <div>
          <h2 className="font-serif text-xl md:text-2xl font-semibold text-gray-800">
            {page.title}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 hidden md:block">
            {page.sub}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notificações */}
        <div className="relative">
          <button
            onClick={() => setAberto((v) => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-rose-100 hover:border-rose-300 hover:bg-rose-50 transition-all text-gray-400 hover:text-rose-500"
          >
            🔔
            {notificacoes.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>

          {aberto && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setAberto(false)}
              />
              <div className="absolute right-0 top-11 z-50 w-[calc(100vw-2rem)] md:w-80 bg-white border border-rose-100 rounded-2xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-rose-50 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    Notificações
                  </p>
                  <div className="flex items-center gap-2">
                    {notificacoes.length > 0 && (
                      <>
                        <span className="text-xs text-white bg-rose-500 rounded-full px-2 py-0.5">
                          {notificacoes.length}
                        </span>
                        <button
                          onClick={dispensarTodas}
                          className="text-xs text-gray-400 hover:text-rose-500 transition-all"
                        >
                          Limpar tudo
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {notificacoes.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">
                    Nenhuma notificação
                  </div>
                ) : (
                  <ul className="max-h-72 overflow-y-auto divide-y divide-rose-50">
                    {notificacoes.map((n) => (
                      <li
                        key={n.id}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-rose-50/50 transition-all group"
                      >
                        <div
                          className={`w-8 h-8 rounded-xl ${n.bg} flex items-center justify-center text-sm flex-shrink-0 mt-0.5`}
                        >
                          <span className={n.cor}>{n.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700">
                            {n.texto}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {n.sub}
                          </p>
                        </div>
                        <button
                          onClick={() => dispensarUma(n.id)}
                          className="text-gray-200 hover:text-gray-400 transition-all opacity-0 group-hover:opacity-100 text-sm mt-0.5"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {/* Data — só desktop */}
        <div className="text-right hidden md:block">
          <p className="text-xs font-medium text-gray-700">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long" })}
          </p>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </header>
  );
}
