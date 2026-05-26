import { useCallback, useState } from "react";
import type { Evaluation } from "../types";
import { useEvaluationStore } from "../features/evaluation/evaluationStore";
import { useEvaluationTimer } from "../features/evaluation/useEvaluationTimer";
import { evaluationService } from "../features/evaluation/evaluationService";

interface EvaluationRunnerProps {
  evaluation: Evaluation;
  onSubmit?: (answers: Record<string, string>) => void;
}

export function EvaluationRunner({ evaluation, onSubmit }: EvaluationRunnerProps) {
  const { answers, setAnswer, isSubmitting, setIsSubmitting, currentAttempt, setFeedbackData } = useEvaluationStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [canNavigate, setCanNavigate] = useState(true);

  const handleSubmit = useCallback(async () => {
    if (!currentAttempt) return;

    try {
      setIsSubmitting(true);
      setCanNavigate(false);

      await evaluationService.submitAttempt(currentAttempt.id, answers);
      const feedback = await evaluationService.getAttemptFeedback(
        currentAttempt.id
      );

      setFeedbackData(feedback);
      onSubmit?.(answers);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      setFeedbackData({
        score: 0,
        message: "Error submitting evaluation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [currentAttempt, answers, setIsSubmitting, setFeedbackData, onSubmit]);

  const handleTimeExpired = useCallback(async () => {
    if (!currentAttempt) return;
    await handleSubmit();
    setFeedbackData({
      score: 0,
      message: "Time expired. Your evaluation has been submitted.",
    });
  }, [currentAttempt, handleSubmit, setFeedbackData]);

  const { formattedTime, isExpired } = useEvaluationTimer({
    timeLimitSeconds: evaluation.policy.timeLimitSeconds,
    onTimeExpired: handleTimeExpired,
  });

  const currentQuestion = evaluation.questions[currentQuestionIndex];
  const totalQuestions = evaluation.questions.length;
  const questionsAnswered = Object.keys(answers).length;

  const progressPercentage = (questionsAnswered / totalQuestions) * 100;
  const selectedOptionId = answers[currentQuestion.id];

  // Memoize navigation handlers
  const handleSelectOption = useCallback((optionId: string) => {
    if (!canNavigate || isExpired) return;
    setAnswer(currentQuestion.id, optionId);
  }, [canNavigate, isExpired, currentQuestion.id, setAnswer]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0 && canNavigate) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, canNavigate]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1 && canNavigate) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, totalQuestions, canNavigate]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{evaluation.title}</h1>
        {evaluation.description && (
          <p className="text-gray-600 mt-2">{evaluation.description}</p>
        )}
      </div>

      {/* Timer */}
      {evaluation.policy.timeLimitSeconds && (
        <div className={`mb-6 p-4 rounded-lg ${isExpired ? "bg-red-100" : "bg-blue-100"}`}>
          <p className={`text-lg font-semibold ${isExpired ? "text-red-800" : "text-blue-800"}`}>
            Time Remaining: <span className="font-mono">{formattedTime}</span>
          </p>
        </div>
      )}

      <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">
        <p className="font-semibold">Navigation is restricted during active evaluation.</p>
        <p className="text-sm">
          Leaving or refreshing the page may submit your attempt automatically and end the session.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span>
            {questionsAnswered} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {currentQuestion.text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <label
              key={option.id}
              className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
              style={{
                borderColor:
                  selectedOptionId === option.id ? "#3b82f6" : "#e5e7eb",
                backgroundColor:
                  selectedOptionId === option.id ? "#eff6ff" : "white",
              }}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() => handleSelectOption(option.id)}
                className="w-4 h-4"
                disabled={!canNavigate || isExpired}
              />
              <span className="ml-3 text-gray-800">{option.text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || !canNavigate || isExpired}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNextQuestion}
              disabled={!canNavigate || isExpired}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !canNavigate || isExpired}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>

      {/* Info Message */}
      <p className="text-sm text-gray-500 text-center mt-4">
        {!canNavigate && "Evaluation submitted. See results below."}
      </p>
    </div>
  );
}
