
import React, { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function AdminPoolNew() {
  const { user, loading: loadingSession } = useSession();
  const { role, loading: loadingRole } = useUserRole(user?.id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  if (loadingSession || loadingRole) return <div>Carregando...</div>;
  if (!user) {
    navigate("/auth");
    return null;
  }
  if (role !== "admin") {
    return <div className="p-8 text-center">Acesso restrito ao administrador.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !startDate || !endDate) {
      setError("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("pools").insert({
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      created_by: user.id,
    });
    if (insertError) {
      setError(insertError.message);
    } else {
      navigate("/admin/pools");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="font-bold text-2xl mb-6">Nova Pesquisa</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg p-6 shadow">
        <div>
          <label className="text-sm font-medium mb-1 block">Nome*</label>
          <Input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Descrição</label>
          <Input value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Data de início*</label>
          <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Data de término*</label>
          <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2 mt-4">
          <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Criar"}</Button>
          <Button variant="outline" type="button" onClick={() => navigate("/admin/pools")}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
