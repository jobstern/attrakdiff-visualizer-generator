
import React, { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { LogOut } from "lucide-react"; // Ícone de sair

type Pool = {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
};

export default function AdminPools() {
  const { user, loading: loadingSession } = useSession();
  const { role, loading: loadingRole } = useUserRole(user?.id);
  const [pools, setPools] = useState<Pool[]>([]);
  const [loadingPools, setLoadingPools] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("pools")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPools(data);
        setLoadingPools(false);
      });
  }, [user]);

  // Função para sair
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loadingSession || loadingRole || loadingPools) return <div>Carregando...</div>;
  if (!user) {
    navigate("/auth");
    return null;
  }
  if (role !== "admin") {
    return <div className="p-8 text-center">Acesso restrito ao administrador.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Barra superior com Sair */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">Painel do Administrador</h1>
        <Button
          variant="outline"
          className="flex gap-2 items-center"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
      <div className="mb-8">
        <Button onClick={() => navigate("/admin/pools/new")}>
          Nova Pesquisa
        </Button>
      </div>
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate("/admin/pools/csv")}>
          Importar CSV de respostas
        </Button>
      </div>
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate("/admin/users")}>
          Gerenciar Usuários
        </Button>
      </div>
      
      <h2 className="font-semibold text-lg mb-2 mt-8">Pesquisas disponíveis</h2>
      {pools.length === 0 ? (
        <div className="text-muted-foreground">Nenhuma pesquisa cadastrada ainda.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Fim</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.map(pool => (
              <TableRow key={pool.id}>
                <TableCell className="font-semibold">{pool.name}</TableCell>
                <TableCell>{pool.description || <span className="text-gray-400">—</span>}</TableCell>
                <TableCell>{pool.start_date}</TableCell>
                <TableCell>{pool.end_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
