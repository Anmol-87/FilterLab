import { useState } from "react";
import Plot from "react-plotly.js";
import { filterSignal } from "../services/filterService";

function SignalFilter({ filterDetails }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    setFile(null);
    setResult(null);
    setError("");

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  }

  async function handleFilterSignal() {
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await filterSignal(file);

      if (
        !Array.isArray(data.original_signal) ||
        !Array.isArray(data.filtered_signal)
      ) {
        throw new Error("The server returned invalid signal data.");
      }

      if (data.original_signal.length !== data.filtered_signal.length) {
        throw new Error("Original and filtered signal lengths do not match.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to filter the signal.");
    } finally {
      setLoading(false);
    }
  }

  function downloadFilteredSignal() {
    if (
      !result ||
      !Array.isArray(result.original_signal) ||
      !Array.isArray(result.filtered_signal)
    ) {
      setError("Please filter a signal before downloading results.");
      return;
    }

    const csvEscape = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = [];

    // Safely retrieve filter information.
    const details = filterDetails || {};

    const getValue = (...values) =>
      values.find(
        (value) => value !== undefined && value !== null && value !== "",
      );

    const addSection = (title, dataRows) => {
      rows.push([title]);
      rows.push(...dataRows);
      rows.push([]);
    };

    // 1. Filter design details.
    addSection("FILTER DESIGN DETAILS", [
      ["Parameter", "Value"],
      [
        "Filter Type",
        getValue(details.filter_type, details.filterType) ?? "Not available",
      ],
      [
        "Filter Family",
        getValue(details.filter_family, details.filterFamily) ??
          "Not available",
      ],
      ["Filter Order", getValue(details.order) ?? "Not available"],
      [
        "Sampling Frequency (Hz)",
        getValue(details.sampling_frequency, details.samplingFrequency) ??
          "Not available",
      ],
      [
        "Passband Frequency (Hz)",
        getValue(details.passband_frequency, details.passbandFrequency) ??
          "Not available",
      ],
      [
        "Stopband Frequency (Hz)",
        getValue(details.stopband_frequency, details.stopbandFrequency) ??
          "Not available",
      ],
      [
        "Second Passband Frequency (Hz)",
        getValue(details.passband_frequency_2, details.passbandFrequency_2) ??
          "Not available",
      ],
      [
        "Second Stopband Frequency (Hz)",
        getValue(details.stopband_frequency_2, details.stopbandFrequency_2) ??
          "Not available",
      ],
      [
        "Passband Ripple (dB)",
        getValue(details.passband_ripple, details.passbandRipple) ??
          "Not available",
      ],
      [
        "Stopband Attenuation (dB)",
        getValue(details.stopband_attenuation, details.stopbandAttenuation) ??
          "Not available",
      ],
    ]);

    // 2. Numerator coefficients.
    const numerator = details.numerator;
    rows.push(["NUMERATOR COEFFICIENTS"]);
    rows.push(["Coefficient", "Value"]);

    if (Array.isArray(numerator)) {
      numerator.forEach((value, index) => {
        rows.push([`b${index}`, value]);
      });
    } else {
      rows.push(["Status", "Not available"]);
    }

    rows.push([]);

    // 3. Denominator coefficients.
    const denominator = details.denominator;
    rows.push(["DENOMINATOR COEFFICIENTS"]);
    rows.push(["Coefficient", "Value"]);

    if (Array.isArray(denominator)) {
      denominator.forEach((value, index) => {
        rows.push([`a${index}`, value]);
      });
    } else {
      rows.push(["Status", "Not available"]);
    }

    rows.push([]);

    // 4. Signal statistics.
    const original = result.original_signal;
    const filtered = result.filtered_signal;

    const getStatistics = (values) => {
      const numbers = values.map(Number).filter(Number.isFinite);

      if (numbers.length === 0) {
        return {
          count: 0,
          min: "Not available",
          max: "Not available",
          mean: "Not available",
          rms: "Not available",
        };
      }

      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      const mean =
        numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
      const rms = Math.sqrt(
        numbers.reduce((sum, value) => sum + value * value, 0) / numbers.length,
      );

      return {
        count: numbers.length,
        min,
        max,
        mean,
        rms,
      };
    };

    const originalStats = getStatistics(original);
    const filteredStats = getStatistics(filtered);

    addSection("SIGNAL STATISTICS", [
      ["Metric", "Original Signal", "Filtered Signal"],
      ["Number of Samples", originalStats.count, filteredStats.count],
      ["Minimum", originalStats.min, filteredStats.min],
      ["Maximum", originalStats.max, filteredStats.max],
      ["Mean", originalStats.mean, filteredStats.mean],
      ["RMS Amplitude", originalStats.rms, filteredStats.rms],
    ]);

    // 5. All original and filtered samples.
    rows.push(["SIGNAL DATA"]);
    rows.push(["Sample Index", "Original Signal", "Filtered Signal"]);

    original.forEach((value, index) => {
      rows.push([index, value, filtered[index] ?? "Not available"]);
    });

    const csvContent = rows
      .map((row) => row.map(csvEscape).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "filtered_signal_complete_results.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setError("");
  }

  const sampleIndices = result
    ? result.original_signal.map((_, index) => index)
    : [];

  const chartLayout = {
    autosize: true,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: {
      color: "currentColor",
    },
    margin: {
      l: 55,
      r: 20,
      t: 45,
      b: 55,
    },
    xaxis: {
      title: "Sample Index",
      gridcolor: "rgba(128,128,128,0.2)",
    },
    yaxis: {
      title: "Amplitude",
      gridcolor: "rgba(128,128,128,0.2)",
    },
  };

  return (
    <section className="signal-filter">
      <h2>Signal Filtering</h2>

      <p>
        Upload a CSV file containing one column of numerical signal samples.
      </p>

      <div className="signal-upload">
        <input type="file" accept=".csv" onChange={handleFileChange} />

        <button
          type="button"
          onClick={handleFilterSignal}
          disabled={!file || loading}
        >
          {loading ? "Filtering..." : "Filter Signal"}
        </button>
      </div>

      {file && <p className="selected-file">Selected file: {file.name}</p>}

      {error && (
        <p className="signal-error" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="signal-result">
          <h3>Filtering Successful!</h3>

          <p>Number of samples: {result.number_of_samples}</p>

          <div className="signal-chart">
            <Plot
              data={[
                {
                  x: sampleIndices,
                  y: result.original_signal,
                  type: "scatter",
                  mode: "lines+markers",
                  name: "Original Signal",
                  line: { color: "#3b82f6", width: 2 },
                  marker: { size: 5 },
                },
              ]}
              layout={{
                ...chartLayout,
                title: "Original Signal",
              }}
              useResizeHandler
              style={{ width: "100%", height: "350px" }}
              config={{ responsive: true, displaylogo: false }}
            />
          </div>

          <div className="signal-chart">
            <Plot
              data={[
                {
                  x: sampleIndices,
                  y: result.filtered_signal,
                  type: "scatter",
                  mode: "lines+markers",
                  name: "Filtered Signal",
                  line: { color: "#10b981", width: 2 },
                  marker: { size: 5 },
                },
              ]}
              layout={{
                ...chartLayout,
                title: "Filtered Signal",
              }}
              useResizeHandler
              style={{ width: "100%", height: "350px" }}
              config={{ responsive: true, displaylogo: false }}
            />
          </div>

          <button
            type="button"
            onClick={downloadFilteredSignal}
            className="download-signal-button"
            disabled={loading}
          >
            Download Complete Results (CSV)
          </button>
        </div>
      )}
    </section>
  );
}

export default SignalFilter;
