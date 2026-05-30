import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EvaluationRunner } from "../components/EvaluationRunner";
import { EvaluationFeedback } from "../components/EvaluationFeedback";
import { useEvaluations } from "../features/evaluation/useEvaluations";
import { useEvaluationStore } from "../features/evaluation/evaluationStore";

export function EvaluationPage() {
  const { evaluationId = "eval-001" } = useParams<{ evaluationId: string }>();
  const { evaluation, isLoading, error, startAttempt } = useEvaluations(evaluationId);
  const { currentAttempt, feedbackData } = useEvaluationStore();
  const [hasStarted, setHasStarted] = useState(false);

  const handleStartEvaluation = async () => {
    await startAttempt();
    setHasStarted(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasStarted && !feedbackData) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    if (hasStarted && !feedbackData) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasStarted, feedbackData]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading evaluation...</p>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 rounded-lg">
        <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
        <p className="text-red-600">{error || "Failed to load evaluation"}</p>
      </div>
    );
  }

  // Show feedback if evaluation has been submitted
  if (feedbackData) {
    return <EvaluationFeedback />;
  }

  // Show runner if attempt has started
  if (hasStarted && currentAttempt) {
    return <EvaluationRunner evaluation={evaluation} />;
  }

  // Show start screen
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{evaluation.title}</h1>
        {evaluation.description && (
          <p className="text-gray-600 mt-2">{evaluation.description}</p>
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Evaluation Details
        </h2>

        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">Questions:</span>{" "}
            {evaluation.questions.length}
          </p>

          {evaluation.policy.timeLimitSeconds && (
            <p>
              <span className="font-semibold">Time Limit:</span>{" "}
              {Math.floor(evaluation.policy.timeLimitSeconds / 60)} minutes
            </p>
          )}

          {evaluation.policy.passingScore && (
            <p>
              <span className="font-semibold">Passing Score:</span>{" "}
              {evaluation.policy.passingScore}%
            </p>
          )}

          <p>
            <span className="font-semibold">Max Attempts:</span>{" "}
            {evaluation.policy.maxAttempts}
          </p>

          {evaluation.policy.shuffleQuestions && (
            <p className="text-blue-600">
              ℹ️ Questions will be shuffled randomly
            </p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
        <p className="text-blue-800 text-sm">
          <strong>Important:</strong> Once you start, you will have{" "}
          {evaluation.policy.timeLimitSeconds
            ? `${Math.floor(evaluation.policy.timeLimitSeconds / 60)} minutes`
            : "unlimited time"}{" "}
          to complete the evaluation. Make sure you are ready before starting.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleStartEvaluation}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-semibold"
        >
          Start Evaluation
        </button>
      </div>
    </div>
  );
}
