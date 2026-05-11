"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  const currentStepData = steps.find((s) => s.id === currentStep);

  return (
    <>
      {/* Mobile: compact step indicator */}
      <div className={cn("flex items-center gap-2 md:hidden", className)}>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-emerald text-xs font-mono font-bold text-emerald">
          {currentStep}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-emerald leading-tight">
            {currentStepData?.label}
          </span>
          <span className="text-[10px] text-espresso/40 font-mono">
            of {steps.length}
          </span>
        </div>
      </div>

      {/* Desktop: full stepper */}
      <div className={cn("hidden md:flex items-center gap-2", className)}>
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center gap-2">
              {/* Step circle */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-mono font-bold transition-all",
                    isCompleted && "border-emerald bg-emerald text-white",
                    isCurrent && "border-emerald text-emerald",
                    !isCompleted &&
                      !isCurrent &&
                      "border-bone text-espresso/40",
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium uppercase tracking-wider lg:inline",
                    isCurrent && "text-emerald",
                    isCompleted && "text-emerald/70",
                    !isCompleted && !isCurrent && "text-espresso/40",
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-[2px] w-6 lg:w-12 transition-all",
                    currentStep > step.id + 1
                      ? "bg-emerald"
                      : currentStep > step.id
                        ? "bg-emerald/50"
                        : "bg-bone",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
