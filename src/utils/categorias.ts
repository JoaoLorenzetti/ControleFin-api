// Categorias padrão com percentuais sugeridos do saldo livre
export const CATEGORIAS_PADRAO = [
  { key: 'mercado',      emoji: '🛒', nome: 'Mercado',       cor: '#c8f135', percentual: 0.30 },
  { key: 'alimentacao',  emoji: '🍔', nome: 'Comida',        cor: '#ff6b4a', percentual: 0.20 },
  { key: 'lazer',        emoji: '🎮', nome: 'Lazer',         cor: '#4f8eff', percentual: 0.15 },
  { key: 'transporte',   emoji: '🚗', nome: 'Transporte',    cor: '#a078ff', percentual: 0.10 },
  { key: 'saude',        emoji: '🏥', nome: 'Saúde',         cor: '#22c55e', percentual: 0.10 },
  { key: 'investimento', emoji: '📈', nome: 'Investimento',  cor: '#ffc400', percentual: 0.10 },
  { key: 'outros',       emoji: '📦', nome: 'Outros',        cor: '#5a6078', percentual: 0.05 },
] as const