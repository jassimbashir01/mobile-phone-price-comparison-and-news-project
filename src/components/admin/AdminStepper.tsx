import { Check } from 'lucide-react';

export function AdminStepper({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <ol className="mb-6 flex items-center gap-2 text-xs">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < currentStep;
        const active = stepNum === currentStep;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-semibold ${
                done
                  ? 'bg-primary text-white'
                  : active
                    ? 'border-2 border-primary text-primary'
                    : 'border border-border text-ink/40'
              }`}
            >
              {done ? <Check size={12} /> : stepNum}
            </span>
            <span className={active ? 'font-semibold text-ink' : 'text-ink/50'}>{label}</span>
            {stepNum < steps.length && <span className="ml-1 h-px flex-1 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}