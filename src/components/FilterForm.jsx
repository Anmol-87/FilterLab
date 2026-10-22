function FilterForm({ config, setConfig, onDesign, loading }) {
  function handleChange(event) {
    const { name, value } = event.target;

    setConfig((previousConfig) => ({
      ...previousConfig,
      [name]: value,
    }));
  }

  const isBandFilter =
    config.filterType === "bandpass" || config.filterType === "bandstop";

  return (
    <section className="panel configuration">
      <div className="panel-heading">
        <div>
          <h3>Filter Configuration</h3>
          <p>Define your design specifications.</p>
        </div>

        <span className="step-badge">01</span>
      </div>

      {/* Filter Type */}
      <div className="form-group">
        <label htmlFor="filterType">Response Type</label>

        <select
          id="filterType"
          name="filterType"
          value={config.filterType}
          onChange={handleChange}
        >
          <option value="lowpass">Low-pass</option>
          <option value="highpass">High-pass</option>
          <option value="bandpass">Band-pass</option>
          <option value="bandstop">Band-stop</option>
        </select>
      </div>

      {/* Filter Family */}
      <div className="form-group">
        <label htmlFor="filterFamily">Filter Family</label>

        <select
          id="filterFamily"
          name="filterFamily"
          value={config.filterFamily}
          onChange={handleChange}
        >
          <option value="butter">Butterworth IIR</option>
          <option value="cheby1">Chebyshev I</option>
          <option value="cheby2">Chebyshev II</option>
          <option value="ellip">Elliptic IIR</option>
          <option value="fir">FIR - Window Method</option>
        </select>
      </div>

      {/* Sampling Frequency */}
      <div className="form-group">
        <label htmlFor="samplingFrequency">Sampling Frequency (Hz)</label>

        <input
          id="samplingFrequency"
          name="samplingFrequency"
          type="number"
          min="1"
          value={config.samplingFrequency}
          onChange={handleChange}
        />
      </div>

      <div className="form-divider"></div>

      <h4 className="section-title">Frequency Specifications</h4>

      {/* Band-pass and Band-stop frequency fields */}
      {isBandFilter ? (
        <>
          <div className="form-group">
            <label htmlFor="stopbandFrequency">Lower Stopband Edge (Hz)</label>

            <input
              id="stopbandFrequency"
              name="stopbandFrequency"
              type="number"
              min="0"
              value={config.stopbandFrequency}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="passbandFrequency">Lower Passband Edge (Hz)</label>

            <input
              id="passbandFrequency"
              name="passbandFrequency"
              type="number"
              min="0"
              value={config.passbandFrequency}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="passbandFrequency2">Upper Passband Edge (Hz)</label>

            <input
              id="passbandFrequency2"
              name="passbandFrequency_2"
              type="number"
              min="0"
              value={config.passbandFrequency_2}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stopbandFrequency2">Upper Stopband Edge (Hz)</label>

            <input
              id="stopbandFrequency2"
              name="stopbandFrequency_2"
              type="number"
              min="0"
              value={config.stopbandFrequency_2}
              onChange={handleChange}
            />
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="passbandFrequency">Passband Edge (Hz)</label>

            <input
              id="passbandFrequency"
              name="passbandFrequency"
              type="number"
              min="0"
              value={config.passbandFrequency}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stopbandFrequency">Stopband Edge (Hz)</label>

            <input
              id="stopbandFrequency"
              name="stopbandFrequency"
              type="number"
              min="0"
              value={config.stopbandFrequency}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <div className="input-row">
        <div className="form-group">
          <label htmlFor="passbandRipple">Ripple (dB)</label>

          <input
            id="passbandRipple"
            name="passbandRipple"
            type="number"
            min="0.01"
            step="0.1"
            value={config.passbandRipple}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="stopbandAttenuation">Attenuation (dB)</label>

          <input
            id="stopbandAttenuation"
            name="stopbandAttenuation"
            type="number"
            min="0.1"
            step="1"
            value={config.stopbandAttenuation}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="design-button" onClick={onDesign} disabled={loading}>
        {loading ? "Designing..." : "Design Filter"}
        <span aria-hidden="true">→</span>
      </button>

      <p className="form-note">
        Configure your specifications and calculate the filter response.
      </p>
    </section>
  );
}

export default FilterForm;
