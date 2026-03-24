import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // ─── Carregar dados iniciais ─────────────────────────────────
  useEffect(() => {
    async function carregarDados() {
      const [{ data: ags }, { data: prods }] = await Promise.all([
        supabase.from("agendamentos").select("*").order("hora"),
        supabase.from("produtos").select("*").order("nome"),
      ]);
      if (ags) setAgendamentos(ags);
      if (prods) setProdutos(prods);
      setCarregando(false);
    }
    carregarDados();
  }, []);

  // ─── Agendamentos ────────────────────────────────────────────
  async function adicionarAgendamento(dados) {
    const { data, error } = await supabase
      .from("agendamentos")
      .insert([{ ...dados, valor: Number(dados.valor) }])
      .select()
      .single();
    if (!error && data) setAgendamentos((prev) => [...prev, data]);
  }

  async function confirmarAgendamento(id) {
    const { error } = await supabase
      .from("agendamentos")
      .update({ status: "confirmado" })
      .eq("id", id);
    if (!error)
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "confirmado" } : a)),
      );
  }

  async function cancelarAgendamento(id) {
    const { error } = await supabase.from("agendamentos").delete().eq("id", id);
    if (!error) setAgendamentos((prev) => prev.filter((a) => a.id !== id));
  }

  // ─── Produtos ────────────────────────────────────────────────
  async function adicionarProduto(dados) {
    const { data, error } = await supabase
      .from("produtos")
      .insert([
        {
          nome: dados.nome,
          categoria: dados.categoria,
          quantidade: Number(dados.quantidade),
          minimo: Number(dados.minimo),
        },
      ])
      .select()
      .single();
    if (!error && data) setProdutos((prev) => [...prev, data]);
  }

  async function editarProduto(dados) {
    const { error } = await supabase
      .from("produtos")
      .update({
        nome: dados.nome,
        categoria: dados.categoria,
        quantidade: Number(dados.quantidade),
        minimo: Number(dados.minimo),
      })
      .eq("id", dados.id);
    if (!error)
      setProdutos((prev) =>
        prev.map((p) => (p.id === dados.id ? { ...p, ...dados } : p)),
      );
  }

  async function removerProduto(id) {
    const { error } = await supabase.from("produtos").delete().eq("id", id);
    if (!error) setProdutos((prev) => prev.filter((p) => p.id !== id));
  }

  if (carregando) {
    return (
      <div className="fixed inset-0 bg-rose-50/60 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        agendamentos,
        adicionarAgendamento,
        confirmarAgendamento,
        cancelarAgendamento,
        produtos,
        adicionarProduto,
        editarProduto,
        removerProduto,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de <AppProvider>");
  return ctx;
}
