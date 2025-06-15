
import React, { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart, LogOut } from "lucide-react";

type Pool = {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
};

export default function UserPools() {
  const { user, loading: loadingSession } = useSession();
  const { role, loading: loadingRole } = useUserRole(user?.id);
  const [pools, setPools] = useState<Pool[]>([]);
  const [loadingPools, setLoadingPools] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  useEffect(() => {
    if (!user) return;
    supabase.from("pools").select("*").then(({ data, error }) => {
      if (data) setPools(data);
      setLoadingPools(false);
    });
  }, [user]);

  if (loadingSession || loadingRole || loadingPools) return <div>Carregando...</div>;
  if (!user) {
    navigate("/auth");
    return null;
  }
  if (role !== "user" && role !== "admin") {
    return <div className="p-8 text-center">Sem permissão.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-bold text-2xl">Selecione uma Pesquisa</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
      {pools.length === 0 ? (
        <div>Nenhuma pesquisa disponível.</div>
      ) : (
        <ul className="space-y-4">
          {pools.map(pool => (
            <li key={pool.id} className="border rounded px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{pool.name}</div>
                <div className="text-xs text-gray-500">{pool.description}</div>
                <div className="text-xs text-gray-500">
                  Início: {pool.start_date} - Fim: {pool.end_date}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => navigate(`/pools/${pool.id}/results`)}>
                  <BarChart className="mr-2 h-4 w-4" />
                  Resultados
                </Button>
                <Button onClick={() => navigate(`/pools/${pool.id}`)}>Responder</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
