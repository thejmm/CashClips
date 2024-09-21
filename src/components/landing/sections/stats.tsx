// src/components/landing/sections/stats.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import NumberTicker from "@/components/ui/number-ticker";
import { createClient } from "@/utils/supabase/component";

const supabase = createClient();

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [userCount, setUserCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // Fetch user count
      const { data: userCountData, error: userCountError } = await supabase
        .from("user_count")
        .select("count")
        .single();

      if (userCountError) {
        console.error("Error fetching user count:", userCountError);
      } else {
        setUserCount(userCountData.count);
      }

      // Fetch project count
      const { count: projectCountData, error: projectCountError } =
        await supabase
          .from("projects")
          .select("id", { count: "exact", head: true });

      if (projectCountError) {
        console.error("Error fetching project count:", projectCountError);
      } else {
        setProjectCount(projectCountData || 0);
      }
    }

    fetchData();
  }, []);

  const stats = [
    { value: userCount, label: "Active Users" },
    { value: projectCount, label: "Websites Created" },
    { value: 100, label: "Components & Sections" },
    { value: 99, label: "Uptime" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section id="stats" ref={ref}>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          className="text-center space-y-4 mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.h3
            className="text-4xl md:text-5xl font-bold mb-2 text-balance max-w-3xl mx-auto tracking-tight"
            variants={itemVariants}
          >
            Empowering Creators Worldwide
          </motion.h3>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Join millions in bringing their ideas to life with BuildFlow
          </motion.p>
        </motion.div>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border-none shadow-none">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-4xl md:text-5xl font-bold text-primary">
                      <NumberTicker
                        value={stat.value}
                        className="tabular-nums"
                      />
                      {stat.label === "Active Users" && "+"}
                      {stat.label === "Websites Created" && "+"}
                      {stat.label === "Components & Sections" && "+"}
                      {stat.label === "Uptime" && "%"}
                    </div>
                    <span className="text-sm md:text-base font-medium text-muted-foreground mt-2">
                      {stat.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
