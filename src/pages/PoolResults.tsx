
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { ATTRAKDIFF_QUESTIONS } from "@/lib/attrakdiff";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, LogOut } from "lucide-react";
import AttrakDiffChart from "@/components/AttrakDiffChart";

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
    return { pool: poolData, averageAnswers: [], totalResponses: 0 };
  }

  const numQuestions = ATTRAKDIFF_QUESTIONS.length;
  const averageAnswers: number[] = [];

  for (let i = 0; i < numQuestions; i++) {
    const sum = allAnswers.reduce((acc, current) => acc + (current[i] || 0), 0);
    const average = sum / allAnswers.length;
    averageAnswers.push(average);
  }

  return { pool: poolData, averageAnswers: averageAnswers, totalResponses: allAnswers.length };
};

export default function PoolResults() {
  const { poolId } = useParams<{ poolId: string }>();
  const { session, loading: loadingSession } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

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

  const { pool, averageAnswers, totalResponses } = data;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => navigate("/user/pools")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para pesquisas
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
        
        <div className="mb-6 p-6 bg-card text-card-foreground rounded-lg border shadow-sm">
            <h1 className="text-2xl font-semibold leading-none tracking-tight">{pool.name}</h1>
            <p className="text-sm text-muted-foreground mt-1.5">{pool.description}</p>
            <p className="text-sm text-muted-foreground mt-1.5">Total de respostas: {totalResponses}</p>
        </div>

        {totalResponses > 0 ? (
          <AttrakDiffChart answers={averageAnswers} questions={ATTRAKDIFF_QUESTIONS} />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">Nenhuma resposta para esta pesquisa ainda.</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
