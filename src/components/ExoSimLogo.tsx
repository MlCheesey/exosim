type ExoSimLogoProps = {
  className?: string;
};

export default function ExoSimLogo({
  className = "",
}: ExoSimLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-label="ExoSim logo"
      role="img"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient
          id="exosim-star"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(35 27) rotate(90) scale(15)"
        >
          <stop stopColor="#FFF1BD" />
          <stop offset="0.42" stopColor="#F8B84E" />
          <stop offset="1" stopColor="#D85A1B" />
        </radialGradient>

        <linearGradient
          id="exosim-orbit"
          x1="7"
          y1="27"
          x2="58"
          y2="27"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F8B84E" stopOpacity="0" />
          <stop offset="0.22" stopColor="#F8B84E" />
          <stop offset="0.78" stopColor="#F8B84E" />
          <stop offset="1" stopColor="#F8B84E" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M7 27C13 17 24 11 35 11C46 11 55 17 59 27"
        stroke="url(#exosim-orbit)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M7 27C13 37 24 43 35 43C46 43 55 37 59 27"
        stroke="url(#exosim-orbit)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 4"
        opacity="0.55"
      />

      <circle
        cx="35"
        cy="27"
        r="13.5"
        fill="url(#exosim-star)"
      />

      <circle
        cx="26"
        cy="27"
        r="5.5"
        fill="#050607"
        stroke="#F6C36D"
        strokeWidth="1"
      />

      <path
        d="M10 52H22L25 56H33L36 52H54"
        stroke="#EE8C91"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="26"
        cy="27"
        r="8"
        stroke="#F8B84E"
        strokeOpacity="0.18"
      />
    </svg>
  );
}
