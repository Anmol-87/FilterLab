import os
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from scipy import signal
import numpy as np

app = FastAPI(title="FilterLab API")

# Allow the React frontend to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        *[
            origin.strip()
            for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
            if origin.strip()
        ],
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FilterConfig(BaseModel):
    filter_type: str
    filter_family: str

    sampling_frequency: float = Field(gt=0)

    # First passband and stopband edges
    passband_frequency: float = Field(gt=0)
    stopband_frequency: float = Field(gt=0)

    # Additional edges required for band-pass and band-stop filters
    passband_frequency_2: float | None = Field(default=None, gt=0)
    stopband_frequency_2: float | None = Field(default=None, gt=0)

    # Filter specifications
    passband_ripple: float = Field(gt=0)
    stopband_attenuation: float = Field(gt=0)


@app.get("/")
def home():
    return {"message": "FilterLab backend is running!"}


@app.post("/design-filter")
def design_filter(config: FilterConfig):
    fs = config.sampling_frequency
    nyquist = fs / 2

    fp = config.passband_frequency
    fst = config.stopband_frequency
    fp2 = config.passband_frequency_2
    fst2 = config.stopband_frequency_2

    filter_type = config.filter_type
    filter_family = config.filter_family

    # Validate filter type.
    if filter_type not in {
        "lowpass", "highpass", "bandpass", "bandstop"
    }:
        raise HTTPException(
            status_code=400,
            detail="Unsupported filter type.",
        )

    # Validate filter family.
    if filter_family not in {
        "butter", "cheby1", "cheby2", "ellip", "fir"
    }:
        raise HTTPException(
            status_code=400,
            detail="Unsupported filter family.",
        )

    # Validate passband ripple and stopband attenuation.
    if not np.isfinite(config.passband_ripple) or not np.isfinite(
        config.stopband_attenuation
    ):
        raise HTTPException(
            status_code=400,
            detail="Ripple and attenuation must be finite numbers.",
        )

    # Configure low-pass and high-pass filters.
    if filter_type in {"lowpass", "highpass"}:
        if not (0 < fp < nyquist and 0 < fst < nyquist):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Frequency edges must be below the Nyquist "
                    "frequency (sampling frequency / 2)."
                ),
            )

        if filter_type == "lowpass":
            if not fp < fst:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "For a low-pass filter, the passband frequency "
                        "must be lower than the stopband frequency."
                    ),
                )

            wp = fp / nyquist
            ws = fst / nyquist
            cutoff = (fp + fst) / 2
            pass_zero = "lowpass"

        else:
            if not fp > fst:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "For a high-pass filter, the passband frequency "
                        "must be higher than the stopband frequency."
                    ),
                )

            wp = fp / nyquist
            ws = fst / nyquist
            cutoff = (fp + fst) / 2
            pass_zero = "highpass"

    # Configure band-pass and band-stop filters.
    else:
        if fp2 is None or fst2 is None:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Band-pass and band-stop filters require "
                    "passband_frequency_2 and stopband_frequency_2."
                ),
            )

        if not all(
            0 < f < nyquist
            for f in (fp, fp2, fst, fst2)
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "All frequency edges must be below the Nyquist "
                    "frequency."
                ),
            )

        if filter_type == "bandpass":
            # Ordering:
            # lower stopband < lower passband
            # < upper passband < upper stopband.
            if not fst < fp < fp2 < fst2:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Band-pass ordering must be: "
                        "stopband_frequency < passband_frequency "
                        "< passband_frequency_2 < stopband_frequency_2."
                    ),
                )

            wp = [fp / nyquist, fp2 / nyquist]
            ws = [fst / nyquist, fst2 / nyquist]

            cutoff = [
                (fst + fp) / 2,
                (fp2 + fst2) / 2,
            ]

            pass_zero = "bandpass"

        else:
            # Ordering:
            # lower passband < lower stopband
            # < upper stopband < upper passband.
            if not fp < fst < fst2 < fp2:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Band-stop ordering must be: "
                        "passband_frequency < stopband_frequency "
                        "< stopband_frequency_2 < passband_frequency_2."
                    ),
                )

            wp = [fp / nyquist, fp2 / nyquist]
            ws = [fst / nyquist, fst2 / nyquist]

            cutoff = [
                (fp + fst) / 2,
                (fst2 + fp2) / 2,
            ]

            pass_zero = "bandstop"

    try:
        if filter_family == "fir":
            # Estimate the narrowest transition width.
            if filter_type in {"lowpass", "highpass"}:
                transition_width = abs(fst - fp)
            else:
                transition_width = min(
                    abs(fp - fst),
                    abs(fp2 - fst2),
                )

            normalized_width = transition_width / nyquist

            if not 0 < normalized_width < 1:
                raise ValueError("Invalid transition-band width.")

            # Add a safety margin to the requested attenuation.
            design_attenuation = (
                config.stopband_attenuation + 5
            )

            num_taps, beta = signal.kaiserord(
                design_attenuation,
                normalized_width,
            )

            # Odd tap count for a Type I linear-phase FIR.
            if num_taps % 2 == 0:
                num_taps += 1

            b = signal.firwin(
                num_taps,
                cutoff,
                window=("kaiser", beta),
                fs=fs,
                pass_zero=pass_zero,
            )

            a = np.array([1.0])

        else:
            # Design the requested IIR filter.
            b, a = signal.iirdesign(
                wp=wp,
                ws=ws,
                gpass=config.passband_ripple,
                gstop=config.stopband_attenuation,
                ftype=filter_family,
                output="ba",
            )

        # Calculate filter order.
        order = max(len(a), len(b)) - 1

        # Calculate the frequency response.
        frequencies, response = signal.freqz(
            b,
            a,
            worN=2048,
            fs=fs,
        )

        magnitude_db = 20 * np.log10(
            np.maximum(np.abs(response), 1e-10)
        )

        phase = np.unwrap(np.angle(response))

        # Calculate zeros, poles, and gain.
        zeros, poles, gain = signal.tf2zpk(b, a)

        # Save coefficients for the signal-filtering endpoint.
        app.state.filter_coefficients = {
            "b": b.tolist(),
            "a": a.tolist(),
        }

        return {
            "filter_type": filter_type,
            "filter_family": filter_family,
            "order": int(order),
            "sampling_frequency": fs,
            "numerator": b.tolist(),
            "denominator": a.tolist(),
            "frequency_response": {
                "frequency": frequencies.tolist(),
                "magnitude_db": magnitude_db.tolist(),
                "phase_radians": phase.tolist(),
            },
            "poles": [
                {
                    "real": float(p.real),
                    "imag": float(p.imag),
                }
                for p in poles
            ],
            "zeros": [
                {
                    "real": float(z.real),
                    "imag": float(z.imag),
                }
                for z in zeros
            ],
            "gain": float(gain),
        }

    except (ValueError, TypeError, FloatingPointError) as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Filter design failed: {str(exc)}",
        ) from exc


@app.post("/filter-signal")
async def filter_signal_file(file: UploadFile = File(...)):
    try:
        # Accept CSV files only.
        if not file.filename or not file.filename.lower().endswith(".csv"):
            raise HTTPException(
                status_code=400,
                detail="Please upload a CSV file.",
            )

        # Read the uploaded file.
        contents = await file.read()

        if not contents.strip():
            raise HTTPException(
                status_code=400,
                detail="The uploaded CSV file is empty.",
            )

        # Read numerical samples.
        samples = np.loadtxt(
            contents.splitlines(),
            delimiter=",",
            ndmin=1,
        )

        # Require a single column of signal samples.
        if samples.ndim != 1:
            raise HTTPException(
                status_code=400,
                detail="CSV must contain one column of numerical samples.",
            )

        # Require at least two samples.
        if len(samples) < 2:
            raise HTTPException(
                status_code=400,
                detail="The signal must contain at least two samples.",
            )

        # Reject NaN and infinite values.
        if not np.all(np.isfinite(samples)):
            raise HTTPException(
                status_code=400,
                detail="Signal samples must be finite numbers.",
            )

        # Ensure that a filter has already been designed.
        if not hasattr(app.state, "filter_coefficients"):
            raise HTTPException(
                status_code=400,
                detail="Please design a filter before filtering a signal.",
            )

        b = app.state.filter_coefficients["b"]
        a = app.state.filter_coefficients["a"]

        # Apply the designed filter.
        filtered = signal.lfilter(b, a, samples)

        return {
            "original_signal": samples.tolist(),
            "filtered_signal": filtered.tolist(),
            "number_of_samples": len(samples),
        }

    except HTTPException:
        raise

    except (ValueError, UnicodeDecodeError) as exc:
        raise HTTPException(
            status_code=400,
            detail=(
                "Could not read the CSV. Use one column of numerical samples."
            ),
        ) from exc

    finally:
        await file.close()