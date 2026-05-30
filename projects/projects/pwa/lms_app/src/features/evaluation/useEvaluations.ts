import { useEffect, useState } from "react";
import type { Evaluation } from "../../types";
import { evaluationService } from "./evaluationService";
import { useEvaluationStore } from "./evaluationStore";

export const useEvaluations = (evaluationId: string) => {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentAttempt, setTimeRemaining } = useEvaluationStore();

  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        setIsLoading(true);
        const data = await evaluationService.getEvaluation(evaluationId);
        setEvaluation(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load evaluation"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadEvaluation();
  }, [evaluationId]);

  const startAttempt = async () => {
    if (!evaluation) return;

    try {
      const attempt = await evaluationService.startAttempt(evaluationId);
      setCurrentAttempt(attempt);

      if (evaluation.policy.timeLimitSeconds) {
        setTimeRemaining(evaluation.policy.timeLimitSeconds);
      }

      return attempt;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start evaluation"
      );
    }
  };

  return {
    evaluation,
    isLoading,
    error,
    startAttempt,
  };
};
