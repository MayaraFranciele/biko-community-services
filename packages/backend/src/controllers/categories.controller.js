const CATEGORIES = [
  { id: 1, nome: "Encanador", icone: "🔧" },
  { id: 2, nome: "Eletricista", icone: "⚡" },
  { id: 3, nome: "Pintor", icone: "🖌️" },
  { id: 4, nome: "Diarista", icone: "🧹" },
  { id: 5, nome: "Marceneiro", icone: "🪚" },
  { id: 6, nome: "Pedreiro", icone: "🧱" },
  { id: 7, nome: "Jardineiro", icone: "🌿" },
  { id: 8, nome: "Mecânico", icone: "🔩" },
  { id: 9, nome: "Serralheiro", icone: "⚙️" },
  { id: 10, nome: "Técnico em Informática", icone: "💻" },
  { id: 11, nome: "Costureira", icone: "🧵" },
];

const getCategories = (_req, res) => {
  return res.json({ categories: CATEGORIES });
};

module.exports = { getCategories };