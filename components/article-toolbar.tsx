"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Languages,
  ZoomIn,
  Share2,
  TextSelect,
  Volume2,
  Settings,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ToolbarFeature {
  icon: React.JSX.Element;
  label: string;
  content?: string;
}

const toolbarFeatures = [
  {
    icon: <Languages className="h-4 w-4 stroke-[2px]" />,
    label: "Translate",
  },
  {
    icon: <TextSelect className="h-4 w-4 stroke-[2px]" />,
    label: "Summarize",
  },
  {
    icon: <Volume2 className="h-4 w-4 stroke-[2px]" />,
    label: "Text to Speech",
  },
  { icon: <Share2 className="h-4 w-4 stroke-[2px]" />, label: "Share" },
  {
    icon: <ZoomIn className="h-4 w-4 stroke-[2px]" />,
    label: "Magnify",
  },
];

export function DynamicToolbar() {
  const [toolbarState, setToolbarState] = useState("initial");
  const [selectedFeature, setSelectedFeature] = useState<null | ToolbarFeature>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const setToolbarStateWithAnimation = (
    newState: string,
    feature: ToolbarFeature | null = null,
  ) => {
    setIsAnimating(true);
    if (newState === "final" && feature === selectedFeature) {
      setToolbarState("intermediate");
      setSelectedFeature(null);
    } else {
      setToolbarState(newState);
      setSelectedFeature(feature);
    }
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  const backgroundVariants = {
    initial: {
      width: "48px",
      height: "48px",
      borderRadius: "9999px",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        borderRadius: { delay: 0.15 },
      },
    },
    intermediate: {
      width: "270px",
      height: "48px",
      borderRadius: "16px",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        borderRadius: { delay: 0.15 },
      },
    },
    final: {
      width: "320px",
      height: "270px",
      borderRadius: "16px",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        borderRadius: { delay: 0 },
      },
    },
  };

  const contentVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.03, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  const finalStateVariants = {
    initial: { height: 0, opacity: 0 },
    animate: {
      height: "222px",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  const featureContentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.2 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="dark fixed bottom-4 left-1/2 -translate-x-1/2 transform overflow-hidden"
      initial="initial"
      animate={toolbarState}
      variants={backgroundVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onAnimationComplete={handleAnimationComplete}
    >
      <motion.div
        className="dark absolute inset-0 bg-[#141414] shadow-lg shadow-black/40 dark:bg-[#191919]"
        initial="initial"
        animate={toolbarState}
        variants={backgroundVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      <motion.div
        className="relative flex h-full w-full flex-col items-center justify-end text-white"
        initial="initial"
        animate={toolbarState}
        variants={backgroundVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          {toolbarState === "final" && selectedFeature && (
            <motion.div
              key="final"
              className="absolute bottom-12 left-0 right-0 overflow-hidden border-t border-accent bg-[#141414] dark:bg-[#191919]"
              variants={finalStateVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div
                className="dark flex items-center justify-between border-b border-accent p-2 px-1"
                variants={itemVariants}
              >
                <span className="pl-2.5 text-sm font-semibold">
                  {selectedFeature.label}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setToolbarStateWithAnimation("intermediate")}
                  className="mr-1 h-6 w-6 rounded-full bg-transparent p-1 focus:bg-accent focus:outline-none focus:ring-2"
                  aria-label="Close feature panel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFeature.label}
                  className="flex w-full flex-col px-2 pt-2"
                  variants={featureContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <span className="px-2 py-1.5 text-xs text-accent-foreground opacity-50">
                    {selectedFeature.label} Options
                  </span>
                  <motion.div
                    className="mt-2 rounded-md bg-accent/20 p-4"
                    variants={itemVariants}
                  >
                    <p className="text-sm">{selectedFeature.content}</p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className={cn(
            `absolute bottom-0 left-0 right-0 flex h-12 items-center justify-between ${
              toolbarState === "final"
                ? "rounded-b-2xl border-t border-accent"
                : ""
            } ${toolbarState === "initial" ? "" : "px-2"} `,
          )}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <AnimatePresence mode="wait">
            {toolbarState === "initial" ? (
              <motion.button
                key="settings"
                onClick={() => setToolbarStateWithAnimation("intermediate")}
                className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Expand toolbar"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Settings className="h-[18px] w-[18px]" />
              </motion.button>
            ) : (
              <motion.div
                key="intermediate"
                className="flex w-full items-center justify-between rounded-b-2xl"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {toolbarFeatures.map((feature, index) => (
                  <motion.button
                    key={feature.label}
                    onClick={() =>
                      setToolbarStateWithAnimation("final", feature)
                    }
                    className={`rounded-full p-2 text-white focus:bg-accent focus:outline-none ${
                      selectedFeature === feature ? "bg-accent" : ""
                    }`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={feature.label}
                  >
                    {feature.icon}
                  </motion.button>
                ))}
                <div className="dark -mr-1 h-7 w-px border-2 border-l border-border" />
                <motion.button
                  onClick={() => setToolbarStateWithAnimation("initial")}
                  className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Collapse toolbar"
                  variants={itemVariants}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
