"use client";
import { useRef } from "react";
import Tilt from "react-parallax-tilt";
import { motion, useInView } from "framer-motion";

export default function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px 0px" });

  const renderSVG = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      className="feature-icon-svg"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );

  return (
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={1500}>
      <div ref={ref} className="feature-card">
        <motion.div
          whileHover={{ scale: 1.15 }}
          className="feature-card-icon"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.1 }}
        >
          {renderSVG()}
        </motion.div>

        <motion.h3
          className="feature-card-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h3>

        <motion.p
          className="feature-card-description"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>
      </div>
    </Tilt>
  );
}
