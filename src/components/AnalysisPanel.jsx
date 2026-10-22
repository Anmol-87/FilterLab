import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

function formatCoefficient(value, digits = 6) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return String(value);
  }

  return number.toExponential(digits);
}

function MetricCard({ label, value, unit, index }) {
  return (
    <motion.div
      className="result-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
    >
      <span className="result-card-label">{label}</span>
      <strong>{value ?? "—"}</strong>
      {unit && <span className="result-card-unit">{unit}</span>}
    </motion.div>
  );
}

function CoefficientSection({ title, symbol, coefficients }) {
  if (!Array.isArray(coefficients)) {
    return null;
  }

  return (
    <div className="coefficients-section">
      <span className="section-index">COEFFICIENT DATA</span>

      <div className="coefficients-heading">
        <h3>{title}</h3>
        <span className="coefficient-count">{coefficients.length} VALUES</span>
      </div>

      {coefficients.length === 0 ? (
        <p className="analysis-muted">No coefficients available.</p>
      ) : (
        <div className="coefficient-list">
          {coefficients.map((coefficient, index) => (
            <motion.div
              className="coefficient-row"
              key={`${symbol}-${index}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.2,
                delay: Math.min(index * 0.015, 0.3),
              }}
            >
              <span className="coefficient-index">
                {symbol}[{index}]
              </span>

              <code>{formatCoefficient(coefficient)}</code>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalysisPanel({ result, error, config }) {
  const navigate = useNavigate();

  function downloadCoefficients() {
    if (
      !result ||
      !Array.isArray(result.numerator) ||
      !Array.isArray(result.denominator)
    ) {
      return;
    }

    const csvEscape = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = [
      ["Filter Design Report", ""],
      [],
      ["Filter Specifications", "Value"],
      ["Filter Type", result.filter_type],
      ["Filter Family", result.filter_family],
      ["Sampling Frequency (Hz)", result.sampling_frequency],
      ["Filter Order", result.order],
      ["Passband Ripple (dB)", result.passband_ripple],
      ["Stopband Attenuation (dB)", result.stopband_attenuation],
      ["Passband Frequency (Hz)", result.passband_frequency],
      ["Stopband Frequency (Hz)", result.stopband_frequency],
      ["Second Passband Frequency (Hz)", result.passband_frequency_2],
      ["Second Stopband Frequency (Hz)", result.stopband_frequency_2],
      [],
      ["Numerator Coefficients (b)"],
      ["Index", "Coefficient"],
      ...result.numerator.map((value, index) => [index, value]),
      [],
      ["Denominator Coefficients (a)"],
      ["Index", "Coefficient"],
      ...result.denominator.map((value, index) => [index, value]),
    ];

    const csvContent = rows
      .map((row) => row.map(csvEscape).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "filter_coefficients.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Error state
  if (error) {
    return (
      <section className="analysis-panel">
        <div className="analysis-heading">
          <div>
            <span className="section-index">DESIGN STATUS</span>
            <h2>Analysis Results</h2>
          </div>

          <span className="analysis-status analysis-status-error">
            <span className="status-dot" />
            DESIGN FAILED
          </span>
        </div>

        <div className="analysis-state analysis-state-error" role="alert">
          <span className="analysis-state-icon">!</span>

          <div>
            <h3>Unable to design filter</h3>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!result) {
    return (
      <section className="analysis-panel">
        <div className="analysis-heading">
          <div>
            <span className="section-index">DESIGN OUTPUT</span>
            <h2>Filter Analysis</h2>
          </div>

          <span className="analysis-status">
            <span className="status-dot" />
            STANDBY
          </span>
        </div>

        <div className="analysis-state">
          <div className="empty-state-visual" aria-hidden="true">
            <span>b</span>
            <span className="empty-state-divider">/</span>
            <span>a</span>
          </div>

          <h3>Your analysis starts here</h3>

          <p>
            Configure your filter specifications and select{" "}
            <strong>Design Filter</strong> to calculate the coefficients and
            visualize its frequency response.
          </p>

          <div className="empty-state-tags">
            <span>COEFFICIENTS</span>
            <span>FREQUENCY RESPONSE</span>
            <span>PHASE RESPONSE</span>
          </div>
        </div>
      </section>
    );
  }

  const filterType = result.filter_type ?? "—";
  const filterFamily = result.filter_family ?? "—";
  const samplingFrequency = Number(result.sampling_frequency);
  const order = result.order;

  return (
    <section className="analysis-panel">
      {/* Analysis heading */}
      <div className="analysis-heading">
        <div>
          <span className="section-index">DESIGN OUTPUT</span>
          <h2>Filter Analysis</h2>

          <p className="analysis-description">
            Calculated parameters and digital filter coefficients.
          </p>
        </div>

        <span className="analysis-status analysis-status-success">
          <span className="status-dot" />
          DESIGN COMPLETE
        </span>
      </div>

      {/* Filter metrics */}
      <div className="result-cards">
        <MetricCard label="FILTER ORDER" value={order ?? "—"} index={0} />

        <MetricCard
          label="SAMPLING RATE"
          value={
            Number.isFinite(samplingFrequency)
              ? samplingFrequency.toLocaleString("en-US")
              : "—"
          }
          unit="Hz"
          index={1}
        />

        <MetricCard
          label="FILTER TYPE"
          value={String(filterType).toUpperCase()}
          index={2}
        />

        <MetricCard
          label="FILTER FAMILY"
          value={String(filterFamily).toUpperCase()}
          index={3}
        />
      </div>

      {/* Implementation details */}
      <div className="analysis-config-strip">
        <span className="config-strip-label">IMPLEMENTATION</span>

        <span className="config-strip-value">
          {String(filterFamily).toUpperCase()} DIGITAL FILTER
        </span>

        <span className="config-strip-divider" />

        <span className="config-strip-label">REALIZATION</span>

        <span className="config-strip-value">IIR / FIR COEFFICIENTS</span>
      </div>

      {/* Numerator and denominator */}
      <div className="coefficient-sections">
        <CoefficientSection
          title="Numerator coefficients"
          symbol="b"
          coefficients={result.numerator}
        />

        <CoefficientSection
          title="Denominator coefficients"
          symbol="a"
          coefficients={result.denominator}
        />
      </div>

      {/* Download and graph actions in one row */}
      <div className="show-graphs-container filter-actions-row">
        <div className="show-graphs-text">
          <span className="section-index">FILTER ACTIONS</span>
          <h3>Export coefficients or explore graphs</h3>

          <p>
            Download the filter specifications and coefficients, or view the
            magnitude, phase, and pole-zero graphs.
          </p>
        </div>

        <div className="filter-action-buttons">
          <button
            type="button"
            className="show-graphs-button"
            onClick={downloadCoefficients}
            disabled={
              !Array.isArray(result.numerator) ||
              !Array.isArray(result.denominator)
            }
          >
            DOWNLOAD COEFFICIENTS
            <span aria-hidden="true">↓</span>
          </button>

          <button
            type="button"
            className="show-graphs-button"
            onClick={() => {
              navigate("/filter-graphs", {
                state: { result },
              });
            }}
          >
            SHOW GRAPHS
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default AnalysisPanel;
