
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Role = "admin" | "user";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Se está autenticado, redireciona
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "signup") {
      // 1. Cadastra usuário
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/" }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // 2. Salva perfil na tabela user_roles (se possível)
      // Pode não haver user_id imediatamente; pega do user se possível
      const userId = data?.user?.id;
      if (userId) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role });
        if (roleError) {
          setError("Usuário criado, mas houve erro ao definir o perfil.");
        }
      }
      toast({ title: "Cadastro realizado! Confirme o email." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleAuth}
        className="bg-white shadow-xl p-8 rounded-lg w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-2">{mode === "login" ? "Entrar" : "Cadastro"}</h2>
        <Input
          value={email}
          type="email"
          placeholder="Email"
          required
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          value={password}
          type="password"
          placeholder="Senha"
          required
          minLength={6}
          onChange={e => setPassword(e.target.value)}
        />
        {mode === "signup" && (
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="role">
              Perfil:
            </label>
            <select
              className="border rounded px-2 py-1 w-full"
              id="role"
              value={role}
              onChange={e => setRole(e.target.value as Role)}
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button type="submit" disabled={loading}>
          {loading ? "Enviando..." : mode === "login" ? "Entrar" : "Cadastrar"}
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Criar conta" : "Já tem conta? Entrar"}
        </Button>
      </form>
    </div>
  );
}
