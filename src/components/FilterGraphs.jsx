import { useLocation, useNavigate } from "react-router-dom";
import ResponseCharts from "./ResponseCharts";

function FilterGraphs() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;

  if (!result) {
    return (
      <main className="filter-graphs-page">
        <div className="filter-graphs-empty">
          <span className="section-index">NO ANALYSIS DATA</span>

          <h1>No filter analysis available</h1>

          <p>
            Return to the filter designer and design a filter before opening the
            graphs.
          </p>

          <button
            type="button"
            className="back-to-analysis-button"
            onClick={() => navigate("/")}
          >
            ← Back to Filter Design
          </button>
        </div>
      </main>
    );
  }

  const samplingFrequency = Number(result.sampling_frequency);

  return (
    <main className="filter-graphs-page">
      <header className="filter-graphs-header">
        <div className="filter-graphs-title">
          <span className="section-index">SIGNAL CHARACTERISTICS</span>

          <h1>Filter Response Analysis</h1>

          <p>
            Explore the magnitude response, phase response, and pole-zero plot
            of your digital filter.
          </p>
        </div>

        <button
          type="button"
          className="back-to-analysis-button"
          onClick={() => navigate("/")}
        >
          ← Back to Filter Design
        </button>
      </header>

      <section className="filter-graphs-summary">
        <div className="filter-graphs-summary-card">
          <span>FILTER TYPE</span>
          <strong>{String(result.filter_type ?? "—").toUpperCase()}</strong>
        </div>

        <div className="filter-graphs-summary-card">
          <span>FILTER FAMILY</span>
          <strong>{String(result.filter_family ?? "—").toUpperCase()}</strong>
        </div>

        <div className="filter-graphs-summary-card">
          <span>FILTER ORDER</span>
          <strong>{result.order ?? "—"}</strong>
        </div>

        <div className="filter-graphs-summary-card">
          <span>SAMPLING RATE</span>
          <strong>
            {Number.isFinite(samplingFrequency)
              ? samplingFrequency.toLocaleString("en-US")
              : "—"}{" "}
            Hz
          </strong>
        </div>
      </section>

      <section className="filter-graphs-content">
        <div className="filter-graphs-section-heading">
          <span className="section-index">RESPONSE PLOTS</span>

          <h2>Graphical Analysis</h2>

          <p>
            Interactive graphs generated from your filter design. Hover over a
            graph to inspect its values.
          </p>
        </div>

        <ResponseCharts result={result} />
      </section>
    </main>
  );
}

export default FilterGraphs;
