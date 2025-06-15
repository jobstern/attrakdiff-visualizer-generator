
import React from "react";
import {
  AttrakDiffResult,
  calculateAttrakDiff,
  ATTRAKDIFF_QUESTIONS,
} from "../lib/attrakdiff";
import { Card } from "@/components/ui/card";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ReferenceLine,
  LineChart,
  Line,
} from "recharts";

type Props = {
  answers: number[];
  questions: typeof ATTRAKDIFF_QUESTIONS;
};

function getWordPairData(answers: number[], questions: typeof ATTRAKDIFF_QUESTIONS) {
  return questions.map((q, idx) => ({
    label: q.label,
    code: q.code,
    value: answers[idx] - 4, // centralizado
    display: q.label.replace("—", "-"),
  }));
}

function getPQHQATTData(res: AttrakDiffResult) {
  return [
    { name: "PQ", value: res.PQ - 4 },
    { name: "HQ", value: ((res.HQI + res.HQS) / 2) - 4 },
    { name: "ATT", value: res.ATT - 4 },
  ];
}

function getPortfolioQuadrant(hq: number, pq: number) {
  if (pq >= 0 && pq < 1.33 && hq >= 0 && hq < 1.33) return "neutral";
  if (pq >= 1.33 && hq >= 1.33) return "desired";
  if (pq < 1.33 && hq >= 1.33) return "self-oriented";
  if (pq >= 1.33 && hq < 1.33) return "task-oriented";
  if (pq < 0 && hq < 0) return "superfluous";
  if (pq >= 1.33 && hq < 0) return "too task-oriented";
  if (pq < 0 && hq >= 1.33) return "too self-oriented";
  return "neutral";
}

export default function AttrakDiffChart({ answers, questions }: Props) {
  const res: AttrakDiffResult = calculateAttrakDiff(answers, questions);
  const wordPairData = getWordPairData(answers, questions);
  const pqhqattData = getPQHQATTData(res);

  const PQ = res.PQ - 4;
  const HQ = ((res.HQI + res.HQS) / 2) - 4;
  const quadrant = getPortfolioQuadrant(HQ, PQ);

  // Cores
  const PQ_COLOR = "#63A8CC";
  const HQ_COLOR = "#B8D44E";
  const ATT_COLOR = "#FFE58A";

  return (
    <div className="w-full flex flex-col gap-8 items-center">
      <Card className="w-full max-w-3xl p-6 shadow-lg">
        <h3 className="font-bold text-xl mb-2">Descrição dos Pares de Palavras</h3>
        <div className="mb-2 text-gray-500 text-sm">
          Pontuação média centralizada (negativo = avaliação ruim, positivo = avaliação boa)
        </div>
        <ResponsiveContainer width="100%" height={Math.max(240, 32 * questions.length)}>
          <LineChart
            data={wordPairData}
            layout="vertical"
            margin={{ top: 10, left: 60, right: 60, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[-3, 3]}
              tickCount={7}
              tickFormatter={(v) => String(v)}
            />
            <YAxis
              type="category"
              dataKey="display"
              width={160}
              tick={{ fontSize: 13 }}
            />
            <Tooltip formatter={(v: number) => (v + 4).toFixed(2)} />
            <ReferenceLine x={0} stroke="#555" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2F66B1"
              fill="#2F66B1"
              activeDot={{ r: 5 }}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="w-full max-w-2xl p-6 shadow-lg">
        <h3 className="font-bold text-xl mb-2">Diagrama das Médias</h3>
        <div className="flex w-full justify-center gap-4 mb-2">
          <div className="flex-1 flex flex-col items-center">
            <div className="rounded font-bold text-white p-1 px-2 text-sm" style={{ background: PQ_COLOR }}>PQ</div>
            <div className="text-xs text-gray-500 mt-1">Pragmático</div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="rounded font-bold text-white p-1 px-2 text-sm" style={{ background: HQ_COLOR }}>HQ</div>
            <div className="text-xs text-gray-500 mt-1">Hedônico</div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="rounded font-bold text-gray-800 p-1 px-2 text-sm" style={{ background: ATT_COLOR }}>ATT</div>
            <div className="text-xs text-gray-500 mt-1">Atratividade</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={pqhqattData} margin={{ top: 16, right: 26, left: 26, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y + 20}
                  textAnchor="middle"
                  fontWeight={700}
                  fontSize={14}
                  fill={
                    payload.value === "PQ"
                      ? PQ_COLOR
                      : payload.value === "HQ"
                        ? HQ_COLOR
                        : ATT_COLOR
                  }
                >
                  {payload.value}
                </text>
              )}
            />
            <YAxis domain={[-3, 3]} tickCount={7} />
            <Tooltip formatter={(v: number) => (v + 4).toFixed(2)} />
            <Line type="monotone" dataKey="value" stroke="#2F66B1" dot={{ r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs px-1 text-gray-500">
          <b>PQ</b>: {res.PQ.toFixed(2)}&nbsp;
          <b>HQ</b>: {((res.HQI + res.HQS) / 2).toFixed(2)}&nbsp;
          <b>ATT</b>: {res.ATT.toFixed(2)}
        </div>
      </Card>

      {/* Gráfico de Portfolio */}
      <Card className="w-full max-w-lg p-6 shadow-lg">
        <h3 className="font-bold text-xl mb-2">Matriz de Portfólio</h3>
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            {/* Quadrantes */}
            {[0, 1, 2].map(row =>
              [0, 1, 2].map(col => {
                const x1 = -3 + col * 3;
                const x2 = x1 + 3;
                const y1 = -3 + row * 3;
                const y2 = y1 + 3;
                let cellLabel = "";
                if (row === 0 && col === 0) cellLabel = "too self-oriented";
                else if (row === 0 && col === 1) cellLabel = "self-oriented";
                else if (row === 0 && col === 2) cellLabel = "desired";
                else if (row === 1 && col === 0) cellLabel = "neutral";
                else if (row === 1 && col === 1) cellLabel = "task-oriented";
                else if (row === 2 && col === 0) cellLabel = "superfluous";
                else if (row === 2 && col === 1) cellLabel = "too task-oriented";
                else if (row === 2 && col === 2) cellLabel = "too task-oriented";
                return (
                  <g key={`cell-${row}-${col}`}>
                    <rect
                      x={x1}
                      y={y1}
                      width={x2 - x1}
                      height={y2 - y1}
                      fill="#e5e7eb"
                      fillOpacity={0.68}
                      stroke="#bbb"
                      strokeWidth={1}
                    />
                    <text
                      x={x1 + (x2 - x1) / 2}
                      y={y1 + (y2 - y1) / 2}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontWeight="bold"
                      fontSize={col === 1 && row === 1 ? 18 : 13}
                      opacity={0.82}
                      fill="#333"
                    >
                      {cellLabel}
                    </text>
                  </g>
                );
              })
            )}
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="PQ"
              name="Pragmático"
              domain={[-3, 3]}
              tickCount={7}
              label={{
                value: "pragmatic quality (PQ)",
                position: "insideBottom",
                offset: -4,
                fontSize: 13,
                fontWeight: "bold",
                fill: "#555",
              }}
            />
            <YAxis
              type="number"
              dataKey="HQ"
              name="Hedônico"
              domain={[-3, 3]}
              tickCount={7}
              label={{
                value: "hedonic quality (HQ)",
                angle: -90,
                position: "insideLeft",
                offset: -2,
                fontSize: 13,
                fontWeight: "bold",
                fill: "#555",
              }}
            />
            <Scatter
              data={[{ PQ, HQ }]}
              fill="#2F66B1"
              name="Você"
              shape="square"
            />
            <Tooltip />
            <ReferenceLine x={0} stroke="#888" strokeDasharray="3 3" />
            <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-3 px-2 py-1 border rounded bg-white/70 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-[#2F66B1] rounded-sm mr-1" />
            <b>Seu resultado</b>
          </div>
          PQ: <b>{res.PQ.toFixed(2)}</b>&nbsp;| HQ: <b>{((res.HQI + res.HQS) / 2).toFixed(2)}</b>&nbsp;
          <span className="ml-3">Quadrante: <b>{quadrant}</b></span>
        </div>
      </Card>
    </div>
  );
}
