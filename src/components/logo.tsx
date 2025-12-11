interface VisionWishdomLogoProps {
  className?: string;
  usePrimary?: boolean;
  mono?: boolean;
  monoFillClass?: string;
  lightColor?: string;
  darkColor?: string;
}

export function VisionWishdomLogo({
  className = "",
  usePrimary = false,
  mono = false,
  monoFillClass = "fill-foreground",
  lightColor = "#2e3192",
  darkColor = "#6b7bff",
}: VisionWishdomLogoProps) {
  const fillClass = mono
    ? monoFillClass
    : usePrimary
      ? "fill-primary"
      : "fill-[var(--logo-color-light)] dark:fill-[var(--logo-color-dark)]";
  return (
    <svg
      className={className}
      viewBox="0 0 492.53732 410.33734"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse" id="clipPath626">
          <path
            d="M 0,307.753 H 369.403 V 0 H 0 Z"
            transform="translate(-307.20576,-97.2707)"
          />
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse" id="clipPath628">
          <path
            d="M 0,307.753 H 369.403 V 0 H 0 Z"
            transform="translate(-246.03876)"
          />
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse" id="clipPath630">
          <path
            d="M 0,307.753 H 369.403 V 0 H 0 Z"
            transform="translate(-232.26801,-77.453704)"
          />
        </clipPath>
      </defs>
      <g transform="translate(-26154.14)">
        <path
          className={fillClass}
          style={
            !usePrimary
              ? ({
                  "--logo-color-light": lightColor,
                  "--logo-color-dark": darkColor,
                } as React.CSSProperties)
              : undefined
          }
          d="m 0,0 -43.677,-7.658 -4.611,26.311 c -2.899,16.535 -11.421,31.474 -23.995,42.061 -22.439,18.896 -56.574,22.581 -84.94,9.171 -27.703,-13.098 -43.366,-38.85 -42.971,-70.649 0.01,-0.868 0.031,-1.751 0.063,-2.627 l 2.521,-70.919 -31.252,-1.113 -9.692,-0.344 c -1.166,0.787 -2.318,1.59 -3.459,2.407 -18.057,12.941 -33.262,29.675 -44.392,48.951 -13.609,23.569 -20.801,50.486 -20.801,77.839 0,21.034 4.124,41.451 12.26,60.682 7.85,18.565 19.088,35.233 33.396,49.541 14.309,14.307 30.977,25.545 49.542,33.395 19.231,8.136 39.648,12.26 60.68,12.26 v -44.342 c -61.502,0 -111.536,-50.034 -111.536,-111.536 0,-22.532 6.588,-43.848 18.539,-61.792 l -0.12,3.394 c -0.045,1.218 -0.074,2.449 -0.089,3.657 -0.16,12.937 1.466,25.46 4.829,37.221 3.235,11.316 8.091,21.973 14.432,31.677 11.856,18.147 28.833,32.805 49.097,42.385 10.399,4.915 21.472,8.418 32.912,10.405 11.455,1.991 23.071,2.43 34.521,1.303 24.373,-2.399 46.859,-11.753 65.022,-27.048 20.524,-17.283 34.413,-41.547 39.107,-68.323 z"
          transform="matrix(1.3333333,0,0,-1.3333333,26563.745,280.64307)"
          clipPath="url(#clipPath626)"
        />
        <path
          className={fillClass}
          style={
            !usePrimary
              ? ({
                  "--logo-color-light": lightColor,
                  "--logo-color-dark": darkColor,
                } as React.CSSProperties)
              : undefined
          }
          d="M 0,0 C -4.157,0 -8.307,0.203 -12.436,0.61 -36.81,3.009 -59.294,12.362 -77.458,27.657 -97.983,44.94 -111.871,69.204 -116.566,95.98 l -4.613,26.31 43.676,7.657 4.612,-26.31 c 2.9,-16.536 11.421,-31.474 23.994,-42.061 22.44,-18.896 56.575,-22.581 84.941,-9.17 27.703,13.098 43.365,38.848 42.972,70.648 -0.011,0.867 -0.032,1.75 -0.064,2.627 l -0.011,0.48 -2.523,180.974 44.337,0.618 2.52,-180.742 c 0.039,-1.139 0.065,-2.285 0.079,-3.411 0.16,-12.937 -1.464,-25.46 -4.828,-37.221 C 115.29,75.064 110.434,64.406 104.094,54.703 92.237,36.555 75.26,21.899 54.997,12.319 44.597,7.402 33.524,3.9 22.085,1.912 14.761,0.638 7.37,0 0,0"
          transform="matrix(1.3333333,0,0,-1.3333333,26482.189,410.33733)"
          clipPath="url(#clipPath628)"
        />
        <path
          className={fillClass}
          style={
            !usePrimary
              ? ({
                  "--logo-color-light": lightColor,
                  "--logo-color-dark": darkColor,
                } as React.CSSProperties)
              : undefined
          }
          d="m 0,0 v 0 c -23.824,6.321 -38.014,30.758 -31.693,54.582 v 0 0 C -7.869,48.261 6.321,23.824 0,0 Z"
          transform="matrix(1.3333333,0,0,-1.3333333,26463.828,307.06573)"
          clipPath="url(#clipPath630)"
        />
      </g>
    </svg>
  );
}
