import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  isLoading: boolean;
  loadingStep: number;
  loadingMessage: string;
  isFinished: boolean;
  isError: boolean | null;
  progress?: number;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  isLoading,
  loadingStep,
  loadingMessage,
  isFinished,
  isError,
  progress = 0,
}) => {
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setAlertOpen(true);
    } else if (!isError && !isLoading) {
      setAlertOpen(false);
    }
  }, [isLoading, isError]);

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="w-full p-2 px-2 md:px-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = isFinished || currentStep > stepNumber;
          const isCurrent = !isFinished && currentStep === stepNumber;
          const isLoadingThis = isLoading && loadingStep === stepNumber;
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
                  ) : isLoadingThis ? (
                    <Loader className="h-4 w-4 animate-spin md:h-6 md:w-6" />
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

      {/* Alert Dialog for Loading States */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="max-w-md rounded-lg p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isError ? "An Error Occurred" : "Processing..."}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isError
                ? "There was a problem processing your request."
                : loadingMessage}
              {/* Progress Bar or Text */}
              {!isError && isLoading && (
                <div className="mt-4">
                  <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2.5 rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-center text-sm">
                    {progress.toFixed(2)}% Complete
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {isError ? (
              <AlertDialogCancel onClick={() => setAlertOpen(false)}>
                Close
              </AlertDialogCancel>
            ) : (
              <div className="mt-4 flex items-center justify-center">
                <Loader className="h-10 w-10 animate-spin text-primary" />
              </div>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Stepper;
