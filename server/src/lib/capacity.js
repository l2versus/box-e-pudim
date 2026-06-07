// Capacidade padrão por categoria quando a dona ainda não configurou o slot.
// Espelha o seed-prod: pudim tem capacidade menor (mais mão de obra por unidade),
// as demais categorias mais altas. Usado pelo POST /orders pra auto-criar o slot
// do dia — assim nenhum pedido é perdido por falta de slot (inclusive em datas
// além da janela do seed de 90 dias).

export const DEFAULT_CAPACITY = {
  pudim: 10,
  sweet: 14,
  box: 14,
  tray: 14,
  gift: 14,
};

export function defaultCapacityFor(category) {
  return DEFAULT_CAPACITY[category] ?? 14;
}
