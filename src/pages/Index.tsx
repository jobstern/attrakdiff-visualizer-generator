import { useSession } from "@/hooks/useSession";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const { role } = useUserRole(user?.id);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-sky-50 to-blue-100 flex flex-col justify-center items-center px-6">
      <header className="w-full max-w-4xl flex flex-col items-center mb-24 mt-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-blue-900">AttrakDiff Survey</h1>
        <div className="text-lg text-gray-600 font-medium mb-4">
          Avalie a experiência de uso do seu produto ou serviço segundo o framework <a className="underline text-blue-700" href="https://www.attrakdiff.de/index-en.html" target="_blank" rel="noopener">AttrakDiff</a>.
        </div>
        {user ? (
          <>
            <div className="mt-5 mb-1 text-gray-900 text-base flex gap-3 items-center">
              Bem-vindo(a), <span className="font-bold">{user.email}</span>
              <span className="text-xs bg-sky-100 px-2 py-0.5 rounded text-blue-800">{role ?? "carregando…"}</span>
            </div>
            {role === "admin" && (
              <Button className="mt-8 px-8 py-3 text-lg" onClick={() => navigate("/admin/pools")}>
                Painel do Admin
              </Button>
            )}
            {(role === "user" || role === "admin") && (
              <Button className="mt-4 px-8 py-3 text-lg" onClick={() => navigate("/user/pools")}>
                Pesquisas Disponíveis
              </Button>
            )}
            <Button variant="outline" className="mt-6" onClick={handleLogout}>
              Sair
            </Button>
          </>
        ) : (
          <Button className="mt-8 px-8 py-3 text-lg" onClick={() => navigate("/auth")}>
            Login / Cadastro
          </Button>
        )}
      </header>
      <footer className="mt-auto py-8 text-center w-full text-sm text-gray-400">
        Feito com &hearts; usando React + shadcn + Lucide + Recharts<br />
        <a href="https://www.attrakdiff.de/index-en.html" className="underline" target="_blank" rel="noopener">Site oficial / Saiba mais</a>
      </footer>
    </div>
  );
}
