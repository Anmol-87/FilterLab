import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import FilterForm from "./components/FilterForm";
import AnalysisPanel from "./components/AnalysisPanel";
import SignalFilter from "./components/SignalFilter";
import SignalFlow from "./components/SignalFlow";
import FilterGraphs from "./components/FilterGraphs";

import { designFilter } from "./services/filterService";

import "./App.css";

const INITIAL_CONFIG = {
  filterType: "lowpass",
  filterFamily: "butter",
  samplingFrequency: 8000,
  passbandFrequency: 1000,
  stopbandFrequency: 1500,
  passbandRipple: 1,
  stopbandAttenuation: 40,
  passbandFrequency_2: 2000,
  stopbandFrequency_2: 2500,
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================
   FILTER DESIGNER PAGE
========================================= */

function HomePage() {
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState("idle");

  async function handleDesign() {
    setLoading(true);
    setError("");
    setResult(null);
    setPipelineStatus("processing");

    try {
      const data = await designFilter(config);

      setResult({
        ...data,
        passband_ripple: config.passbandRipple,
        stopband_attenuation: config.stopbandAttenuation,
        passband_frequency: config.passbandFrequency,
        stopband_frequency: config.stopbandFrequency,
        passband_frequency_2: config.passbandFrequency_2,
        stopband_frequency_2: config.stopbandFrequency_2,
      });

      setPipelineStatus("designed");
    } catch (err) {
      setError(
        err.message || "Something went wrong while designing the filter.",
      );
      setPipelineStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      {/* Animated header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Header />
      </motion.div>

      <main className="dashboard">
        {/* Page heading */}
        <motion.section
          className="page-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div>
            <p className="eyebrow">
              <span className="eyebrow-marker" />
              SIGNAL PROCESSING WORKSPACE
            </p>

            <h2>
              Design your{" "}
              <span className="heading-accent">digital filter.</span>
            </h2>

            <p className="subtitle">
              Configure your specifications and analyze the filter response.
            </p>
          </div>

          <motion.div
            className="heading-index"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span>MODULE</span>
            <strong>SP—02</strong>
            <span>FILTER DESIGN</span>
          </motion.div>
        </motion.section>

        {/* Signal pipeline */}
        <SignalFlow status={pipelineStatus} filterType={config.filterType} />

        {/* Filter configuration and analysis */}
        <motion.div
          className="workspace"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.14,
                delayChildren: 0.18,
              },
            },
          }}
        >
          <motion.div variants={fadeUp}>
            <FilterForm
              config={config}
              setConfig={setConfig}
              onDesign={handleDesign}
              loading={loading}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <AnalysisPanel result={result} error={error} config={config} />
          </motion.div>
        </motion.div>

        {/* Independent signal upload and filtering */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          <SignalFilter filterDetails={result} />
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="footer"
          initial={{ opacity: 0 }}
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span>FilterLab · SP02 Digital Filter Design</span>
          <span>Built for signal processing</span>
        </motion.footer>
      </main>
    </div>
  );
}

/* =========================================
   PAGE TRANSITION WRAPPER
========================================= */

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -8,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================
   ROUTE TRANSITIONS
========================================= */

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <LandingPage />
            </AnimatedPage>
          }
        />

        <Route
          path="/designer"
          element={
            <AnimatedPage>
              <HomePage />
            </AnimatedPage>
          }
        />

        <Route
          path="/filter-graphs"
          element={
            <AnimatedPage>
              <FilterGraphs />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

/* =========================================
   MAIN APP
========================================= */

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
