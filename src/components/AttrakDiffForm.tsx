
import React, { useState } from "react";
import {
  ATTRAKDIFF_QUESTIONS,
  ATTRAKDIFF_QUESTIONS_SHORT,
  AttrakDiffScale,
} from "../lib/attrakdiff";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type QuestionnaireType = "completo" | "resumido";

interface Props {
  onSubmit: (answers: number[], questions: typeof ATTRAKDIFF_QUESTIONS) => void;
}

export default function AttrakDiffForm({ onSubmit }: Props) {
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireType>("completo");
  const questions = questionnaire === "completo" ? ATTRAKDIFF_QUESTIONS : ATTRAKDIFF_QUESTIONS_SHORT;

  const [answers, setAnswers] = useState<(AttrakDiffScale | null)[]>(Array(questions.length).fill(null));
  const [submitting, setSubmitting] = useState(false);

  // Atualizar answers quando trocar o tamanho do questionário
  React.useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
  }, [questionnaire]);

  const handleChange = (idx: number, value: AttrakDiffScale) => {
    setAnswers((prev) => {
      const arr = [...prev];
      arr[idx] = value;
      return arr;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((a) => a === null)) {
      toast({ title: "Responda todas as perguntas." });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmit(answers as number[], questions);
      toast({ title: "Respostas enviadas!" });
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Questionário AttrakDiff</h2>
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <label className="font-medium flex items-center gap-2">
          <input
            type="radio"
            checked={questionnaire === "completo"}
            onChange={() => setQuestionnaire("completo")}
            className="accent-blue-600 scale-110"
            name="tipo"
          />Completo (28 questões)
        </label>
        <label className="font-medium flex items-center gap-2">
          <input
            type="radio"
            checked={questionnaire === "resumido"}
            onChange={() => setQuestionnaire("resumido")}
            className="accent-blue-600 scale-110"
            name="tipo"
          />Resumido (10 questões)
        </label>
      </div>
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="flex items-center space-x-6 py-2 border-b last:border-0">
            <span className="w-60 text-sm font-medium text-gray-700">{q.label}</span>
            <div className="flex flex-1 justify-between">
              {[1,2,3,4,5,6,7].map((val) => (
                <label key={val} className="flex flex-col items-center cursor-pointer group">
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={val}
                    checked={answers[idx] === val}
                    onChange={() => handleChange(idx, val as AttrakDiffScale)}
                    disabled={submitting}
                    className="accent-blue-600 scale-110 transition"
                  />
                  <span className={`text-xs mt-1 text-gray-400 group-hover:text-blue-700 ${answers[idx] === val ? 'font-bold text-blue-900' : ''}`}>{val}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <Button type="submit" disabled={submitting || answers.some((a) => a === null)}>
          {submitting ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </form>
  );
}
