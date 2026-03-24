export default function PieChart({ data, total }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const slices = data.map((item) => {
    const dash = (item.value / total) * circumference;
    const gap = circumference - dash;
    const slice = { ...item, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 200 200" width="160" height="160" className="shrink-0">
        {slices.map((s, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth="28"
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "100px 100px",
            }}
          />
        ))}
        <text x="100" y="96" textAnchor="middle" fontSize="10" fill="#9b7a87">
          Total
        </text>
        <text
          x="100"
          y="113"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#3d2b35"
        >
          R$ {total}
        </text>
      </svg>

      <div className="flex flex-col gap-2.5 flex-1">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: item.color }}
            />
            <span className="text-sm text-gray-500 flex-1">{item.label}</span>
            <span className="text-sm font-medium text-gray-700">
              R$ {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
