import { useEffect, useState } from "react";

function Header() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-GB", {
    hour12: false,
  });

  return (
    <header className="topbar">
      {/* Ambient background */}
      <div className="header-glow" aria-hidden="true" />
      <div className="header-grid" aria-hidden="true" />

      {/* BRAND */}
      <div className="brand">
        <div className="brand-icon">
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path
              d="M5 24H12L17 11L24 37L31 16L36 24H43"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="5" cy="24" r="2" fill="currentColor" />
            <circle cx="43" cy="24" r="2" fill="currentColor" />
          </svg>
        </div>

        <div className="brand-copy">
          <h1>
            FILTER<span>LAB</span>
          </h1>

          <div className="brand-subtitle">
            <span className="brand-indicator" />
            DIGITAL SIGNAL PROCESSING
          </div>
        </div>
      </div>

      {/* LIVE SIGNAL DISPLAY */}
      <div className="header-signal">
        <div className="signal-caption">
          <span className="signal-caption-dot" />
          SIGNAL MONITOR
        </div>

        <div className="signal-display">
          <svg
            className="signal-waveform"
            viewBox="0 0 240 52"
            preserveAspectRatio="none"
            fill="none"
            aria-label="Decorative signal waveform"
            role="img"
          >
            <defs>
              <linearGradient
                id="signalGradient"
                x1="0"
                y1="0"
                x2="240"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#4fdcff" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#4fdcff" />
                <stop offset="100%" stopColor="#43e69a" />
              </linearGradient>

              <linearGradient
                id="signalFill"
                x1="0"
                y1="0"
                x2="0"
                y2="52"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#4fdcff" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#4fdcff" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              className="signal-area"
              d="M0 26 C10 26 10 8 20 8 S30 44 40 44 S50 26 60 26 S70 12 80 12 S90 39 100 39 S110 26 120 26 S130 5 140 5 S150 46 160 46 S170 26 180 26 S190 14 200 14 S210 35 220 35 S230 26 240 26 V52 H0 Z"
              fill="url(#signalFill)"
            />

            <path
              className="signal-wave-line"
              d="M0 26 C10 26 10 8 20 8 S30 44 40 44 S50 26 60 26 S70 12 80 12 S90 39 100 39 S110 26 120 26 S130 5 140 5 S150 46 160 46 S170 26 180 26 S190 14 200 14 S210 35 220 35 S230 26 240 26"
              stroke="url(#signalGradient)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <circle
              className="signal-endpoint"
              cx="220"
              cy="35"
              r="3"
              fill="#43e69a"
            />
          </svg>
        </div>

        <div className="signal-footer">
          <span>
            INPUT <strong>ANALOG</strong>
          </span>
          <span className="signal-live">LIVE</span>
        </div>
      </div>

      {/* PROCESSING PIPELINE */}
      <div className="header-pipeline" aria-label="Signal processing pipeline">
        <div className="pipeline-label">PROCESSING CHAIN</div>

        <div className="pipeline-track">
          {/* Input */}
          <div className="pipeline-stage">
            <div className="pipeline-node">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 12H6L9 5L13 19L17 9L19 12H22"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span>INPUT</span>
          </div>

          {/* Filter */}
          <div className="pipeline-stage">
            <div className="pipeline-node pipeline-node-active">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 5H20M7 12H17M10 19H14"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <circle
                  cx="8"
                  cy="5"
                  r="2"
                  fill="#0a0e13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="15"
                  cy="12"
                  r="2"
                  fill="#0a0e13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="12"
                  cy="19"
                  r="2"
                  fill="#0a0e13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <span>FILTER</span>
          </div>

          {/* Output */}
          <div className="pipeline-stage">
            <div className="pipeline-node pipeline-node-output">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 12H6L9 8L13 16L17 10L19 12H22"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span>OUTPUT</span>
          </div>

          {/* One continuous animated signal path */}
          <svg
            className="pipeline-signal"
            viewBox="0 0 300 48"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <filter
                id="pipelineGlow"
                x="-200%"
                y="-200%"
                width="500%"
                height="500%"
              >
                <feGaussianBlur stdDeviation="2.5" />
              </filter>
            </defs>

            {/* Connector paths */}
            <path
              d="M25 10 H150 H275"
              className="pipeline-track-line"
              pathLength="100"
              fill="none"
            />

            {/* Glow behind the moving dot */}
            <circle
              r="5"
              fill="#4fdcff"
              opacity="0.6"
              filter="url(#pipelineGlow)"
            >
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path="M25 10 H150 H275"
                rotate="0"
              />
            </circle>

            {/* The single moving dot */}
            <circle r="3.2" fill="#4fdcff">
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path="M25 10 H150 H275"
                rotate="0"
              />
            </circle>
          </svg>
        </div>
      </div>

      {/* SYSTEM INFORMATION */}
      <div className="header-meta">
        <div className="header-clock">
          <span className="clock-label">LOCAL TIME</span>
          <span className="clock-value">{formattedTime}</span>
          <span className="clock-timezone">24-HOUR FORMAT</span>
        </div>

        <div className="header-divider" aria-hidden="true" />

        <div className="status">
          <span className="status-dot" aria-hidden="true" />

          <div className="status-copy">
            <span className="status-label">WORKSPACE</span>
            <span className="status-value">READY</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
