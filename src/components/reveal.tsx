"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function WordReveal({
  children,
  className,
  as = "h1",
}: {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  const words = children.split(" ");

  return (
    <Component
      className={cn("text-balance", className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : 0.045 } },
      }}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: reduced ? 0 : "105%", opacity: reduced ? 1 : 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && "\u00a0"}
        </span>
      ))}
    </Component>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
