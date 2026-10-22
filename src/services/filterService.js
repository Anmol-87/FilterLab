const API_BASE_URL = "http://127.0.0.1:8000";

export async function designFilter(config) {
  const response = await fetch(`${API_BASE_URL}/design-filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter_type: config.filterType,
      filter_family: config.filterFamily,
      sampling_frequency: Number(config.samplingFrequency),

      // Primary frequency edges
      passband_frequency: Number(config.passbandFrequency),
      stopband_frequency: Number(config.stopbandFrequency),

      // Additional edges for band-pass and band-stop
      passband_frequency_2:
        config.passbandFrequency_2 === "" || config.passbandFrequency_2 == null
          ? null
          : Number(config.passbandFrequency_2),

      stopband_frequency_2:
        config.stopbandFrequency_2 === "" || config.stopbandFrequency_2 == null
          ? null
          : Number(config.stopbandFrequency_2),

      // Filter specifications
      passband_ripple: Number(config.passbandRipple),
      stopband_attenuation: Number(config.stopbandAttenuation),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Filter design failed.");
  }

  return data;
}

export async function filterSignal(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/filter-signal`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to filter the signal.");
  }

  return data;
}
