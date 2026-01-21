interface SacredGeometryProps {
  className?: string;
}

export function SacredGeometry({ className = '' }: SacredGeometryProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`opacity-10 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      {/* Flower of Life pattern */}
      <g className="animate-spin-slow" style={{ transformOrigin: 'center' }}>
        {/* Central circle */}
        <circle cx="200" cy="200" r="50" />
        
        {/* Six surrounding circles */}
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const x = 200 + 50 * Math.cos((angle * Math.PI) / 180);
          const y = 200 + 50 * Math.sin((angle * Math.PI) / 180);
          return <circle key={angle} cx={x} cy={y} r="50" />;
        })}
        
        {/* Outer ring of circles */}
        {[30, 90, 150, 210, 270, 330].map((angle) => {
          const x = 200 + 86.6 * Math.cos((angle * Math.PI) / 180);
          const y = 200 + 86.6 * Math.sin((angle * Math.PI) / 180);
          return <circle key={angle} cx={x} cy={y} r="50" />;
        })}
      </g>
      
      {/* Outer containing circle */}
      <circle cx="200" cy="200" r="150" strokeWidth="1" className="opacity-30" />
      <circle cx="200" cy="200" r="180" strokeWidth="0.5" className="opacity-20" />
    </svg>
  );
}
