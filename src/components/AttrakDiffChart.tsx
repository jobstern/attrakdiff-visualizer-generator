
import React from "react";
import { ATTRAKDIFF_QUESTIONS, AttrakDiffResult, calculateAttrakDiff } from "../lib/attrakdiff";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ScatterChart, ReferenceLine, Label } from "recharts";

type Props = {
  answers: number[];
};

export default function AttrakDiffChart({ answers }: Props) {
  const res: AttrakDiffResult = calculateAttrakDiff(answers);

  // Para o gráfico de dispersão
  const scatterData = [
    {
      PQ: res.PQ,
      HQ: (res.HQI + res.HQS) / 2,
      ATT: res.ATT,
    },
  ];

  const barData = [
    { name: "Pragmático (PQ)", valor: res.PQ },
    { name: "Hedônico Identidade (HQI)", valor: res.HQI },
    { name: "Hedônico Estímulo (HQS)", valor: res.HQS },
    { name: "Atratividade (ATT)", valor: res.ATT },
  ];

  return (
    <div className="w-full flex flex-col gap-8 items-center">
      <Card className="w-full max-w-4xl p-6 shadow-lg mb-4">
        <h3 className="font-bold text-xl mb-2">Resultados do AttrakDiff</h3>
        <div className="mb-2 text-gray-500 text-sm">Os valores estão entre 1 (negativo) e 7 (positivo).</div>
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          {/* Gráfico de barras */}
          <div className="flex-1">
            <div className="font-semibold text-center mb-1">Médias das Dimensões</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[1, 7]} />
                <Tooltip />
                <Bar dataKey="valor" fill="#4F8FF1" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Gráfico de dispersão */}
          <div className="flex-1">
            <div className="font-semibold text-center mb-1">Mapa Hedônico vs. Pragmático</div>
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="PQ" name="Pragmático" domain={[1,7]}>
                  <Label value="Pragmático" position="insideBottom" offset={-6} />
                </XAxis>
                <YAxis type="number" dataKey="HQ" name="Hedônico" domain={[1,7]}>
                  <Label value="Hedônico" angle={-90} position="insideLeft" offset={-6} />
                </YAxis>
                <ReferenceLine x={4} stroke="#aaa" strokeDasharray="3 3" />
                <ReferenceLine y={4} stroke="#aaa" strokeDasharray="3 3" />
                <Scatter data={scatterData} fill="#31c48d" name="Você" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }}/>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-6 text-sm text-gray-400">
          <b>Interpretação:</b>{" "}
          Resultados acima de 4 indicam experiência positiva. O gráfico de dispersão posiciona suas médias nos eixos <span className="font-semibold">Pragmático</span> e <span className="font-semibold">Hedônico</span>, como usado pelo AttrakDiff.
        </div>
      </Card>
    </div>
  );
}
