/// src/components/ui/Sparkline.tsx

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

/** Dependency-free SVG trend line. Color via `className` (uses currentColor). */
export function Sparkline({
  data,
  width = 120,
  height = 32,
  className = '',
}: SparklineProps) {
  if (data.length < 2) {
    return (
      <svg width={width} height={height} className={className} aria-hidden="true">
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={1}
          strokeDasharray="2 3"
        />
      </svg>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const areaPoints = [
    `${pad},${height - pad}`,
    ...points,
    `${(width - pad).toFixed(1)},${height - pad}`,
  ].join(' ');

  return (
    <svg width={width} height={height} className={className} aria-hidden="true">
      <polygon points={areaPoints} fill="currentColor" opacity={0.08} />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
