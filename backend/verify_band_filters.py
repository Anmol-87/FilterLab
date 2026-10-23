import requests
import numpy as np
from scipy import signal

API_URL = "http://127.0.0.1:8000/design-filter"

FS = 8000
GPASS = 1.0
GSTOP = 40.0

FAMILIES = ["butter", "cheby1", "cheby2", "ellip", "fir"]

# Frequency edges for each filter type.
CONFIGS = {
    "bandpass": {
        "passband_frequency": 1000,
        "passband_frequency_2": 2000,
        "stopband_frequency": 500,
        "stopband_frequency_2": 2500,
    },
    "bandstop": {
        "passband_frequency": 500,
        "passband_frequency_2": 2500,
        "stopband_frequency": 1000,
        "stopband_frequency_2": 2000,
    },
}


def verify_filter(filter_type, family, edges):
    payload = {
        "filter_type": filter_type,
        "filter_family": family,
        "sampling_frequency": FS,
        "passband_ripple": GPASS,
        "stopband_attenuation": GSTOP,
        **edges,
    }

    response = requests.post(API_URL, json=payload, timeout=30)

    if response.status_code != 200:
        print(
            f"{filter_type:<10} {family:<8} "
            f"ERROR: HTTP {response.status_code} - "
            f"{response.text}"
        )
        return

    data = response.json()
    b = np.array(data["numerator"], dtype=float)
    a = np.array(data["denominator"], dtype=float)

    # Calculate a dense frequency response.
    frequencies, h = signal.freqz(
        b,
        a,
        worN=262144,
        fs=FS,
    )

    magnitude_db = 20 * np.log10(
        np.maximum(np.abs(h), 1e-15)
    )

    fp = edges["passband_frequency"]
    fp2 = edges["passband_frequency_2"]
    fst = edges["stopband_frequency"]
    fst2 = edges["stopband_frequency_2"]

    # Define passband and stopband regions.
    if filter_type == "bandpass":
        passband = (frequencies >= fp) & (frequencies <= fp2)
        stopband = (frequencies <= fst) | (frequencies >= fst2)
    else:
        passband = (frequencies <= fp) | (frequencies >= fp2)
        stopband = (frequencies >= fst) & (frequencies <= fst2)

    # Measure passband ripple and worst-case stopband attenuation.
    ripple = (
        np.max(magnitude_db[passband])
        - np.min(magnitude_db[passband])
    )

    attenuation = -np.max(magnitude_db[stopband])

    # FIR filters have no finite poles from their denominator
    # except the trivial denominator a = [1].
    if family == "fir":
        stable = "N/A (FIR)"
        stable_ok = True
    else:
        poles = np.roots(a)
        max_pole_radius = np.max(np.abs(poles))
        stable_ok = bool(np.all(np.abs(poles) < 1))
        stable = (
            f"YES ({max_pole_radius:.6f})"
            if stable_ok
            else f"NO ({max_pole_radius:.6f})"
        )

    ripple_ok = ripple <= GPASS + 0.05
    attenuation_ok = attenuation >= GSTOP - 0.05

    result = (
        "PASS"
        if ripple_ok and attenuation_ok and stable_ok
        else "FAIL"
    )

    print(
        f"{filter_type:<10} "
        f"{family:<8} "
        f"{ripple:>10.4f} "
        f"{attenuation:>16.4f} "
        f"{stable:<20} "
        f"{result}"
    )


print("=" * 88)
print("BAND-PASS AND BAND-STOP NUMERICAL VERIFICATION")
print("=" * 88)
print(
    f"{'Type':<10} {'Family':<8} "
    f"{'Ripple (dB)':>10} {'Attenuation (dB)':>16} "
    f"{'Stable':<20} Result"
)
print("-" * 88)

for filter_type, edges in CONFIGS.items():
    for family in FAMILIES:
        try:
            verify_filter(filter_type, family, edges)
        except Exception as exc:
            print(
                f"{filter_type:<10} {family:<8} "
                f"ERROR: {type(exc).__name__}: {exc}"
            )

print("=" * 88)
print("Verification complete.")
