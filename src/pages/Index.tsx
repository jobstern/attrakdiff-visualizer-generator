
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-sky-50 to-blue-100 flex flex-col justify-center items-center px-6">
      <header className="w-full max-w-4xl flex flex-col items-center mb-24 mt-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-blue-900">AttrakDiff Survey</h1>
        <div className="text-lg text-gray-600 font-medium mb-4">
          Avalie a experiência de uso do seu produto ou serviço segundo o framework <a className="underline text-blue-700" href="https://www.attrakdiff.de/index-en.html" target="_blank" rel="noopener">AttrakDiff</a>.
        </div>
        <p className="text-gray-500 text-md max-w-xl text-center">
          O AttrakDiff é um método consagrado de avaliação de usabilidade e experiência, analisando os aspectos <b>pragmáticos</b> (funcionalidade, eficiência) e <b>hedônicos</b> (estímulo, identidade). Responda o questionário e visualise os resultados em gráficos automáticos.
        </p>
        <Button className="mt-8 px-8 py-3 text-lg" onClick={() => navigate("/attrakdiff")}>
          Iniciar Questionário
        </Button>
      </header>
      <footer className="mt-auto py-8 text-center w-full text-sm text-gray-400">
        Feito com &hearts; usando React + shadcn + Lucide + Recharts<br />
        <a href="https://www.attrakdiff.de/index-en.html" className="underline" target="_blank" rel="noopener">Site oficial / Saiba mais</a>
      </footer>
    </div>
  );
}
