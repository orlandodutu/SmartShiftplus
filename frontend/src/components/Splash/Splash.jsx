import "./splash.css"

function SmartShiftMark() {
  return (
    <svg
      width="76"
      height="76"
      viewBox="0 0 76 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="g1" x1="12" y1="10" x2="64" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(34,211,238,1)" />
          <stop offset="0.55" stopColor="rgba(96,165,250,1)" />
          <stop offset="1" stopColor="rgba(226,232,240,1)" />
        </linearGradient>
      </defs>
      <path
        d="M38 6C20.327 6 6 20.327 6 38s14.327 32 32 32 32-14.327 32-32S55.673 6 38 6Z"
        stroke="url(#g1)"
        strokeWidth="2.2"
        opacity="0.9"
      />
      <path
        d="M24 40.2c6.4-9.4 15-15.3 28-16.4"
        stroke="url(#g1)"
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M28 52c7.5-0.4 16.2-5.2 22.8-14.2"
        stroke="url(#g1)"
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity="0.95"
      />
      <circle cx="52" cy="24" r="3.2" fill="rgba(34,211,238,0.95)" />
      <circle cx="28" cy="52" r="3.2" fill="rgba(96,165,250,0.95)" />
    </svg>
  )
}

export default function Splash({ label = "SmartShift" }) {
  return (
    <div className="splash" role="status" aria-label={`${label} in avvio`}>
      <div className="splashInner">
        <div className="markWrap">
          <div className="markGlow" />
          <div className="mark">
            <SmartShiftMark />
          </div>
          <div className="markShine" />
        </div>
        <div className="brand">
          <div className="brandName">{label}</div>
          <div className="brandTag">Pianificazione turni • Calendario • Stampa</div>
        </div>
      </div>
    </div>
  )
}

