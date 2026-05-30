import * as Progress from "@radix-ui/react-progress";

interface ProgressBarProps {
  value: number;
  label: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div className="progress-wrapper" aria-label={label}>
      <div className="progress-heading">{label}</div>
      <Progress.Root className="radix-progress-root" value={value} max={100}>
        <Progress.Indicator
          className="radix-progress-indicator"
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </Progress.Root>
    </div>
  );
}
