import Plot from "react-plotly.js";

function ResponseCharts({ result }) {
  const frequency = result.frequency_response.frequency;
  const magnitude = result.frequency_response.magnitude_db;

  const phase = result.frequency_response.phase_radians.map(
    (value) => (value * 180) / Math.PI,
  );

  // Extract pole coordinates
  const poleReal = (result.poles || []).map((pole) => pole.real);
  const poleImag = (result.poles || []).map((pole) => pole.imag);

  // Extract zero coordinates
  const zeroReal = (result.zeros || []).map((zero) => zero.real);
  const zeroImag = (result.zeros || []).map((zero) => zero.imag);

  // Generate points for the unit circle
  const circleAngles = Array.from(
    { length: 361 },
    (_, index) => (index * Math.PI) / 180,
  );

  const circleReal = circleAngles.map((angle) => Math.cos(angle));
  const circleImag = circleAngles.map((angle) => Math.sin(angle));

  // Shared styling for all charts
  const commonLayout = {
    paper_bgcolor: "#090d11",
    plot_bgcolor: "#090d11",

    font: {
      family: "SFMono-Regular, Consolas, monospace",
      size: 11,
      color: "#9aa5b1",
    },

    margin: {
      l: 65,
      r: 25,
      t: 65,
      b: 60,
    },

    autosize: true,

    title: {
      font: {
        family: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        size: 15,
        color: "#e8edf2",
      },
      x: 0.04,
      xanchor: "left",
      y: 0.96,
      yanchor: "top",
    },

    hoverlabel: {
      bgcolor: "#11171e",
      bordercolor: "#4fdcff",
      font: {
        family: "SFMono-Regular, Consolas, monospace",
        size: 11,
        color: "#e8edf2",
      },
    },

    legend: {
      font: {
        size: 10,
        color: "#9aa5b1",
      },
      bgcolor: "rgba(9,13,17,0.85)",
      borderwidth: 0,
    },
  };

  // Shared axis styling
  const commonAxis = {
    gridcolor: "rgba(255,255,255,0.07)",
    linecolor: "rgba(255,255,255,0.14)",
    linewidth: 1,
    zerolinecolor: "rgba(79,220,255,0.22)",
    zerolinewidth: 1,
    tickfont: {
      size: 10,
      color: "#7e8994",
    },
    title: {
      font: {
        size: 11,
        color: "#9aa5b1",
      },
      standoff: 12,
    },
    showline: true,
    mirror: false,
  };

  const commonConfig = {
    responsive: true,
    displaylogo: false,
    scrollZoom: false,
    modeBarButtonsToRemove: ["lasso2d", "select2d"],
  };

  return (
    <section className="charts-section">
      <h2>Filter Response Analysis</h2>

      {/* Magnitude Response */}
      <div className="chart-card">
        <Plot
          data={[
            {
              x: frequency,
              y: magnitude,
              type: "scatter",
              mode: "lines",
              name: "Magnitude",
              line: {
                color: "#4fdcff",
                width: 2,
              },
              hovertemplate:
                "Frequency: %{x:.4g} Hz" +
                "<br>Magnitude: %{y:.3f} dB" +
                "<extra></extra>",
            },
          ]}
          layout={{
            ...commonLayout,
            title: {
              ...commonLayout.title,
              text: "Magnitude Response",
            },
            xaxis: {
              ...commonAxis,
              title: { ...commonAxis.title, text: "Frequency (Hz)" },
            },
            yaxis: {
              ...commonAxis,
              title: { ...commonAxis.title, text: "Magnitude (dB)" },
            },
            height: 350,
          }}
          useResizeHandler
          style={{ width: "100%", display: "block" }}
          config={commonConfig}
        />
      </div>

      {/* Phase Response */}
      <div className="chart-card">
        <Plot
          data={[
            {
              x: frequency,
              y: phase,
              type: "scatter",
              mode: "lines",
              name: "Phase",
              line: {
                color: "#64a8ff",
                width: 2,
              },
              hovertemplate:
                "Frequency: %{x:.4g} Hz" +
                "<br>Phase: %{y:.3f}°" +
                "<extra></extra>",
            },
          ]}
          layout={{
            ...commonLayout,
            title: {
              ...commonLayout.title,
              text: "Phase Response",
            },
            xaxis: {
              ...commonAxis,
              title: { ...commonAxis.title, text: "Frequency (Hz)" },
            },
            yaxis: {
              ...commonAxis,
              title: { ...commonAxis.title, text: "Phase (degrees)" },
            },
            height: 350,
          }}
          useResizeHandler
          style={{ width: "100%", display: "block" }}
          config={commonConfig}
        />
      </div>

      {/* Pole-Zero Plot */}
      <div className="chart-card">
        <Plot
          data={[
            {
              x: circleReal,
              y: circleImag,
              type: "scatter",
              mode: "lines",
              name: "Unit Circle",
              line: {
                color: "#65717d",
                dash: "dash",
                width: 1.2,
              },
              hoverinfo: "skip",
            },
            {
              x: zeroReal,
              y: zeroImag,
              type: "scatter",
              mode: "markers",
              name: "Zeros",
              marker: {
                color: "#4fdcff",
                symbol: "circle-open",
                size: 11,
                line: {
                  color: "#4fdcff",
                  width: 2,
                },
              },
              hovertemplate:
                "Zero" +
                "<br>Real: %{x:.4f}" +
                "<br>Imaginary: %{y:.4f}" +
                "<extra></extra>",
            },
            {
              x: poleReal,
              y: poleImag,
              type: "scatter",
              mode: "markers",
              name: "Poles",
              marker: {
                color: "#ff727c",
                symbol: "x",
                size: 11,
                line: {
                  color: "#ff727c",
                  width: 2,
                },
              },
              hovertemplate:
                "Pole" +
                "<br>Real: %{x:.4f}" +
                "<br>Imaginary: %{y:.4f}" +
                "<extra></extra>",
            },
          ]}
          layout={{
            ...commonLayout,
            title: {
              ...commonLayout.title,
              text: "Pole-Zero Plot",
            },
            xaxis: {
              ...commonAxis,
              title: { ...commonAxis.title, text: "Real" },
              zeroline: true,
              scaleanchor: "y",
              scaleratio: 1,
              range: [-1.5, 1.5],
            },
            yaxis: {
              ...commonAxis,
              title: { ...commonAxis.title, text: "Imaginary" },
              zeroline: true,
              range: [-1.5, 1.5],
            },
            height: 450,
            legend: {
              ...commonLayout.legend,
              orientation: "h",
              x: 0.5,
              xanchor: "center",
              y: -0.18,
            },
          }}
          useResizeHandler
          style={{ width: "100%", display: "block" }}
          config={commonConfig}
        />
      </div>
    </section>
  );
}

export default ResponseCharts;
