
export type AttrakDiffScale = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface AttrakDiffAnswer {
  id: number;
  value: AttrakDiffScale | null;
}

export interface AttrakDiffResult {
  PQ: number;
  HQI: number;
  HQS: number;
  ATT: number;
}

export const ATTRAKDIFF_QUESTIONS = [
  { id: 1, label: "Prático — Impraticável", code: "PQ" },
  { id: 2, label: "Obstrutivo — Apoia completamente", code: "PQ" },
  { id: 3, label: "Complicado — Simples", code: "PQ" },
  { id: 4, label: "Não eficiente — Eficiente", code: "PQ" },
  { id: 5, label: "Pouco claro — Claro", code: "PQ" },
  { id: 6, label: "Desagradável — Agradável", code: "ATT" },
  { id: 7, label: "Chato — Interessante", code: "ATT" },
  { id: 8, label: "Conformista — Original", code: "HQI" },
  { id: 9, label: "Usual — Inovador", code: "HQI" },
  { id:10, label: "Dirigido para mim — Me distancia", code: "HQS" },
  { id:11, label: "Isolador — Conectivo", code: "HQS" },
  { id:12, label: "Resistente — Flexível", code: "HQS" },
  { id:13, label: "Padrão — Notável", code: "HQI" },
  { id:14, label: "Opressivo — Libertador", code: "HQS" },
  { id:15, label: "Conservador — Progressivo", code: "HQI" },
  { id:16, label: "Pouco criativo — Criativo", code: "HQI" },
  { id:17, label: "Desagradável — Agradável", code: "ATT" },
  { id:18, label: "Chato — Interessante", code: "ATT" },
  { id:19, label: "Mal elaborado — Bem elaborado", code: "PQ" },
  { id:20, label: "Pouco competitivo — Competitivo", code: "PQ" },
  { id:21, label: "Pouco inovador — Inovador", code: "HQI" },
  { id:22, label: "Desatualizado — Atualizado", code: "HQI" },
  { id:23, label: "Pouco entusiástico — Entusiástico", code: "ATT" },
  { id:24, label: "Pessimista — Otimista", code: "ATT" },
  { id:25, label: "Pouco interessante — Interessante", code: "ATT" },
  { id:26, label: "Pouco envolvente — Envolvente", code: "HQS" },
  { id:27, label: "Limitado — Ilimitado", code: "HQS" },
  { id:28, label: "Pouco confiável — Confiável", code: "PQ" },
];

// Novo array: questionário resumido (10 pares representativos do AttrakDiff)
export const ATTRAKDIFF_QUESTIONS_SHORT = [
  { id: 1, label: "Prático — Impraticável", code: "PQ" },
  { id: 2, label: "Complicado — Simples", code: "PQ" },
  { id: 3, label: "Desagradável — Agradável", code: "ATT" },
  { id: 4, label: "Chato — Interessante", code: "ATT" },
  { id: 8, label: "Conformista — Original", code: "HQI" },
  { id:10, label: "Dirigido para mim — Me distancia", code: "HQS" },
  { id:12, label: "Resistente — Flexível", code: "HQS" },
  { id:15, label: "Conservador — Progressivo", code: "HQI" },
  { id:24, label: "Pessimista — Otimista", code: "ATT" },
  { id:28, label: "Pouco confiável — Confiável", code: "PQ" },
];

// Função utilitária para calcular resultados independentemente do array de perguntas usado.
export function calculateAttrakDiff(scores: number[], questions = ATTRAKDIFF_QUESTIONS): AttrakDiffResult {
  const grouped: { [code: string]: number[] } = { PQ: [], HQI: [], HQS: [], ATT: [] };
  questions.forEach((q, idx) => {
    grouped[q.code].push(scores[idx]);
  });

  return {
    PQ: mean(grouped.PQ),
    HQI: mean(grouped.HQI),
    HQS: mean(grouped.HQS),
    ATT: mean(grouped.ATT),
  };
}

function mean(arr: number[]) {
  if (!arr.length) return 0;
  return Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));
}
