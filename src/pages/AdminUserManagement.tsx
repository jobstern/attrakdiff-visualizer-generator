
import React, { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

type UserWithRole = {
  id: string;
  email: string;
  role: "admin" | "user" | null;
};

export default function AdminUserManagement() {
  const { user, loading: loadingSession } = useSession();
  const { role, loading: loadingRole } = useUserRole(user?.id);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Só o admin pode acessar
  useEffect(() => {
    if (!loadingSession && !user) navigate("/auth");
  }, [loadingSession, user, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // Busca todos os usuários do Auth
      const { data: list, error } = await supabase.auth.admin.listUsers();
      if (error) {
        setLoading(false);
        return;
      }
      // Busca os roles do banco
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      // Monta lista combinada
      const usersWithRole: UserWithRole[] = (list?.users || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        role: roles?.find((r: any) => r.user_id === u.id)?.role ?? null,
      }));
      setUsers(usersWithRole);
      setLoading(false);
    };
    if (role === "admin") fetchUsers();
  }, [role]);

  const handleChangeRole = async (userId: string, newRole: "admin" | "user") => {
    // Upsert no role
    await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role: newRole }, { onConflict: "user_id" });
    // Atualiza local
    setUsers(users =>
      users.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  if (loadingSession || loadingRole || loading) return <div>Carregando…</div>;
  if (role !== "admin") return <div className="p-8 text-center">Acesso restrito ao administrador.</div>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="font-bold text-2xl mb-4">Gerenciar Perfis de Usuário</h1>
      <div className="mb-6 text-sm text-gray-700">
        Altere o perfil dos usuários conforme necessário.
      </div>
      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Email</th>
            <th className="py-2">Perfil</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b">
              <td className="py-2">{u.email}</td>
              <td className="py-2">
                <select
                  className="border rounded px-2 py-1"
                  value={u.role ?? ""}
                  onChange={e =>
                    handleChangeRole(u.id, e.target.value as "admin" | "user")
                  }
                  disabled={u.id === user?.id}
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
                {u.id === user?.id && (
                  <span className="text-xs ml-2 text-gray-400">(você)</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="outline" onClick={() => navigate("/admin/pools")}>Voltar</Button>
    </div>
  );
}
