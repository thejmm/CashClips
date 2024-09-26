// // src/pages/docs/affiliate.tsx
// import { useEffect, useRef, useState } from "react";
// import { useMotionValue, useSpring } from "framer-motion";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import DocsLayout from "@/components/docs/docs-layout";
// import { Slider } from "@/components/ui/slider";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   DollarSign,
//   TrendingUp,
//   Users,
//   CheckCircle,
//   BarChartIcon,
//   ArrowRight,
// } from "lucide-react";

// // CurrencyTicker component for formatted currency display
// function CurrencyTicker({
//   value,
//   className,
// }: {
//   value: number;
//   className?: string;
// }) {
//   const ref = useRef<HTMLSpanElement>(null);
//   const motionValue = useMotionValue(0);
//   const springValue = useSpring(motionValue, {
//     damping: 60,
//     stiffness: 100,
//   });

//   useEffect(() => {
//     motionValue.set(value);
//   }, [motionValue, value]);

//   useEffect(() => {
//     springValue.on("change", (latest) => {
//       if (ref.current) {
//         ref.current.textContent = `$${Number(latest).toFixed(2)}`;
//       }
//     });
//   }, [springValue]);

//   return <span className={className} ref={ref} />;
// }

// // Define animation variants
// const fadeInUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
// };

// const stagger = {
//   visible: { transition: { staggerChildren: 0.1 } },
// };

// const commissionRate = 0.05;
// const payoutDelay = 30;
// const payoutThreshold = 25;

// const pricingConfig = {
//   plans: [
//     {
//       id: "starter",
//       name: "Starter",
//       monthlyPrice: 12.99,
//       yearlyPrice: 155.88,
//     },
//     {
//       id: "pro",
//       name: "Pro",
//       monthlyPrice: 69.99,
//       yearlyPrice: 839.88,
//     },
//     {
//       id: "ultimate",
//       name: "Ultimate",
//       monthlyPrice: 149.99,
//       yearlyPrice: 1799.88,
//     },
//     {
//       id: "agency",
//       name: "Agency",
//       monthlyPrice: 499.99,
//       yearlyPrice: 5999.88,
//     },
//   ],
// };

// const AffiliatePage: React.FC = () => {
//   const [referralCount, setReferralCount] = useState<number>(10);

//   const handleSliderChange = (value: number[]) => {
//     setReferralCount(value[0]);
//   };

//   const calculateCommission = (price: number) => {
//     return price * commissionRate * referralCount;
//   };

//   return (
//     <DocsLayout>
//       <motion.div
//         initial="hidden"
//         animate="visible"
//         variants={stagger}
//         className="space-y-12"
//       >
//         {/* Header Section */}
//         <motion.section variants={fadeInUp}>
//           <h1 className="mb-4 text-4xl font-bold">
//             CashClips Affiliate Program
//           </h1>
//           <p className="mb-8 text-xl">
//             Join our affiliate program and earn a one-time 5% commission for
//             every user you refer who subscribes to one of our plans.
//           </p>
//         </motion.section>

//         {/* Bento Grid Layout */}
//         <motion.section variants={fadeInUp}>
//           <div className="mb-12 flex flex-col items-center">
//             <div className="grid w-full max-w-screen-lg grid-cols-1 gap-6 md:grid-cols-2">
//               <motion.div variants={fadeInUp} className="col-span-1">
//                 <Card className="flex flex-col items-center rounded-lg text-center shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-center text-xl">
//                       <DollarSign className="mr-2 text-primary" /> Earn
//                       Commissions
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     Earn 5% commission on every user you refer when they
//                     subscribe to any CashClips plan.
//                   </CardContent>
//                 </Card>
//               </motion.div>

//               <motion.div variants={fadeInUp} className="col-span-1">
//                 <Card className="flex flex-col items-center rounded-lg text-center shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-center text-xl">
//                       <TrendingUp className="mr-2 text-primary" /> One-Time
//                       Payment
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     Earn a one-time 5% commission for each new customer you
//                     bring to CashClips. The more users you refer, the more you
//                     earn.
//                   </CardContent>
//                 </Card>
//               </motion.div>

//               <motion.div
//                 variants={fadeInUp}
//                 className="col-span-1 md:col-span-2"
//               >
//                 <Card className="flex flex-col items-center rounded-lg text-center shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-center text-lg">
//                       <Users className="mr-2 text-primary" /> No Caps or Limits
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     There are no limits to how much you can earn. The more you
//                     refer, the more you make.
//                   </CardContent>
//                 </Card>
//               </motion.div>

//               <motion.div variants={fadeInUp} className="col-span-1">
//                 <Card className="flex flex-col items-center rounded-lg text-center shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-center text-lg">
//                       <CheckCircle className="mr-2 text-primary" /> Easy Payouts
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     Get paid automatically once you hit the payout threshold
//                     with no hassle!
//                   </CardContent>
//                 </Card>
//               </motion.div>

//               <motion.div variants={fadeInUp} className="col-span-1">
//                 <Card className="flex flex-col items-center rounded-lg text-center shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-center text-lg">
//                       <BarChartIcon className="mr-2 text-primary" /> Real-Time
//                       Analytics
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     Track your earnings, clicks, and conversions in real-time
//                     with our affiliate dashboard.
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </div>

//             <div className="mt-8">
//               <a
//                 href="https://cashclips.promotekit.com"
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 <Button
//                   variant="ringHover"
//                   size="lg"
//                   className="group transition-all duration-300"
//                 >
//                   Join the CashClips Affiliate Program
//                   <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
//                 </Button>
//               </a>
//             </div>
//           </div>
//         </motion.section>

//         {/* How it works */}
//         <motion.section variants={fadeInUp}>
//           <h2 className="my-4 text-3xl font-semibold">How It Works</h2>
//           <ol className="mb-8 list-inside list-decimal space-y-4">
//             <motion.li variants={fadeInUp}>
//               Sign up for our affiliate program using the same email address as
//               your CashClips account.
//             </motion.li>
//             <motion.li variants={fadeInUp}>
//               Receive your unique affiliate link to share with your audience.
//             </motion.li>
//             <motion.li variants={fadeInUp}>
//               Promote CashClips using your affiliate link on your website,
//               social media, or other channels.
//             </motion.li>
//             <motion.li variants={fadeInUp}>
//               When someone signs up using your link, they are tagged as your
//               referral.
//             </motion.li>
//             <motion.li variants={fadeInUp}>
//               Earn 5% commission for every new user you refer when they
//               subscribe.
//             </motion.li>
//             <motion.li variants={fadeInUp}>
//               Commissions are paid monthly after a {payoutDelay}-day delay to
//               ensure customer retention and reduce fraud.
//             </motion.li>
//           </ol>
//         </motion.section>

//         {/* Slider and CurrencyTicker */}
//         <motion.section>
//           <h2 className="mb-4 text-3xl font-semibold">
//             How Many Users Will You Refer?
//           </h2>
//           <p className="mb-4">
//             Use the slider below to see how much you could earn based on the
//             number of users you refer and what plan they choose.
//           </p>
//           <div className="flex items-center gap-4">
//             <Slider
//               value={[referralCount]}
//               min={1}
//               max={100}
//               step={1}
//               onValueChange={handleSliderChange}
//               className="w-full"
//             />
//             <span className="text-xl font-semibold">{referralCount} users</span>
//           </div>
//         </motion.section>

//         {/* Commission Structure Section */}
//         <motion.section>
//           <h2 className="mb-4 text-3xl font-semibold">
//             Your Estimated Earnings Based on Plan Commission
//           </h2>
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//             {pricingConfig.plans.map((plan) => (
//               <motion.div key={plan.id}>
//                 <Card className="flex flex-col items-center rounded-lg text-center shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="text-xl">{plan.name} Plan</CardTitle>
//                   </CardHeader>
//                   <CardContent className="flex flex-col items-center">
//                     <p className="flex w-full items-center gap-2 whitespace-nowrap">
//                       <span className="text-xs font-semibold">Monthly:</span>{" "}
//                       <CurrencyTicker
//                         value={calculateCommission(plan.monthlyPrice)}
//                         className="text-2xl text-primary"
//                       />{" "}
//                       USD
//                     </p>
//                     <p className="flex w-full items-center gap-2 whitespace-nowrap">
//                       <span className="text-xs font-semibold">Yearly:</span>{" "}
//                       <CurrencyTicker
//                         value={calculateCommission(plan.yearlyPrice)}
//                         className="text-2xl text-primary"
//                       />{" "}
//                       USD
//                     </p>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </motion.section>

//         {/* FAQ Section */}
//         <motion.section variants={fadeInUp}>
//           <h2 className="my-8 text-3xl font-semibold">
//             Frequently Asked Questions
//           </h2>
//           <Accordion type="single" collapsible className="w-full">
//             <AccordionItem value="item-1">
//               <AccordionTrigger>
//                 How do I join the affiliate program?
//               </AccordionTrigger>
//               <AccordionContent>
//                 To join our affiliate program, log in to your CashClips account,
//                 navigate to the Affiliate Dashboard, and click on Join Affiliate
//                 Program. Once approved, you will receive your unique affiliate
//                 link.
//               </AccordionContent>
//             </AccordionItem>
//             <AccordionItem value="item-2">
//               <AccordionTrigger>When and how do I get paid?</AccordionTrigger>
//               <AccordionContent>
//                 Commissions are paid out monthly, but only after your referrals
//                 have been active for at least {payoutDelay} days. You need to
//                 accumulate at least ${payoutThreshold} in commissions before a
//                 payout is initiated. Payments are typically processed within the
//                 first week of each month for the previous months approved
//                 commissions.
//               </AccordionContent>
//             </AccordionItem>
//             <AccordionItem value="item-3">
//               <AccordionTrigger>
//                 Are there any restrictions on how I can promote CashClips?
//               </AccordionTrigger>
//               <AccordionContent>
//                 While we encourage creativity in your promotional efforts, we
//                 have some guidelines to ensure fair promotion. These include no
//                 spamming, no misrepresentation of the product, and no bidding on
//                 CashClips-related keywords in paid ads. Please refer to our full
//                 Affiliate Terms and Conditions for more details.
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </motion.section>

//         <motion.section variants={fadeInUp} className="mt-12 text-center">
//           <h2 className="mb-4 text-3xl font-bold">Ready to Start Earning?</h2>
//           <p className="mb-6 text-xl">
//             Join our affiliate program today and start turning your influence
//             into income!
//           </p>
//           <a
//             href="https://cashclips.promotekit.com"
//             target="_blank"
//             rel="noreferrer"
//           >
//             <Button
//               variant="ringHover"
//               size="lg"
//               className="group transition-all duration-300"
//             >
//               Join the CashClips Affiliate Program
//               <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
//             </Button>
//           </a>
//         </motion.section>
//       </motion.div>
//     </DocsLayout>
//   );
// };

import { AlertCircle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import DocsLayout from "@/components/docs/docs-layout";
import Link from "next/link";
// export default AffiliatePage;
import React from "react";
import { motion } from "framer-motion";

const AffiliatePage: React.FC = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DocsLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="flex flex-col items-center justify-center space-y-8 text-center"
      >
        <motion.div variants={fadeInUp} className="space-y-4">
          <AlertCircle className="mx-auto h-16 w-16 text-primary" />
          <h1 className="text-4xl font-bold">Affiliate Program Coming Soon</h1>
          <p className="text-xl">
            We&#39;re working hard to bring you an exciting affiliate program.
            Stay tuned for updates!
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="max-w-md space-y-4">
          <p>
            Our affiliate program will offer great opportunities for you to earn
            by promoting CashClips. We&#39;re putting the finishing touches on
            it to ensure it&#39;s rewarding and easy to use.
          </p>
        </motion.div>
      </motion.div>
    </DocsLayout>
  );
};

export default AffiliatePage;
