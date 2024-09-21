import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Download, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pricingConfig, toHumanPrice } from "../landing/sections/pricing";

import { AuthModal } from "../landing/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { FaCopy } from "react-icons/fa";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import SyntaxHighlighter from "react-syntax-highlighter";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { generateCode } from "@/lib/editor-lib/generate-code";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useEditorState } from "@/context/editor-context/editor-provider";

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "typescript",
}) => {
  return (
    <ScrollArea className="h-[30rem] md:h-96 w-full">
      <Button
        size="icon"
        variant="ringHoverOutline"
        className="absolute right-2 top-4"
      >
        <FaCopy />
      </Button>
      <SyntaxHighlighter
        language={language}
        style={okaidia}
        showLineNumbers={true}
        wrapLines={true}
        wrapLongLines={true}
        className="rounded"
      >
        {code}
      </SyntaxHighlighter>
    </ScrollArea>
  );
};

const AuthenticatedDialog: React.FC<{ generatedCode: any }> = ({
  generatedCode,
}) => {
  return (
    <DialogContent className="max-w-5xl w-full">
      <DialogHeader>
        <DialogTitle>Generated Code</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="pages" className="w-full">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>
        <TabsContent value="pages">
          <Tabs defaultValue="_app">
            <TabsList>
              <TabsTrigger value="_app">_app.tsx</TabsTrigger>
              <TabsTrigger value="index">index.tsx</TabsTrigger>
            </TabsList>
            <TabsContent value="_app">
              <CodeBlock code={generatedCode.pages._app} />
            </TabsContent>
            <TabsContent value="index">
              <CodeBlock code={generatedCode.pages.index} />
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="components">
          <Tabs defaultValue={Object.keys(generatedCode.components)[0]}>
            <TabsList>
              {Object.keys(generatedCode.components).map((componentName) => (
                <TabsTrigger key={componentName} value={componentName}>
                  {componentName}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(generatedCode.components).map(
              ([componentName, code]) => (
                <TabsContent key={componentName} value={componentName}>
                  <CodeBlock code={code as string} />
                </TabsContent>
              ),
            )}
          </Tabs>
        </TabsContent>
      </Tabs>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => {}}>
          <Download className="mr-2 h-4 w-4" /> Export All
        </Button>
      </div>
    </DialogContent>
  );
};

const UnauthenticatedDialog: React.FC = () => {
  const [selectedInterval, setSelectedInterval] = useState<"month" | "year">(
    "year",
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (selectedPriceId) {
      window.location.href = `/checkout?price_id=${selectedPriceId}`;
    }
  };

  return (
    <DialogContent className="max-w-6xl w-full justify-center mx-auto">
      <DialogHeader>
        <DialogTitle className="text-center text-2xl font-bold">
          Upgrade
        </DialogTitle>
      </DialogHeader>
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          Upgrade to view code and export your website to a Next.js & Tailwind
          CSS app.
        </p>
      </div>
      <div className="w-full">
        <div className="container mx-auto w-full">
          <div className="flex justify-center pr-56">
            <motion.div
              className="inline-block bg-primary text-primary-foreground text-xs font-bold py-2 px-3 rounded-full transform -rotate-8"
              initial={{ opacity: 0, y: 20, rotate: -12 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: -8,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                },
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              ✨Save 10% Yearly
            </motion.div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center space-x-4 mb-6">
        <span className={selectedInterval === "month" ? "font-bold" : ""}>
          Monthly
        </span>
        <Switch
          checked={selectedInterval === "year"}
          onCheckedChange={(checked) =>
            setSelectedInterval(checked ? "year" : "month")
          }
        />
        <span className={selectedInterval === "year" ? "font-bold" : ""}>
          Yearly
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
        {pricingConfig.plans.map((plan) => {
          const price =
            selectedInterval === "year" ? plan.yearlyPrice : plan.monthlyPrice;
          const priceId = plan.stripePriceId[selectedInterval];
          const originalYearlyPrice = plan.monthlyPrice * 12;
          const yearlyDiscount = originalYearlyPrice - plan.yearlyPrice;

          return (
            <motion.div
              key={plan.id}
              className={`p-4 rounded-lg relative ${
                plan.isPro
                  ? "border-2 border-primary shadow-lg"
                  : "border border-muted"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {plan.isPro && (
                <div className="absolute -top-[2px] -right-[2px]">
                  <p className="bg-primary text-primary-foreground text-xs font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg inline-block">
                    Most Popular
                  </p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${plan.id}-${selectedInterval}-${price}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                  >
                    {selectedInterval === "year" && (
                      <div className="text-muted-foreground mb-1">
                        <span className="text-lg line-through">
                          ${toHumanPrice(originalYearlyPrice, 2)}
                        </span>
                        <span className="text-sm font-normal">/year</span>
                      </div>
                    )}
                    <div className="text-3xl font-bold">
                      ${toHumanPrice(price, 2)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{selectedInterval}
                      </span>
                    </div>
                    {selectedInterval === "year" && (
                      <p className="text-sm text-green-500 font-semibold mt-1">
                        Save ${toHumanPrice(yearlyDiscount, 2)} per year!
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="ringHover"
                  className="w-full group transition-all duration-300"
                  onClick={() => {
                    setSelectedPriceId(priceId);
                    setIsAuthModalOpen(true);
                  }}
                >
                  {plan.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
      <Link href="/pricing" passHref className="mx-auto justify-center">
        <Button
          variant="ringHover"
          className="mt-4 w-full group transition-all duration-300"
        >
          View All Features
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        showReturnButton={false}
      />
    </DialogContent>
  );
};

const ExportDialog: React.FC = () => {
  const { state } = useEditorState();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const generatedCode = generateCode(state.components, state.sections);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ringHover">Export Code</Button>
      </DialogTrigger>
      {user ? (
        <AuthenticatedDialog generatedCode={generatedCode} />
      ) : (
        <UnauthenticatedDialog />
      )}
    </Dialog>
  );
};

export default ExportDialog;
