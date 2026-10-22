import { motion } from "motion/react";

const stages = [
  {
    number: "01",
    title: "INPUT SIGNAL",
    subtitle: "Raw samples",
    type: "input",
  },
  {
    number: "02",
    title: "FILTER ENGINE",
    subtitle: "Digital processing",
    type: "engine",
  },
  {
    number: "03",
    title: "OUTPUT SIGNAL",
    subtitle: "Filtered samples",
    type: "output",
  },
];

const STATUS_LABELS = {
  idle: "AWAITING DESIGN",
  processing: "PROCESSING",
  designed: "FILTER DESIGNED",
  error: "DESIGN FAILED",
};

function SignalTrace({ type }) {
  const paths = {
    input:
      "M0 35 L8 35 L13 12 L18 58 L23 22 L28 44 L33 8 L38 62 L43 29 L48 35 L56 35 L61 15 L66 55 L71 23 L76 43 L81 11 L86 59 L91 35 L100 35",

    engine:
      "M0 35 C10 35 10 12 20 12 S30 58 40 58 S50 23 60 23 S70 43 80 43 S90 35 100 35",

    output:
      "M0 35 C8 35 10 25 18 25 S28 45 38 45 S48 28 58 28 S68 40 78 40 S90 35 100 35",
  };

  return (
    <svg
      className="signal-trace"
      viewBox="0 0 100 70"
      preserveAspectRatio="none"
      role="img"
      aria-label={`${type} signal waveform illustration`}
    >
      <defs>
        <linearGradient id={`trace-${type}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5685ff" />
          <stop offset="100%" stopColor="#36d9ff" />
        </linearGradient>
      </defs>

      <path
        d="M0 35 H100"
        stroke="rgba(145,160,181,0.2)"
        strokeWidth="0.6"
        strokeDasharray="2 3"
      />

      <motion.path
        d={paths[type]}
        fill="none"
        stroke={`url(#trace-${type})`}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.2,
        }}
      />
    </svg>
  );
}

function FlowConnector({ delay = 0 }) {
  return (
    <div className="flow-connector" aria-hidden="true">
      <div className="flow-line" />

      <motion.span
        className="flow-particle"
        animate={{
          left: ["0%", "100%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.8,
          delay,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <span className="flow-arrow">›</span>
    </div>
  );
}

function SignalFlow({ status = "idle", filterType = "lowpass" }) {
  const statusLabel = STATUS_LABELS[status] ?? STATUS_LABELS.idle;

  return (
    <motion.section
      className="signal-flow-panel"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-labelledby="signal-flow-title"
    >
      {/* Pipeline heading */}
      <div className="signal-flow-heading">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-marker" />
            SYSTEM OVERVIEW
          </p>

          <h3 id="signal-flow-title">Signal processing pipeline</h3>

          <p className="signal-flow-description">
            From sampled input to a digitally filtered output.
          </p>

          <p className="active-filter-type">
            ACTIVE CONFIGURATION
            <span>{filterType.toUpperCase()}</span>
          </p>
        </div>

        <motion.div
          key={status}
          className={`pipeline-live pipeline-${status}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          role="status"
          aria-live="polite"
        >
          <span className="status-dot" />
          {statusLabel}
        </motion.div>
      </div>

      {/* Pipeline stages */}
      <div className="signal-flow-grid">
        {stages.map((stage, index) => (
          <div className="signal-flow-item" key={stage.type}>
            <motion.article
              className={`flow-stage flow-stage-${stage.type}`}
              whileHover={{
                y: -4,
                borderColor: "rgba(54,217,255,0.45)",
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="flow-stage-top">
                <span className="flow-stage-number">{stage.number}</span>
                <span className="flow-stage-indicator" />
              </div>

              <SignalTrace type={stage.type} />

              <div className="flow-stage-bottom">
                <h4>{stage.title}</h4>
                <p>{stage.subtitle}</p>
              </div>
            </motion.article>

            {index < stages.length - 1 && <FlowConnector delay={index * 0.8} />}
          </div>
        ))}
      </div>

      {/* Pipeline legend */}
      <div className="signal-flow-footer">
        <span>
          <span className="legend-dot legend-input" />
          SIGNAL ACQUISITION
        </span>

        <span>
          <span className="legend-dot legend-engine" />
          DIGITAL PROCESSING
        </span>

        <span>
          <span className="legend-dot legend-output" />
          FILTERED RESPONSE
        </span>
      </div>
    </motion.section>
  );
}

export default SignalFlow;
