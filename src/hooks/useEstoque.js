import { useApp } from "../context/AppContext";

export function useEstoque() {
  const {
    produtos,
    adicionarProduto,
    editarProduto,
    removerProduto,
  } = useApp();

  const totalItens   = produtos.reduce((acc, p) => acc + p.quantidade, 0);
  const produtosBaixos = produtos.filter(p => p.quantidade <= p.minimo);
  const totalAlertas = produtosBaixos.length;

  return {
    produtos,
    totalItens,
    totalAlertas,
    produtosBaixos,
    adicionarProduto,
    editarProduto,
    removerProduto,
  };
}