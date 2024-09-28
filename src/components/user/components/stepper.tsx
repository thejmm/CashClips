// src/components/user/components/stepper.tsx
import { Check } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  isFinished: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  isFinished,
}) => {
  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep) {
      onStepClick(stepNumber - 1);
    }
  };

  return (
    <div className="w-full p-2 px-2 md:px-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = isFinished || currentStep > stepNumber;
          const isCurrent = !isFinished && currentStep === stepNumber;
          const isClickable = stepNumber <= currentStep;
          return (
            <React.Fragment key={index}>
              <div className="relative flex flex-col items-center">
                <motion.button
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-200 md:h-10 md:w-10 ${
                    isCompleted
                      ? "border-primary bg-primary text-white"
                      : isCurrent
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 bg-white text-gray-500"
                  } ${!isClickable ? "cursor-not-allowed opacity-50" : ""}`}
                  whileHover={isClickable ? { scale: 1.1 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  onClick={() => handleStepClick(stepNumber)}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 md:h-6 md:w-6" />
                  ) : (
                    <span className="text-xs font-semibold md:text-sm">
                      {stepNumber}
                    </span>
                  )}
                </motion.button>
                <motion.div
                  className={`absolute -bottom-6 w-max text-center text-xs font-medium ${
                    isCurrent ? "text-primary" : "text-gray-500"
                  } ${isCurrent ? "" : "hidden md:block"}`}
                  initial={false}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                >
                  {isCurrent ? (
                    step
                  ) : (
                    <span className="max-w-[60px] truncate md:max-w-none">
                      {step}
                    </span>
                  )}
                </motion.div>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-1 h-0.5 flex-1 bg-gray-300 md:mx-2">
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: "0%" }}
                    animate={{
                      width: isCompleted ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
