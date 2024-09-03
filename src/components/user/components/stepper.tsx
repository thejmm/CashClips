import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  isLoading: boolean;
  loadingStep: number;
  loadingMessage: string;
  isFinished: boolean;
  isError: boolean; // Prop to handle error state
  progress?: number; // New optional prop for progress percentage
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
  progress = 0, // Default to 0 if not provided
}) => {
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setAlertOpen(true); // Open dialog when loading starts
    } else if (!isError && !isLoading) {
      setAlertOpen(false); // Close dialog on success
    }
  }, [isLoading, isError]);

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
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-center text-sm">{progress.toFixed(2)}% Complete</p>
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
              <div className="flex items-center justify-center mt-4">
                <Loader className="w-10 h-10 animate-spin text-blue-600" />
              </div>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Stepper;
