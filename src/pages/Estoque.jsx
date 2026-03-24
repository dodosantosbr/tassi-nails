import { useState } from "react";
import { useEstoque } from "../hooks/useEstoque";
import ProductCard from "../components/estoque/ProductCard";
import StockAlert from "../components/estoque/StockAlert";
import CategoryFilter from "../components/estoque/CategoryFilter";
import Modal from "../components/ui/Modal";

const CATEGORIAS = [
  "Todos",
  "Esmaltes",
  "Acetona",
  "Gel/Acrigel",
  "Ferramentas",
  "Acrílicos",
  "Outros",
];

const formInicial = {
  nome: "",
  categoria: "Esmaltes",
  quantidade: "",
  minimo: "",
};

export default function Estoque() {
  const {
    produtos,
    totalItens,
    totalAlertas,
    produtosBaixos,
    adicionarProduto,
    editarProduto,
    removerProduto,
  } = useEstoque();

  const [categoria, setCategoria] = useState("Todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [form, setForm] = useState(formInicial);

  const produtosFiltrados =
    categoria === "Todos"
      ? produtos
      : produtos.filter((p) => p.categoria === categoria);

  function handleAdicionar() {
    if (!form.nome || !form.quantidade) return;
    adicionarProduto({
      ...form,
      id: Date.now(),
      quantidade: Number(form.quantidade),
      minimo: Number(form.minimo),
    });
    setForm(formInicial);
    setModalAberto(false);
  }

  function handleSalvarEdicao() {
    editarProduto({
      ...modalEditar,
      quantidade: Number(modalEditar.quantidade),
      minimo: Number(modalEditar.minimo),
    });
    setModalEditar(null);
  }

  function handleRemover(id) {
    removerProduto(id);
    setModalEditar(null);
  }

  return (
    <div className="p-4 md:p-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-rose-100 p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Total de itens
          </p>
          <p className="font-serif text-2xl md:text-3xl font-semibold text-gray-800">
            {totalItens}
          </p>
          <p className="text-xs text-gray-400 mt-1.5">
            {produtos.length} produtos cadastrados
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-rose-100 p-4 md:p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Alertas
          </p>
          <p
            className={`font-serif text-2xl md:text-3xl font-semibold ${totalAlertas > 0 ? "text-red-500" : "text-emerald-500"}`}
          >
            {totalAlertas}
          </p>
          <p className="text-xs text-gray-400 mt-1.5">
            Produtos abaixo do mínimo
          </p>
        </div>
      </div>

      {produtosBaixos.length > 0 && <StockAlert produtos={produtosBaixos} />}

      {/* Filtros + botão */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="overflow-x-auto flex-1">
          <CategoryFilter
            categorias={CATEGORIAS}
            ativa={categoria}
            onChange={setCategoria}
          />
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="shrink-0 px-3 md:px-4 py-2 bg-rose-600 text-white text-xs md:text-sm font-medium rounded-xl hover:bg-rose-700 transition-all"
        >
          + Novo
        </button>
      </div>

      {/* Grid produtos — 1 col mobile, 2 tablet, 3 desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {produtosFiltrados.map((produto) => (
          <ProductCard
            key={produto.id}
            produto={produto}
            onClick={() => setModalEditar({ ...produto })}
          />
        ))}
      </div>

      {/* Modal novo produto */}
      <Modal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        titulo="Novo Produto"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
              Nome do produto
            </label>
            <input
              type="text"
              placeholder="Ex: Esmalte Rosa Nude"
              value={form.nome}
              onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
              className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
              Categoria
            </label>
            <select
              value={form.categoria}
              onChange={(e) =>
                setForm((p) => ({ ...p, categoria: e.target.value }))
              }
              className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all bg-white"
            >
              {CATEGORIAS.filter((c) => c !== "Todos").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
                Quantidade
              </label>
              <input
                type="number"
                placeholder="0"
                value={form.quantidade}
                onChange={(e) =>
                  setForm((p) => ({ ...p, quantidade: e.target.value }))
                }
                className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
                Mínimo
              </label>
              <input
                type="number"
                placeholder="0"
                value={form.minimo}
                onChange={(e) =>
                  setForm((p) => ({ ...p, minimo: e.target.value }))
                }
                className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all"
              />
            </div>
          </div>
          <button
            onClick={handleAdicionar}
            className="w-full bg-rose-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-rose-700 transition-all mt-1"
          >
            Adicionar produto
          </button>
        </div>
      </Modal>

      {/* Modal editar produto */}
      {modalEditar && (
        <Modal
          aberto={!!modalEditar}
          onFechar={() => setModalEditar(null)}
          titulo="Editar Produto"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
                Nome do produto
              </label>
              <input
                type="text"
                value={modalEditar.nome}
                onChange={(e) =>
                  setModalEditar((p) => ({ ...p, nome: e.target.value }))
                }
                className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
                Categoria
              </label>
              <select
                value={modalEditar.categoria}
                onChange={(e) =>
                  setModalEditar((p) => ({ ...p, categoria: e.target.value }))
                }
                className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all bg-white"
              >
                {CATEGORIAS.filter((c) => c !== "Todos").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
                  Quantidade
                </label>
                <input
                  type="number"
                  value={modalEditar.quantidade}
                  onChange={(e) =>
                    setModalEditar((p) => ({
                      ...p,
                      quantidade: e.target.value,
                    }))
                  }
                  className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">
                  Mínimo
                </label>
                <input
                  type="number"
                  value={modalEditar.minimo}
                  onChange={(e) =>
                    setModalEditar((p) => ({ ...p, minimo: e.target.value }))
                  }
                  className="w-full border border-rose-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-1">
              <button
                onClick={handleSalvarEdicao}
                className="flex-1 bg-rose-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-rose-700 transition-all"
              >
                Salvar alterações
              </button>
              <button
                onClick={() => handleRemover(modalEditar.id)}
                className="flex-1 bg-red-50 text-red-500 border border-red-100 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-all"
              >
                Remover
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
