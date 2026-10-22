import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

import Header from "./Header";

const features = [
  {
    number: "01",
    icon: "⌁",
    title: "Digital Filter Design",
    description:
      "Design low-pass, high-pass, band-pass, and band-stop filters using your desired specifications.",
    tag: "DESIGN ENGINE",
  },
  {
    number: "02",
    icon: "ƒ",
    title: "Coefficient Analysis",
    description:
      "Explore the filter coefficients and understand the mathematical structure behind your design.",
    tag: "MATHEMATICAL MODEL",
  },
  {
    number: "03",
    icon: "〰",
    title: "Frequency Response",
    description:
      "Visualize magnitude and phase responses to understand how your filter behaves across frequencies.",
    tag: "SIGNAL ANALYSIS",
  },
  {
    number: "04",
    icon: "◎",
    title: "Pole-Zero Analysis",
    description:
      "Inspect poles and zeros to understand filter stability and frequency-selective behavior.",
    tag: "SYSTEM ANALYSIS",
  },
];

const workflow = [
  {
    number: "01",
    title: "Configure",
    description:
      "Choose the filter type, family, sampling frequency, and design specifications.",
  },
  {
    number: "02",
    title: "Calculate",
    description:
      "Generate the digital filter from your selected design parameters.",
  },
  {
    number: "03",
    title: "Analyze",
    description:
      "Explore the response plots and evaluate the characteristics of your filter.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function SignalVisual({ reduceMotion }) {
  const inputPoints = Array.from({ length: 101 }, (_, i) => {
    const x = i * 4;
    const y = 62 - Math.sin(i * 0.42) * 28;

    return `${x},${y}`;
  }).join(" ");

  const outputPoints = Array.from({ length: 101 }, (_, i) => {
    const x = i * 4;
    const y = 88 - Math.sin(i * 0.15) * 15 - Math.sin(i * 0.3) * 4;

    return `${x},${y}`;
  }).join(" ");

  return (
    <motion.div
      className="landing-visual-card"
      initial={reduceMotion ? false : { opacity: 0, x: 45, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 1,
        delay: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="visual-card-header">
        <div>
          <span className="visual-overline">LIVE VISUALIZATION</span>
          <h3>Signal transformation</h3>
        </div>

        <div className="visual-live-status">
          <span className="landing-live-dot" />
          LIVE
        </div>
      </div>

      <div className="visual-chart">
        <div className="chart-label chart-label-input">
          <span className="chart-legend-dot input-dot" />
          Input signal
        </div>

        <div className="chart-label chart-label-output">
          <span className="chart-legend-dot output-dot" />
          Filtered signal
        </div>

        <svg
          className="landing-signal-visual"
          viewBox="0 0 400 125"
          preserveAspectRatio="none"
          role="img"
          aria-label="Illustrative input and filtered signal waveforms"
        >
          {[20, 40, 60, 80, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="400"
              y2={y}
              stroke="rgba(145,170,195,0.12)"
              strokeDasharray="3 5"
            />
          ))}

          <line
            x1="0"
            y1="62"
            x2="400"
            y2="62"
            stroke="rgba(145,170,195,0.2)"
          />

          {/* Animated input signal */}
          <polyline
            className={`signal-line signal-line-input${reduceMotion ? " signal-line-static" : ""}`}
            points={inputPoints}
            fill="none"
            stroke="#4fdcff"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray="8 5"
          />

          {/* Animated filtered signal */}
          <polyline
            className={`signal-line signal-line-output${reduceMotion ? " signal-line-static" : ""}`}
            points={outputPoints}
            fill="none"
            stroke="#43e69a"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray="8 5"
          />
        </svg>

        <div className="chart-axis-labels">
          <span>0 Hz</span>
          <span>Frequency →</span>
          <span>Nyquist</span>
        </div>
      </div>

      <div className="visual-metrics">
        <div className="visual-metric">
          <span className="metric-label">PROCESSING</span>
          <strong>DSP</strong>
          <span className="metric-caption">Digital signal</span>
        </div>

        <div className="visual-metric">
          <span className="metric-label">DESIGN MODE</span>
          <strong>FIR / IIR</strong>
          <span className="metric-caption">Filter structures</span>
        </div>

        <div className="visual-metric">
          <span className="metric-label">ANALYSIS</span>
          <strong>2D + 3D</strong>
          <span className="metric-caption">Response views</span>
        </div>
      </div>

      <motion.div
        className="visual-orbit"
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <span />
      </motion.div>
    </motion.div>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const launchDesigner = () => {
    navigate("/designer");
  };

  const reveal = reduceMotion
    ? {}
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.15 },
      };

  return (
    <div className="landing-page">
      {/* HEADER */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Header />
      </motion.div>

      <main>
        {/* HERO SECTION */}
        <section className="landing-hero">
          <div className="landing-container hero-grid">
            <motion.div
              className="hero-copy"
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.16,
                    delayChildren: 0.12,
                  },
                },
              }}
            >
              <motion.div className="hero-badge" variants={fadeUp}>
                <span className="badge-indicator" />
                <span>SIGNAL PROCESSING ENVIRONMENT</span>
                <span className="badge-version">SP—02</span>
              </motion.div>

              <motion.h1 variants={fadeUp}>
                Design filters.
                <br />
                <span className="hero-title-accent">Shape signals.</span>
              </motion.h1>

              <motion.p className="hero-description" variants={fadeUp}>
                A workspace for designing digital filters, exploring frequency
                responses, and understanding the mathematics behind signal
                processing.
              </motion.p>

              <motion.div className="hero-actions" variants={fadeUp}>
                <motion.button
                  type="button"
                  className="landing-button primary-cta"
                  onClick={launchDesigner}
                  whileHover={reduceMotion ? {} : { y: -3, scale: 1.02 }}
                  whileTap={reduceMotion ? {} : { scale: 0.97 }}
                >
                  Start designing
                  <span aria-hidden="true">↗</span>
                </motion.button>

                <motion.a
                  className="landing-button secondary-cta"
                  href="#features"
                  whileHover={reduceMotion ? {} : { y: -3 }}
                  whileTap={reduceMotion ? {} : { scale: 0.98 }}
                >
                  Explore features
                  <span aria-hidden="true">↓</span>
                </motion.a>
              </motion.div>

              <motion.div className="hero-footnote" variants={fadeUp}>
                <span className="footnote-line" />
                <span>FROM SPECIFICATIONS TO SIGNAL RESPONSE</span>
              </motion.div>
            </motion.div>

            {/* ANIMATED SIGNAL VISUAL */}
            <div className="hero-visual-wrapper">
              <SignalVisual reduceMotion={reduceMotion} />
            </div>

            <motion.div
              className="hero-side-label"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <span>FIG. 01</span>
              <span>DIGITAL SIGNAL ANALYSIS</span>
            </motion.div>
          </div>

          <div className="hero-bottom-line">
            <span>ENGINEERED FOR EXPLORATION</span>
            <span>FILTER DESIGN / RESPONSE / ANALYSIS</span>
          </div>
        </section>

        {/* FEATURE INTRODUCTION */}
        <section className="landing-section features-section" id="features">
          <div className="landing-container">
            <motion.div
              className="section-heading"
              {...reveal}
              variants={fadeUp}
            >
              <div>
                <p className="section-eyebrow">
                  <span /> CAPABILITIES
                </p>

                <h2>
                  Everything you need.
                  <br />
                  <span>One signal workspace.</span>
                </h2>
              </div>

              <p className="section-description">
                Move from filter specifications to meaningful visual analysis
                with tools built for digital signal processing.
              </p>
            </motion.div>

            <div className="landing-feature-grid">
              {features.map((feature, index) => (
                <motion.article
                  className="landing-feature-card"
                  key={feature.number}
                  initial={reduceMotion ? false : { opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.65,
                    delay: reduceMotion ? 0 : index * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={
                    reduceMotion
                      ? {}
                      : { y: -7, transition: { duration: 0.25 } }
                  }
                >
                  <div className="feature-card-top">
                    <span className="feature-number">/ {feature.number}</span>

                    <motion.span
                      className="feature-icon"
                      whileHover={
                        reduceMotion ? {} : { rotate: 8, scale: 1.08 }
                      }
                    >
                      {feature.icon}
                    </motion.span>
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <div className="feature-card-bottom">
                    <span>{feature.tag}</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW SECTION */}
        <section className="landing-section workflow-section" id="workflow">
          <div className="landing-container">
            <motion.div
              className="workflow-heading"
              {...reveal}
              variants={fadeUp}
            >
              <p className="section-eyebrow">
                <span /> HOW IT WORKS
              </p>

              <h2>
                From parameters
                <br />
                <span>to performance.</span>
              </h2>

              <p>
                A clear workflow that takes you from configuration to filter
                analysis.
              </p>
            </motion.div>

            <div className="workflow-grid">
              {workflow.map((step, index) => (
                <motion.div
                  className="workflow-step"
                  key={step.number}
                  initial={reduceMotion ? false : { opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.65,
                    delay: reduceMotion ? 0 : index * 0.15,
                  }}
                >
                  <div className="workflow-step-top">
                    <span className="workflow-number">{step.number}</span>

                    <motion.span
                      className="workflow-arrow"
                      animate={reduceMotion ? {} : { x: [0, 5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                      }}
                    >
                      →
                    </motion.span>
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="landing-section final-cta-section">
          <div className="landing-container">
            <motion.div
              className="final-cta"
              initial={reduceMotion ? false : { opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              <div className="cta-decoration cta-decoration-one" />
              <div className="cta-decoration cta-decoration-two" />

              <div className="final-cta-content">
                <p className="section-eyebrow">
                  <span /> READY TO BEGIN?
                </p>

                <h2>
                  Your next filter
                  <br />
                  starts <span>here.</span>
                </h2>

                <p className="final-cta-description">
                  Configure your specifications and start exploring the behavior
                  of digital filters.
                </p>

                <motion.button
                  type="button"
                  className="landing-button primary-cta"
                  onClick={launchDesigner}
                  whileHover={reduceMotion ? {} : { y: -3, scale: 1.02 }}
                  whileTap={reduceMotion ? {} : { scale: 0.97 }}
                >
                  Open filter designer
                  <span aria-hidden="true">↗</span>
                </motion.button>
              </div>

              <motion.div
                className="cta-orbit-mark"
                animate={reduceMotion ? {} : { rotate: 360 }}
                transition={{
                  duration: 35,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="cta-orbit-inner">
                  <span>SP</span>
                  <span>02</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <motion.footer
        className="landing-footer"
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="landing-container footer-content">
          <div className="footer-brand">
            <span className="footer-brand-mark">F.</span>

            <div>
              <strong>FilterLab</strong>
              <span>SP02 DIGITAL FILTER DESIGN</span>
            </div>
          </div>

          <p>Designed for signal processing exploration.</p>

          <button
            type="button"
            className="footer-top-button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth",
              })
            }
          >
            Back to top ↑
          </button>
        </div>
      </motion.footer>
    </div>
  );
}

export default LandingPage;
