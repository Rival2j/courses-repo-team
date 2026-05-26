import { useEvaluationStore } from "../features/evaluation/evaluationStore";

export function EvaluationFeedback() {
  const { feedbackData, resetEvaluation } = useEvaluationStore();

  if (!feedbackData) {
    return null;
  }

  const isPassed = feedbackData.score >= 70;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div
        className={`mb-6 p-6 rounded-lg text-center ${
          isPassed ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-2 ${
            isPassed ? "text-green-800" : "text-red-800"
          }`}
        >
          {isPassed ? "Congratulations!" : "Try Again"}
        </h2>

        <div
          className={`text-5xl font-bold mb-4 ${
            isPassed ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedbackData.score.toFixed(1)}%
        </div>

        <p className={`text-lg ${isPassed ? "text-green-700" : "text-red-700"}`}>
          {feedbackData.message}
        </p>
      </div>

      {/* Question Review (optional) */}
      {feedbackData.questionsReview && feedbackData.questionsReview.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Question Review
          </h3>
          <div className="space-y-4">
            {feedbackData.questionsReview.map((review: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">
                  Question {index + 1}: {review.question}
                </p>
                <p className="text-gray-700 mb-2">
                  Your answer: <span className="font-medium">{review.userAnswer}</span>
                </p>
                {review.isCorrect === false && (
                  <p className="text-red-600">
                    Correct answer: <span className="font-medium">{review.correctAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={resetEvaluation}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retake Evaluation
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back to Course
        </button>
      </div>
    </div>
  );
}
