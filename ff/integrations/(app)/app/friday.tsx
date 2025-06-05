import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Added import for Shadcn UI Button

export function Friday() {
    const [isFridayActive, setIsFridayActive] = useState(false);

    const lineElements = Array.from({ length: 25 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    };

    const glassVariants = {
        hidden: { height: "0vh", opacity: 0 },
        visible: { height: "100vh", opacity: 1, transition: { duration: 0.7, ease: "easeInOut" } },
    };

    return (
        <>
            <Button
                onClick={() => setIsFridayActive(!isFridayActive)}
                aria-label={isFridayActive ? "Deactivate Friday Effect" : "Activate Friday Effect"}
            >
                {isFridayActive ? "Deactivate" : "Activate"} Friday Effect
            </Button>

            <AnimatePresence>
                {isFridayActive && (
                    <>
                        <motion.div
                            className="friday-top"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            {lineElements.map((_, i) => (
                                <span style={{ "--i": i + 1 } as React.CSSProperties} key={`top-${i}`}></span>
                            ))}
                        </motion.div>
                        <motion.div
                            className="friday-bottom"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            {lineElements.map((_, i) => (
                                <span style={{ "--i": i + 1 } as React.CSSProperties} key={`bottom-${i}`}></span>
                            ))}
                        </motion.div>
                        <motion.div
                            className="friday-left"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            {lineElements.map((_, i) => (
                                <span style={{ "--i": i + 1 } as React.CSSProperties} key={`left-${i}`}></span>
                            ))}
                        </motion.div>
                        <motion.div
                            className="friday-right"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            {lineElements.map((_, i) => (
                                <span style={{ "--i": i + 1 } as React.CSSProperties} key={`right-${i}`}></span>
                            ))}
                        </motion.div>

                        <motion.div
                            className="glass-effect-div"
                            variants={glassVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
