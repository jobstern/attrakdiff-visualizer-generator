
import React, { useState } from "react";
import AttrakDiffForm from "../components/AttrakDiffForm";
import AttrakDiffChart from "../components/AttrakDiffChart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ATTRAKDIFF_QUESTIONS, ATTRAKDIFF_QUESTIONS_SHORT } from "../lib/attrakdiff";
import Papa from "papaparse";

interface ResultEntry {
  answers: number[];
  questions: typeof ATTRAKDIFF_QUESTIONS;
  label?: string;
}

type Questionnaire = typeof ATTRAKDIFF_QUESTIONS | typeof ATTRAKDIFF_QUESTIONS_SHORT;

export default function AttrakDiffSurvey() {
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [questions, setQuestions] = useState<Questionnaire>(ATTRAKDIFF_QUESTIONS);
  const [csvError, setCsvError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Gera CSV de exemplo conforme o questionário atual
  const handleDownloadExample = () => {
    const headers = ["nome", ...questions.map(q => q.label)];
    const values = ["Maria", ...Array(questions.length).fill(4)];
    const csv = Papa.unparse({ fields: headers, data: [values] });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "attrakdiff_exemplo.csv";
    a.click();
  };

  // Trata upload de CSV com respostas múltiplas
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: function(results_: any) {
        try {
          const data: string[][] = results_.data;
          if (!data.length) throw new Error("CSV vazio.");
          // Cabeçalho
          const header = data[0];
          const colCount = questions.length + 1; // +1 for label
          if (header.length !== colCount)
            throw new Error(`O arquivo precisa ter ${colCount} colunas (nome + respostas das perguntas na ordem).`);

          const responses: ResultEntry[] = [];
          for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (row.length < colCount) continue; // ignora linhas incompletas
            const label = row[0];
            const answers = row.slice(1).map(v => Number(v));
            if (answers.some(val => isNaN(val) || val < 1 || val > 7)) {
              throw new Error(`Linha ${i + 1}: Todas as respostas precisam ser números de 1 a 7.`);
            }
            responses.push({ answers, label, questions });
          }
          if (!responses.length) throw new Error("Nenhuma resposta válida encontrada no CSV.");
          setResults(responses);
          setSelectedIdx(0);
        } catch (err: any) {
          setCsvError(err.message || "Erro ao processar o CSV.");
        }
      },
      error: function(error) {
        setCsvError("Falha ao ler o arquivo CSV.");
      }
    });
    // reset input
    (e.target as HTMLInputElement).value = "";
  };

  // Renderiza seleção de tabs para múltiplos respondentes do CSV
  const renderTabs = () => (
    <div className="flex space-x-2 mb-4 overflow-x-auto">
      {results.map((item, idx) => (
        <Button
          key={idx}
          variant={selectedIdx === idx ? "default" : "outline"}
          size="sm"
          className="min-w-[80px]"
          onClick={() => setSelectedIdx(idx)}
        >
          {item.label || `Pessoa ${idx + 1}`}
        </Button>
      ))}
    </div>
  );

  // Troca entre versão completa/resumida para download e upload
  const handleQuestionnaireSwitch = (type: "completo" | "resumido") => {
    setQuestions(type === "completo" ? ATTRAKDIFF_QUESTIONS : ATTRAKDIFF_QUESTIONS_SHORT);
    setResults([]);
    setSelectedIdx(0);
    setCsvError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-5xl px-6">
        <Button variant="outline" size="sm" className="mb-6" onClick={() => navigate("/")}>
          ← Voltar
        </Button>

        {/* Seleção do tipo de questionário para download/Upload */}
        <div className="mb-4 flex items-center gap-3">
          <span className="font-medium">Versão do questionário:</span>
          <Button
            variant={questions === ATTRAKDIFF_QUESTIONS ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuestionnaireSwitch("completo")}
          >Completo</Button>
          <Button
            variant={questions === ATTRAKDIFF_QUESTIONS_SHORT ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuestionnaireSwitch("resumido")}
          >Resumido</Button>
        </div>

        <div className="flex flex-wrap gap-3 items-center mb-8">
          <label className="font-medium">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
              id="csv-upload"
            />
            <Button asChild variant="outline" size="sm">
              <span role="button" tabIndex={0} className="cursor-pointer">Importar respostas CSV</span>
            </Button>
          </label>
          <Button variant="outline" size="sm" onClick={handleDownloadExample}>
            Baixar exemplo CSV
          </Button>
        </div>
        {csvError && (
          <div className="text-red-700 text-sm mb-4 rounded bg-red-100 px-3 py-2">
            {csvError}
          </div>
        )}

        {results.length > 0 ? (
          <>
            {renderTabs()}
            <AttrakDiffChart
              answers={results[selectedIdx].answers}
              questions={questions}
            />
          </>
        ) : (
          <AttrakDiffForm
            onSubmit={(answers, questionsForm) => setResults([{ answers, questions: questionsForm }])}
          />
        )}
      </div>
    </div>
  );
}
