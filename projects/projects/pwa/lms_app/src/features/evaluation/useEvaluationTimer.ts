import { useEffect, useRef, useState } from "react";
import { useEvaluationStore } from "./evaluationStore";

interface UseEvaluationTimerProps {
  timeLimitSeconds: number | undefined;
  onTimeExpired?: () => void;
}

export const useEvaluationTimer = ({
  timeLimitSeconds,
  onTimeExpired,
}: UseEvaluationTimerProps) => {
  const { timeRemaining, setTimeRemaining } = useEvaluationStore();
  const [isActive, setIsActive] = useState(true);
  const timeRef = useRef(timeLimitSeconds);

  // Initialize timer when timeLimitSeconds changes
  useEffect(() => {
    if (timeLimitSeconds && timeRemaining === 0) {
      setTimeRemaining(timeLimitSeconds);
      timeRef.current = timeLimitSeconds;
    }
  }, [timeLimitSeconds]);

  useEffect(() => {
    if (!timeLimitSeconds || !isActive || timeRemaining === 0) {
      return;
    }

    const interval = setInterval(() => {
      const newTime = Math.max(0, timeRemaining - 1);
      setTimeRemaining(newTime);
      if (newTime === 0 && onTimeExpired) {
        onTimeExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimitSeconds, isActive, setTimeRemaining, onTimeExpired]);



  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    formattedTime: formatTime(timeRemaining),
    secondsRemaining: timeRemaining,
    isExpired: timeRemaining === 0,
    pause: () => setIsActive(false),
    resume: () => setIsActive(true),
  };
};
