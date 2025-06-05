import { motion } from "framer-motion";

export function HelloGlow() {
    return (
        <>
            <motion.div
                className="hello flex flex-wrap justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {[...Array(20)].map((_, i) => (
                    <span
                        key={i}
                        className={i === 0 ? "start" : i === 19 ? "end" : ""}
                        style={{ "--i": i + 1 } as React.CSSProperties}
                    />
                ))}
            </motion.div>
        </>
    );
}