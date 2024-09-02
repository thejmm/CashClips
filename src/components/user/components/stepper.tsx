// src\components\user\components\stepper.tsx
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader } from "lucide-react";

import React from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  isLoading: boolean;
  loadingStep: number;
  loadingMessage: string;
  isFinished: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  isLoading,
  loadingStep,
  loadingMessage,
  isFinished,
}) => {
  return (
    <div className="w-full p-2 px-2 md:px-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = isFinished || currentStep > stepNumber;
          const isCurrent = !isFinished && currentStep === stepNumber;
          const isLoadingThis = isLoading && loadingStep === stepNumber;
          return (
            <React.Fragment key={index}>
              <div className="relative flex flex-col items-center">
                <motion.button
                  className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-colors duration-200 ${
                    isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : isCurrent
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-500"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onStepClick(stepNumber)}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 md:w-6 md:h-6" />
                  ) : isLoadingThis ? (
                    <Loader className="w-4 h-4 md:w-6 md:h-6 animate-spin" />
                  ) : (
                    <span className="text-xs md:text-sm font-semibold">
                      {stepNumber}
                    </span>
                  )}
                </motion.button>
                <motion.div
                  className={`absolute -bottom-6 w-max text-center text-xs font-medium ${
                    isCurrent ? "text-blue-600" : "text-gray-500"
                  } ${isCurrent ? "" : "hidden md:block"}`}
                  initial={false}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                >
                  {isCurrent ? (
                    step
                  ) : (
                    <span className="truncate max-w-[60px] md:max-w-none">
                      {step}
                    </span>
                  )}
                </motion.div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-300 mx-1 md:mx-2">
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
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 p-4 bg-blue-100 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-center">
              <Loader className="w-6 h-6 animate-spin mr-3" />
              <span className="text-blue-800 font-medium">
                {loadingMessage}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Stepper;
