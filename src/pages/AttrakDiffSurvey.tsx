
import React, { useState } from "react";
import AttrakDiffForm from "../components/AttrakDiffForm";
import AttrakDiffChart from "../components/AttrakDiffChart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ATTRAKDIFF_QUESTIONS } from "../lib/attrakdiff";

export default function AttrakDiffSurvey() {
  const [result, setResult] = useState<{ answers: number[]; questions: typeof ATTRAKDIFF_QUESTIONS } | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-5xl px-6">
        <Button variant="outline" size="sm" className="mb-6" onClick={() => navigate("/")}>
          ← Voltar
        </Button>
        {!result ? (
          <AttrakDiffForm
            onSubmit={(answers, questions) => setResult({ answers, questions })}
          />
        ) : (
          <AttrakDiffChart answers={result.answers} questions={result.questions} />
        )}
      </div>
    </div>
  );
}
