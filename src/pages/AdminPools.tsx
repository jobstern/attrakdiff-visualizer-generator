
import React from "react";
import { useSession } from "@/hooks/useSession";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminPools() {
  const { user, loading: loadingSession } = useSession();
  const { role, loading: loadingRole } = useUserRole(user?.id);
  const navigate = useNavigate();

  if (loadingSession || loadingRole) return <div>Carregando...</div>;
  if (!user) {
    navigate("/auth");
    return null;
  }
  if (role !== "admin") {
    return <div className="p-8 text-center">Acesso restrito ao administrador.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="font-bold text-2xl mb-4">Painel do Administrador</h1>
      {/* Aqui depois posso adicionar o CRUD de pools */}
      <div className="mb-8">
        <Button onClick={() => navigate("/admin/pools/new")}>
          Nova Pesquisa
        </Button>
      </div>
      <div className="mb-12">
        <Button variant="outline" onClick={() => navigate("/admin/pools/csv")}>
          Importar CSV de respostas
        </Button>
      </div>
      {/* Aqui listar pools existentes depois */}
      <div>Listagem de pesquisas em breve…</div>
    </div>
  );
}
