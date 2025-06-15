
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import AttrakDiffForm from "@/components/AttrakDiffForm";
import { ATTRAKDIFF_QUESTIONS } from "@/lib/attrakdiff";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type Pool = {
  id: string;
  name: string;
  description: string;
};

type Questions = typeof ATTRAKDIFF_QUESTIONS;

export default function PoolSurvey() {
  const { poolId } = useParams<{ poolId: string }>();
  const { user, session, loading: loadingSession } = useSession();
  const navigate = useNavigate();
  const [pool, setPool] = useState<Pool | null>(null);
  const [loadingPool, setLoadingPool] = useState(true);
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  const [loadingResponseCheck, setLoadingResponseCheck] = useState(true);

  useEffect(() => {
    if (loadingSession) return;
    if (!session) {
      navigate("/auth");
      return;
    }

    if (!poolId || !user) {
      if (!poolId) navigate("/user/pools");
      return;
    }

    supabase
      .from("pools")
      .select("id, name, description")
      .eq("id", poolId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast({ title: "Erro", description: "Pesquisa não encontrada.", variant: "destructive" });
          navigate("/user/pools");
        } else {
          setPool(data);
        }
        setLoadingPool(false);
      });

    supabase
      .from("pool_responses")
      .select("id")
      .eq("pool_id", poolId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setAlreadyResponded(true);
        }
        setLoadingResponseCheck(false);
      });

  }, [poolId, session, user, loadingSession, navigate]);

  const handleSubmit = async (answers: number[]) => {
    if (!poolId || !user) return;

    const { error } = await supabase.from("pool_responses").insert({
      pool_id: poolId,
      user_id: user.id,
      answers: { values: answers },
    });

    if (error) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível salvar suas respostas. Tente novamente.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "Suas respostas foram enviadas.",
      });
      navigate("/user/pools");
    }
  };

  const handleFormSubmit = (answers: number[], _questions: Questions) => {
    handleSubmit(answers);
  };

  if (loadingSession || loadingPool || loadingResponseCheck) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (alreadyResponded) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Pesquisa Concluída</h1>
        <p className="mb-6">Você já respondeu a esta pesquisa. Obrigado!</p>
        <Button onClick={() => navigate('/user/pools')}>Voltar para pesquisas</Button>
      </div>
    );
  }

  if (!pool) {
    return <div className="p-8 text-center">Pesquisa não encontrada.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-5xl px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{pool.name}</h1>
          {pool.description && <p className="text-gray-600 mt-2">{pool.description}</p>}
        </div>
        <AttrakDiffForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}
