
import React, { useState } from "react";
import AttrakDiffForm from "../components/AttrakDiffForm";
import AttrakDiffChart from "../components/AttrakDiffChart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AttrakDiffSurvey() {
  const [result, setResult] = useState<number[] | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-5xl px-6">
        <Button variant="outline" size="sm" className="mb-6" onClick={() => navigate("/")}>
          ← Voltar
        </Button>
        {!result ? (
          <AttrakDiffForm onSubmit={setResult} />
        ) : (
          <AttrakDiffChart answers={result} />
        )}
      </div>
    </div>
  );
}
