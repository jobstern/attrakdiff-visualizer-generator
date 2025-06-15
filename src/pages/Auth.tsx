
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/" }
      });
      if (error) setError(error.message);
      else toast({ title: "Cadastro realizado! Confirme o email." });
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
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? "Enviando..." : mode === "login" ? "Entrar" : "Cadastrar"}</Button>
        <Button variant="outline" type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Criar conta" : "Já tem conta? Entrar"}
        </Button>
      </form>
    </div>
  );
}
