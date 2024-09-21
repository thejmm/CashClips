import { Angry, Check, Frown, Laugh, Loader2, Meh, Smile } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/component";

type FeedbackOption = {
  rate: number;
  icon: JSX.Element;
  color: string;
  symbol: string;
  placeholder: string;
};

const feedbackOptions: FeedbackOption[] = [
  {
    rate: 5,
    icon: <Laugh size={24} />,
    color: "text-green-500",
    symbol: "😄",
    placeholder:
      "Awesome! Glad you enjoyed it. Is there anything we can improve? What was your favorite tool and why?",
  },
  {
    rate: 4,
    icon: <Smile size={24} />,
    color: "text-blue-500",
    symbol: "🙂",
    placeholder:
      "We're sorry you didn't love it. Is there anything we can improve? Can you please explain your experience?",
  },
  {
    rate: 3,
    icon: <Meh size={24} />,
    color: "text-orange-500",
    symbol: "😐",
    placeholder:
      "We are very sorry. Could you please explain what you experienced that made your experience not so great?",
  },
  {
    rate: 2,
    icon: <Frown size={24} />,
    color: "text-yellow-500",
    symbol: "☹️",
    placeholder:
      "We are beyond sorry. Please leave a detailed explanation of what happened. We will be sure to look into this ASAP.",
  },
  {
    rate: 1,
    icon: <Angry size={24} />,
    color: "text-red-500",
    symbol: "😠",
    placeholder:
      "We are extremely sorry. Could you please explain what went wrong in detail so we can improve?",
  },
];

interface FeedbackEmojiProps {
  option: FeedbackOption;
  selected: boolean;
  onClick: () => void;
}

const FeedbackEmoji = ({ option, selected, onClick }: FeedbackEmojiProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex h-10 w-10 items-center justify-center rounded-full transition-all",
      "hover:bg-accent",
      selected ? "bg-accent" : "bg-transparent",
      option.color,
    )}
  >
    {option.icon}
  </button>
);

FeedbackEmoji.displayName = "FeedbackEmoji";

interface FeedbackState {
  isLoading: boolean;
  error: Error | null;
  isSent: boolean;
}

const useSubmitFeedback = () => {
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    isLoading: false,
    error: null,
    isSent: false,
  });

  const submitFeedback = async (
    rate: number,
    message: string,
    symbol: string,
  ): Promise<void> => {
    setFeedbackState({ isLoading: true, error: null, isSent: false });
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("feedback")
        .insert({ rate, message, symbol });

      if (error) throw error;

      setFeedbackState({ isLoading: false, error: null, isSent: true });
    } catch (error) {
      setFeedbackState({
        isLoading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
        isSent: false,
      });
    }
  };

  return { ...feedbackState, submitFeedback };
};

const setLocalStorageExpiry = (days: number) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  localStorage.setItem("userFeedbackExpiry", expiryDate.toISOString());
};

const checkLocalStorageExpiry = (): boolean => {
  const expiry = localStorage.getItem("userFeedbackExpiry");
  if (!expiry) return true;
  return new Date() > new Date(expiry);
};

export const Feedback = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRate, setSelectedRate] = useState<number | null>(null);
  const [isSubmitted, setSubmissionState] = useState<boolean>(false);
  const [feedbackLength, setFeedbackLength] = useState<number>(0);
  const { submitFeedback, isLoading, isSent } = useSubmitFeedback();
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (checkLocalStorageExpiry()) {
      const timer = setTimeout(() => setIsVisible(true), 300000); // 5 minutes
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!selectedRate && textRef.current) {
      textRef.current.value = "";
    }
  }, [selectedRate]);

  useEffect(() => {
    if (isSent) {
      setSubmissionState(true);
      setLocalStorageExpiry(14);
      const timeout = setTimeout(() => {
        setSelectedRate(null);
        if (textRef.current) textRef.current.value = "";
        setSubmissionState(false);
        setIsVisible(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isSent]);

  const handleFeedbackChange = () => {
    setFeedbackLength(textRef.current?.value.length || 0); // Update feedback length
  };

  const memoizedContent = useMemo(
    () => (
      <motion.div
        layout
        initial={{ borderRadius: "2rem", opacity: 0, y: 50 }}
        animate={{
          borderRadius: selectedRate ? "0.5rem" : "2rem",
          opacity: 1,
          y: 0,
        }}
        exit={{ opacity: 0, y: 50, scale: 0.5 }}
        transition={{ duration: 0.3 }}
        className="relative w-full md:w-full md:max-w-lg overflow-hidden border py-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="flex flex-col items-center justify-center gap-3 px-4 sm:flex-row">
          <div className="text-sm text-black dark:text-neutral-400">
            Rate our service:
          </div>
          <div className="flex items-center text-neutral-400">
            {feedbackOptions.map((option) => (
              <FeedbackEmoji
                key={option.rate}
                option={option}
                selected={selectedRate === option.rate}
                onClick={() =>
                  setSelectedRate((prev) =>
                    option.rate === prev ? null : option.rate,
                  )
                }
              />
            ))}
          </div>
        </div>
        <motion.div
          aria-hidden={!selectedRate}
          initial={{ height: 0, opacity: 0 }}
          animate={
            selectedRate !== null
              ? { height: "auto", opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.3 }}
          className="px-2 overflow-hidden"
        >
          <AnimatePresence>
            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-2"
              >
                <textarea
                  ref={textRef}
                  onChange={handleFeedbackChange} // Update feedback length on change
                  placeholder={
                    selectedRate
                      ? feedbackOptions.find((o) => o.rate === selectedRate)
                          ?.placeholder
                      : "Your feedback is valuable to us..."
                  }
                  className="w-full min-h-[100px] resize-none rounded-md border bg-transparent p-2 text-sm placeholder-neutral-400 focus:border-neutral-400 focus:outline-0 dark:border-neutral-800 focus:dark:border-white"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={() => {
                      if (selectedRate !== null) {
                        const option = feedbackOptions.find(
                          (o) => o.rate === selectedRate,
                        );
                        if (option) {
                          submitFeedback(
                            selectedRate,
                            textRef.current?.value || "",
                            option.symbol,
                          );
                        }
                      }
                    }}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-md border bg-neutral-950 px-4 text-sm text-white dark:bg-white dark:text-neutral-950",
                      isLoading &&
                        "bg-neutral-500 dark:bg-white dark:text-neutral-500",
                    )}
                    disabled={
                      isLoading || selectedRate === null || feedbackLength < 10 // New condition for disabling button
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center gap-2 py-4 text-sm font-normal"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 dark:bg-sky-500">
                  <Check strokeWidth={2.5} size={16} className="stroke-white" />
                </div>
                <div>Thank you for your valuable feedback!</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    ),
    [selectedRate, isSubmitted, isLoading, submitFeedback, feedbackLength],
  );

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {memoizedContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Feedback.displayName = "Feedback";
