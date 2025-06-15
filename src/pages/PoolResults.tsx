
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { ATTRAKDIFF_QUESTIONS } from "@/lib/attrakdiff";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ArrowLeft } from "lucide-react";

type Pool = {
  name: string;
  description: string;
};

const fetchPoolResults = async (poolId: string) => {
  const { data: poolData, error: poolError } = await supabase
    .from("pools")
    .select("name, description")
    .eq("id", poolId)
    .single();

  if (poolError) throw new Error(poolError.message);

  const { data: responsesData, error: responsesError } = await supabase
    .from("pool_responses")
    .select("answers")
    .eq("pool_id", poolId);

  if (responsesError) throw new Error(responsesError.message);
  
  // @ts-ignore
  const allAnswers = responsesData.map(r => r.answers.values);

  if (allAnswers.length === 0) {
    return { pool: poolData, results: [], totalResponses: 0 };
  }

  const numQuestions = ATTRAKDIFF_QUESTIONS.length;
  const aggregatedResults = [];

  for (let i = 0; i < numQuestions; i++) {
    const sum = allAnswers.reduce((acc, current) => acc + (current[i] || 0), 0);
    const average = sum / allAnswers.length;
    aggregatedResults.push({
      name: ATTRAKDIFF_QUESTIONS[i].label,
      average: parseFloat(average.toFixed(2)),
    });
  }

  return { pool: poolData, results: aggregatedResults, totalResponses: allAnswers.length };
};

export default function PoolResults() {
  const { poolId } = useParams<{ poolId: string }>();
  const { session, loading: loadingSession } = useSession();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["poolResults", poolId],
    queryFn: () => fetchPoolResults(poolId!),
    enabled: !!poolId && !loadingSession && !!session,
  });

  useEffect(() => {
    if (!loadingSession && !session) {
      navigate("/auth");
    }
  }, [session, loadingSession, navigate]);

  if (isLoading || loadingSession) {
    return <div className="p-8 text-center">Carregando resultados...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-center text-red-500">Erro ao carregar resultados: {error.message}. Isso pode ser um problema de permissão.</div>;
  }

  if (!data || !data.pool) {
    return <div className="p-8 text-center">Pesquisa não encontrada.</div>;
  }

  const { pool, results, totalResponses } = data;

  const chartConfig = {
    average: {
      label: "Média",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/user/pools")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para pesquisas
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{pool.name}</CardTitle>
            <CardDescription>{pool.description}</CardDescription>
            <CardDescription>Total de respostas: {totalResponses}</CardDescription>
          </CardHeader>
          <CardContent>
            {totalResponses > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                <BarChart data={results} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    width={180}
                    className="text-xs"
                  />
                  <XAxis dataKey="average" type="number" domain={[1, 7]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="average" fill="var(--color-average)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="text-center py-10">Nenhuma resposta para esta pesquisa ainda.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
