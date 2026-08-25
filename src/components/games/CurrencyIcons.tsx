import React from 'react';

interface CurrencyGraphicProps {
  amount?: number;
  className?: string;
  size?: number;
}

/**
 * Custom hand-coded vector SVG for PUBG Mobile UC
 * Single coin badge for smaller amounts, 2-3 stacked badges for large tiers
 */
export const PubgUcGraphic: React.FC<CurrencyGraphicProps> = ({
  amount = 60,
  className = '',
  size = 48,
}) => {
  const isLargeStack = amount >= 3000;
  const isMediumStack = amount >= 1000 && amount < 3000;

  const renderSingleUcBadge = (xOffset = 0, yOffset = 0, rotation = 0, scale = 1) => (
    <g transform={`translate(${xOffset}, ${yOffset}) rotate(${rotation} 25 25) scale(${scale})`}>
      <defs>
        <linearGradient id={`ucGoldGrad_${xOffset}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF199" />
          <stop offset="40%" stopColor="#FFC800" />
          <stop offset="85%" stopColor="#D48B00" />
          <stop offset="100%" stopColor="#804D00" />
        </linearGradient>

        <linearGradient id={`ucBevelGrad_${xOffset}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFEAA7" />
          <stop offset="100%" stopColor="#8A5200" />
        </linearGradient>

        <filter id={`ucShadow_${xOffset}`} x1="-20%" y1="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Main Badge Base */}
      <rect
        x="6"
        y="8"
        width="38"
        height="34"
        rx="7"
        ry="7"
        fill={`url(#ucGoldGrad_${xOffset})`}
        stroke="#4A2800"
        strokeWidth="1.5"
        filter={`url(#ucShadow_${xOffset})`}
      />

      {/* Inner Bevel Rim */}
      <rect
        x="8.5"
        y="10.5"
        width="33"
        height="29"
        rx="5"
        ry="5"
        fill="none"
        stroke={`url(#ucBevelGrad_${xOffset})`}
        strokeWidth="1.2"
      />

      {/* Glossy Top Highlight */}
      <path
        d="M 10 11 L 40 11 C 40 11 36 18 10 18 Z"
        fill="#FFFFFF"
        opacity="0.35"
      />

      {/* Dark Embossed Field behind Text */}
      <rect
        x="11"
        y="14"
        width="28"
        height="22"
        rx="3"
        fill="#2A1600"
        opacity="0.85"
      />

      {/* "UC" Text with Metallic Stroke */}
      <text
        x="25"
        y="30"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="17"
        letterSpacing="-0.5"
        fill="#FFEC85"
        stroke="#4A2500"
        strokeWidth="0.8"
        paintOrder="stroke fill"
      >
        UC
      </text>
    </g>
  );

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 50 50" width={size} height={size} className="overflow-visible">
        {isLargeStack ? (
          <>
            {renderSingleUcBadge(-9, 5, -14, 0.82)}
            {renderSingleUcBadge(10, 3, 12, 0.85)}
            {renderSingleUcBadge(0, -3, 0, 0.95)}
          </>
        ) : isMediumStack ? (
          <>
            {renderSingleUcBadge(-6, 3, -10, 0.88)}
            {renderSingleUcBadge(4, -2, 6, 0.95)}
          </>
        ) : (
          renderSingleUcBadge(0, 0, 0, 1)
        )}
      </svg>
    </div>
  );
};

/**
 * Custom hand-coded vector SVG for Free Fire Diamonds
 * Single crystalline diamond for smaller amounts, stacked cluster for large tiers
 */
export const FreeFireDiamondGraphic: React.FC<CurrencyGraphicProps> = ({
  amount = 100,
  className = '',
  size = 48,
}) => {
  const isLargeStack = amount >= 2000;
  const isMediumStack = amount >= 500 && amount < 2000;

  const renderSingleDiamond = (xOffset = 0, yOffset = 0, scale = 1, rotation = 0) => (
    <g transform={`translate(${xOffset}, ${yOffset}) rotate(${rotation} 25 25) scale(${scale})`}>
      <defs>
        <linearGradient id={`ffGradTop_${xOffset}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B2F7FF" />
          <stop offset="100%" stopColor="#00D2FF" />
        </linearGradient>

        <linearGradient id={`ffGradLeft_${xOffset}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A3FF" />
          <stop offset="100%" stopColor="#0057B7" />
        </linearGradient>

        <linearGradient id={`ffGradCenter_${xOffset}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38E1FF" />
          <stop offset="100%" stopColor="#0072CE" />
        </linearGradient>

        <linearGradient id={`ffGradRight_${xOffset}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066CC" />
          <stop offset="100%" stopColor="#002A66" />
        </linearGradient>

        <filter id={`ffGlow_${xOffset}`} x1="-20%" y1="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0077FF" floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter={`url(#ffGlow_${xOffset})`}>
        {/* Top Facet Crown */}
        <polygon points="14,15 25,7 36,15 25,18" fill={`url(#ffGradTop_${xOffset})`} />

        {/* Left Crown Facet */}
        <polygon points="6,21 14,15 25,18 17,25" fill={`url(#ffGradLeft_${xOffset})`} />

        {/* Center Crown Facet */}
        <polygon points="14,15 36,15 25,18" fill="#E6FCFF" opacity="0.9" />

        {/* Right Crown Facet */}
        <polygon points="36,15 44,21 33,25 25,18" fill={`url(#ffGradRight_${xOffset})`} />

        {/* Bottom Left Pavilion Facet */}
        <polygon points="6,21 17,25 25,43" fill={`url(#ffGradLeft_${xOffset})`} />

        {/* Bottom Center Pavilion Facet */}
        <polygon points="17,25 33,25 25,43" fill={`url(#ffGradCenter_${xOffset})`} />

        {/* Bottom Right Pavilion Facet */}
        <polygon points="33,25 44,21 25,43" fill={`url(#ffGradRight_${xOffset})`} />

        {/* Highlight sparkle lines */}
        <line x1="25" y1="7" x2="25" y2="18" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.8" />
        <circle cx="25" cy="18" r="1.5" fill="#FFFFFF" />
        <polygon points="14,15 18,16 16,21" fill="#FFFFFF" opacity="0.6" />
      </g>
    </g>
  );

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 50 50" width={size} height={size} className="overflow-visible">
        {isLargeStack ? (
          <>
            {renderSingleDiamond(-10, 4, 0.8, -12)}
            {renderSingleDiamond(10, 3, 0.82, 10)}
            {renderSingleDiamond(0, -3, 0.95, 0)}
          </>
        ) : isMediumStack ? (
          <>
            {renderSingleDiamond(-6, 2, 0.86, -8)}
            {renderSingleDiamond(5, -2, 0.94, 6)}
          </>
        ) : (
          renderSingleDiamond(0, 0, 1, 0)
        )}
      </svg>
    </div>
  );
};

/**
 * Custom hand-coded vector SVG for eFootball Coins
 * Single gold metallic coin with embossed 'e' emblem, stacked pile for large tiers
 */
export const EfootballCoinGraphic: React.FC<CurrencyGraphicProps> = ({
  amount = 260,
  className = '',
  size = 48,
}) => {
  const isLargeStack = amount >= 3000;
  const isMediumStack = amount >= 1000 && amount < 3000;

  const renderSingleCoin = (xOffset = 0, yOffset = 0, scale = 1, rotation = 0) => (
    <g transform={`translate(${xOffset}, ${yOffset}) rotate(${rotation} 25 25) scale(${scale})`}>
      <defs>
        <linearGradient id={`efGoldGrad_${xOffset}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF5B8" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="70%" stopColor="#DAA520" />
          <stop offset="100%" stopColor="#8B5A00" />
        </linearGradient>

        <linearGradient id={`efInnerGrad_${xOffset}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>

        <filter id={`efShadow_${xOffset}`} x1="-20%" y1="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      <g filter={`url(#efShadow_${xOffset})`}>
        {/* Outer Metallic Rim */}
        <circle
          cx="25"
          cy="25"
          r="20"
          fill={`url(#efGoldGrad_${xOffset})`}
          stroke="#5C3B00"
          strokeWidth="1.2"
        />

        {/* Inner Coin Ridge Circle */}
        <circle
          cx="25"
          cy="25"
          r="16.5"
          fill={`url(#efInnerGrad_${xOffset})`}
          stroke="#8B5A00"
          strokeWidth="1"
        />

        {/* Coin Edge Milled Grooves (Dash array ring) */}
        <circle
          cx="25"
          cy="25"
          r="18.8"
          fill="none"
          stroke="#8B5A00"
          strokeWidth="0.8"
          strokeDasharray="1.5, 1.5"
          opacity="0.7"
        />

        {/* Top Rim Metallic Specular Arc */}
        <path
          d="M 10 20 A 18 18 0 0 1 40 20 A 16 16 0 0 0 10 20 Z"
          fill="#FFFFFF"
          opacity="0.45"
        />

        {/* eFootball Iconic 'e' Logo Embossed Path */}
        <path
          d="M 28 15 C 20 15 15 19 15 25 C 15 31 20 35 28 35 C 31 35 34 34 36 32 L 34 29 C 32.5 30.5 30.5 31.5 28 31.5 C 22.5 31.5 19.5 28 19.5 25 C 19.5 22 22.5 18.5 28 18.5 C 31 18.5 33 19.5 34.5 21 L 36.5 18 C 34.5 16 31.5 15 28 15 Z M 16 24.5 L 34 24.5 L 34 22 L 16.5 22 Z"
          fill="#3D2100"
        />
        <path
          d="M 27.5 16 C 20 16 16 19.5 16 25 C 16 30.5 20 34 27.5 34 C 30.5 34 33 33 35 31.5 L 33.5 29 C 32 30.2 30 31 27.5 31 C 22.5 31 19.5 28 19.5 25 C 19.5 22 22.5 19 27.5 19 C 30 19 32 19.8 33.5 21 L 35 18.5 C 33 17 30.5 16 27.5 16 Z M 17 24 L 33 24 L 33 22.5 L 17.5 22.5 Z"
          fill="#FFFFFF"
        />
      </g>
    </g>
  );

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 50 50" width={size} height={size} className="overflow-visible">
        {isLargeStack ? (
          <>
            {renderSingleCoin(-9, 4, 0.82, -10)}
            {renderSingleCoin(9, 3, 0.85, 12)}
            {renderSingleCoin(0, -3, 0.95, 0)}
          </>
        ) : isMediumStack ? (
          <>
            {renderSingleCoin(-6, 3, 0.88, -8)}
            {renderSingleCoin(4, -2, 0.95, 6)}
          </>
        ) : (
          renderSingleCoin(0, 0, 1, 0)
        )}
      </svg>
    </div>
  );
};
